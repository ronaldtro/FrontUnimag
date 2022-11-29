import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'src/app/class/api';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { InscripcionRefrigerio, Falla } from 'src/app/interfaces/inscripcion-estudiante.interfase';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { InscritosService } from 'src/app/services/inscritos-refrigerios.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-listado-fallas',
  templateUrl: './listado-fallas.component.html',
  styleUrls: ['./listado-fallas.component.css'],
  providers: [MessageService]
})
export class ListadoFallasComponent implements OnInit {
  id:number;
  index:number;
  rutaPdf:string;
  api:string = Api.dev;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);

  errores:any[] = [];
  
  dateNow: Date;
  estadosEntrega: any [] = [];
  etapas: any [] = [];
  falla:Falla = new Falla();

  etapaActual = {
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };

  appliedFilters:any[] = [];
  
  estadoEstudiante:number = null;

  file_soporte?:File;
  registroCambioEstado:any = {
    'estado_id':null,
    'observacion':null,
  };

  convocatoria:InscripcionRefrigerio = {};

  fallas:Falla[] = [];

userService: UserService;
 funciones:FuncionesJSService;

  constructor(private _inscritosServices:InscritosService,
    private route:ActivatedRoute,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef ) { this.userService = _userService; this.funciones = funcionesP;}

  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._inscritosServices.getListarFallas(this.id).subscribe(data=>{
        if(data['success']){
          this.estadosEntrega = data['estadosEntrega'];
          this.convocatoria = data['convocatoria'];
          this.fallas = data['fallas'];
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
    let parent = this;
    $('#filter-beneficio select').on('change', function(){
      parent.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
         console.log(dtInstance.rows( { filter : 'applied'} ).data());
        });
    })
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
    this.dtOptions.order = [[ 5, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.select = true;
    this.dtOptions.deferRender = true;
    this.dtOptions.processing = true;
    // this.dtOptions.fnDrawCallback = function(){
    //   alert( 'DataTables has redrawn the table' );
    // }
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 3, "#filter-beneficio");
      this.funciones.addFilter(this, 4, "#filter-dia");
      this.funciones.addFilter(this, 5, "#filter-fecha");      
    }

  }

  cambiarEstadoModal(falla:Falla){
    this.falla = falla;
    this.errores = [];
    this.file_soporte = null;
    this.registroCambioEstado = {
      'estado_id':null,
      'observacion':null,
    };
    $('#estadoModal').modal('show');
  }

  cambiarEstado(formulario:NgForm , soporte){
    if(!formulario.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Revise el formulario y vuelva a intentarlo.',
      });
      return
    }

    if(this.file_soporte == null){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe adjuntar un soporte.',
      });
      return
    }

    let formData = new FormData();
    formData.append('id', ""+this.falla.id);
    formData.append('estado_id', ""+this.registroCambioEstado.estado_id);
    formData.append('soporte', this.file_soporte);
    formData.append('observacion', this.registroCambioEstado.observacion);

    this.spinner.show();
    this._inscritosServices.cambiarEstadoFalla(formData).subscribe(data => {
      if(data['success']){

        let index = this.fallas.indexOf(this.falla);
        this.fallas.splice(index, 1);

        soporte.clear();
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        this.file_soporte = null;
        formulario.resetForm();
        $('#estadoModal').modal('hide');
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.file_soporte=file;
    }
  }

  onClearFile(){
    this.file_soporte=null;
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

}
