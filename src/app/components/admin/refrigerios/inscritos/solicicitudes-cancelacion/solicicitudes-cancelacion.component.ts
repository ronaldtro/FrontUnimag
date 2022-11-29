import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef, OnDestroy } from '@angular/core';
import { InscritosService } from 'src/app/services/inscritos-refrigerios.service';
import { ActivatedRoute } from '@angular/router';
import { InscripcionRefrigerio } from 'src/app/interfaces/inscripcion-estudiante.interfase';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { MessageService } from 'primeng/api';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Api } from 'src/app/class/api';
declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-solicicitudes-cancelacion',
  templateUrl: './solicicitudes-cancelacion.component.html',
  styleUrls: ['./solicicitudes-cancelacion.component.css'],
  providers: [MessageService]
})
export class SolicicitudesCancelacionComponent implements OnInit, AfterViewChecked, OnDestroy {
  id:number;
  api:string = Api.dev;
  rutaPdf:string;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);

  errores:any[] = [];
  error: any[] = [];
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

  convocatoria:InscripcionRefrigerio = {
    estudiantes:[]
  };

  estudiante:any;
  auxInscrito:any ={};

  solicitud:any = {
    observacion:null
  };

  userService: UserService;
  funciones:FuncionesJSService;

  constructor(private _inscritosServices:InscritosService,
    private route:ActivatedRoute ,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef) { this.userService = _userService; this.funciones = funcionesP; }

    ngOnInit() {
      this.dateNow = new Date();
      this.spinner.show();
      this.route.params.subscribe(parametros => {
        this.id = parametros['id']; 
        this._inscritosServices.getSolicitudes(this.id).subscribe(data=>{
          if(data['success']){
            this.convocatoria = data['convocatoria'];
            this.convocatoria.estudiantes = data['estudiantes'];
            this.etapas = data['etapas'];
            if (data['etapaActual'] != null) {
              this.etapaActual = data['etapaActual'];
            } else {
              this.etapaActual.id = 0;
            }
            
            this.initDtOptions();
            this.dtTrigger.next();
            
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
      this.dtOptions.order = [[ 0, "asc" ]];
      this.dtOptions.dom = "Bfrtip";
      this.dtOptions.autoWidth = false;
      this.dtOptions.buttons = [
        {
          extend: 'copy',
          text: 'Copiar',
          exportOptions: {
            columns: [0, 1, 2, 3, 4]
          }
        },
        {
          extend: 'print',
          text: 'Imprimir',
          exportOptions: {
            columns: [0, 1, 2, 3, 4]
          }
        },
        {
          extend: 'excel',
          text: 'Excel',
          exportOptions: {
            columns: [0, 1, 2, 3, 4]
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

    verSolicitud(estudiante){
      this.estudiante = estudiante;
      this.solicitud = estudiante.solicitud;    
      $('#solicitudModal').modal('show');
    }

    viewDoc(doc:number){
      this.rutaPdf = this.solicitud.soporte;
      $('#pdfSoporte').modal('show');
    }

    closeSoporte(){
      $('#pdfSoporte').modal('hide');
    }

    respuesta(id:number, estudiante:any = undefined){
      swal({
        title: 'Cambiar estado',
        text: "¿Está seguro de realizar esta acción?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        reverseButtons: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'btn btn-success m-1',
        cancelButtonClass: 'btn m-1'
      }).then((res) => {
        if (res.value) {

          if (estudiante) {           
            this.auxInscrito.codigo = estudiante.codigo;
            this.auxInscrito.beneficio = estudiante.beneficio_id;
          } else {
            
            this.auxInscrito.codigo = this.estudiante.codigo;
            this.auxInscrito.beneficio = this.estudiante.beneficio_id;
          }
          this.auxInscrito.respuesta = id;
          this.auxInscrito.convocatoria_id = this.convocatoria.id;

          this.spinner.show();
          this._inscritosServices.respuesta(this.auxInscrito).subscribe(data => {
            if(data['success']){
              let index = this.convocatoria.estudiantes.indexOf(this.estudiante);
              this.convocatoria.estudiantes.splice(index,1);     
              swal({
                  title: "Realizado",
                  text: "Acción realizada satisfactoriamente.",
                  type: "success",
                  timer: 2000,
                  showConfirmButton: false
              });
              $('#solicitudModal').modal('hide');
            }else{
              this.errores = data['errores'];
              swal({
                type: 'error',
                title: 'Error',
                text: 'No se pudo efectuar la operación. Intente más tarde.',
              });
            }
            
          }),error=>swal({
            type: 'error',
            title: 'Error',
            text: 'No se pudo efectuar la operación. Intente más tarde.',
          });
          this.spinner.hide();
        }
      });
    }


}
