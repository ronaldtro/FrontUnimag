import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewChecked, AfterViewInit, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { ConvocatoriaAsistente, TablaSeleccion } from 'src/app/interfaces/inscripcion-estudiante.interfase';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';

declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-asistente-convocatoria',
  templateUrl: './asistente-convocatoria.component.html',
  styleUrls: ['./asistente-convocatoria.component.css'],
  providers: [MessageService]
})
export class AsistenteConvocatoriaComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  id:number;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);
  
  dateNow: Date;
  etapas: any [] = [];

  etapaActual = {
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };

  appliedFilters:any[] = [];

  convocatoria:ConvocatoriaAsistente = new ConvocatoriaAsistente();
  tabla:TablaSeleccion[] = [];

  userService: UserService;
  funciones:FuncionesJSService;

  estadoPreseleccion:boolean = false;
  estadoSeleccionDirecta:boolean = false;
  estadoCreacionDeTablas:boolean[];
  estadoPrimeraLista:boolean[];
  estadoSegundaLista:boolean[];

  constructor(private _convocatoriaService:ConvocatoriaRefrigerioService,
    private route:ActivatedRoute,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef ) { this.userService = _userService; this.funciones = funcionesP;}

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event) {
  //   swal({
  //     title: 'Salir del asistente',
  //     text: "Si sale del asistente sin terminar el proceso de selección puede ocasionar inconsistencias en los resultados ¿desea realizar salir?",
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: 'green',
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonClass: 'btn btn-success m-1',
  //     cancelButtonClass: 'btn m-1',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.value) {
  //       return false;
  //     }else{
  //       return true;
  //     }
  //   })
  // }

  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._convocatoriaService.getAsistente(this.id).subscribe(data=>{
        if(data['success']){
          this.convocatoria = data['convocatoria'];
          for(let i = 0; i < this.convocatoria.beneficios.length; i++){
            this.convocatoria.beneficios[i]['table_done'] = false;
            this.convocatoria.beneficios[i]['first_done'] = false;
            this.convocatoria.beneficios[i]['second_done'] = false;
          }
          console.log(this.convocatoria.beneficios);
          this.etapas = data['etapas'];
          if (data['etapaActual'] != null) {
            this.etapaActual = data['etapaActual'];
          } else {
            this.etapaActual.id = 0;
          }
          
        }
        this.spinner.hide();
        },      
        err=>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            this.spinner.hide();  
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            }); 
          })
      });
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
    
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 2, "asc" ], [ 3, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5, 6, 7]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5,  6, 7]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5, 6, 7]
        }
      }
    ];
  }

  esMenorAEtapaActual(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') < new Date(this.etapaActual.fechaFin + 'T23:59:59Z');
  }

  esMayorAHoy(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') >= new Date();
  }

  esIgual(fechaInicio:string, fechaFin:string){
    return new Date(fechaInicio + 'T23:59:59Z').getTime() === new Date(fechaFin + 'T23:59:59Z').getTime();
  }

  preseleccion(id:number){
    swal({
      title: 'Realizar acción',
      text: "¿Está seguro de realizar esta preselección?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this._convocatoriaService.preseleccion(id).subscribe(data=>{
          if(data['success']){
            swal(
              'Realizado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
            this.spinner.hide();
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: data['errores'],
            });
            this.spinner.hide();
          }         
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });
  }

  aprobarDirectos(id:number){
    swal({
      title: 'Seleccionar estudiantes con condiciones',
      text: "¿Está seguro de realizar la selección de los estudiantes con condiciones?. Estos serán elegidos todos los días indicados en su inscripción.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this._convocatoriaService.seleccionDirecta(id).subscribe(data=>{         
          if(data['success']){
            this.estadoSeleccionDirecta = data['success'];
            swal(
              'Realizado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
            this.spinner.hide();
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: data['errores'],
            });
            this.spinner.hide();
          }
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });
  }

  seleccion(id:number, beneficio:any){
    swal({
      title: 'Seleccionar estudiantes en primera lista de ' + beneficio.nombre,
      text: "El sistema seleccionará a los estudiantes aleatoriamente acorde a la tabla generada anteriormente. ¿Desea continuar?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();

        let seleccion:any={};
        seleccion.id = id;
        seleccion.beneficio = beneficio.id;

        this._convocatoriaService.seleccion(seleccion).subscribe(data=>{         
          if(data['success']){
            swal(
              'Realizado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
            beneficio.first_done = data['success'];
            this.spinner.hide();
          }else{
            this.spinner.hide();
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                swal({
                  type: 'error',
                  title: 'Error',
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                });
              }
            }           
          }         
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });
  }

  crearTablaBeneficio(id:number, beneficio:any){
    swal({
      title: 'Crear tabla de selección de cupos por programa en ' + beneficio.nombre,
      text: "El sistema generará la distribución de cupos por programa según la cantidad de estudiantes preseleccionados y el estrato socioeconómico de los mismos. Esta podrá ser visualizada posteriormente ¿Desea continuar?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();

        let seleccion:any={};
        seleccion.id = id;
        seleccion.beneficio = beneficio.id;

        this._convocatoriaService.crearTablaBeneficio(seleccion).subscribe(data=>{         
          if(data['success']){
            swal(
              'Realizado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
            beneficio.table_done = data['success'];
            this.spinner.hide();
          }else{
            this.spinner.hide();
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                swal({
                  type: 'error',
                  title: 'Error',
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                });
              }
            }           
          }         
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });
  }

  seleccionSegundaLista(id:number, beneficio:any){
    swal({
      title: 'Seleccionar estudiantes en segunda lista de ' + beneficio.nombre,
      text: "El sistema seleccionará aleatoriamente a estudiantes según los días restantes hasta completar con los cupos disponibles en la convocatoria. ¿Desea continuar?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();

        let seleccion:any={};
        seleccion.id = id;
        seleccion.beneficio = beneficio.id;

        this._convocatoriaService.seleccionSegundaLista(seleccion).subscribe(data=>{         
          if(data['success']){
            swal(
              'Realizado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
            beneficio.second_done = data['success'];
            this.spinner.hide();
          }else{
            this.spinner.hide();
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                swal({
                  type: 'error',
                  title: 'Error',
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                });
              }
            }           
          }         
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });
  }

  all_done():boolean{
    let done = true;
    if(this.convocatoria.beneficios){
      for(let i = 0; i < this.convocatoria.beneficios.length; i++){
        if(!this.convocatoria.beneficios[i]['table_done'] || !this.convocatoria.beneficios[i]['first_done']  || !this.convocatoria.beneficios[i]['second_done'])
        done = false;
        break;
      }
    }else{
      done = false;
    }
    
    return this.estadoSeleccionDirecta && done;
  }

  verTabla(idConvocatoria:number,idBeneficio:number){
    
    let seleccion:any={};
    seleccion.id = idConvocatoria;
    seleccion.beneficio = idBeneficio;

    this._convocatoriaService.getTablaSeleleccion(seleccion).subscribe(data=>{
      if(data['success']){
        this.tabla = data['tabla'];

        this.initDtOptions();
        this.dtTrigger.next();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.column(0).visible(false);
        }); 
        
      }
      this.spinner.hide();
      $('#tablaSeleccion').modal('show');
      },      
      err=>{
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        }); 
    })
  }

}
