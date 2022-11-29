import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { InscritosService } from 'src/app/services/inscritos-refrigerios.service';
import { ActivatedRoute } from '@angular/router';
import { InscripcionRefrigerio } from 'src/app/interfaces/inscripcion-estudiante.interfase';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { MessageService } from 'primeng/api';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Api } from 'src/app/class/api';
declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-listado-inscritos',
  templateUrl: './listado-inscritos.component.html',
  styleUrls: ['./listado-inscritos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class ListadoInscritosComponent implements OnInit, AfterViewChecked, OnDestroy {
  id:number;
  index:number;
  rutaPdf:string;
  api:string = Api.dev;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);

  errores:any[] = [];
  codigosInvalidos:any[] = [];
  historialEstados:any[] = [];
  error: any[] = [];
  idx_inscrito:number = null;
  observacion:string=null;
  dateNow: Date;
  estadosEstudiante: any [] = [];
  etapas: any [] = [];
  codigos:string=null;
  arrayCodigos:any[]=[];
  array:string[]=[];
  etapaActual = {
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };

  appliedFilters:any[] = [];
  
  estadoEstudiante:number = null;
  auxInscrito:any ={};
  auxInscritoDia:any ={};
  file_soporte?:File;
  registroCambioEstado:any = {
    'estado_id':null,
    'observacion':null,
  };

  convocatoria:InscripcionRefrigerio = {
    estudiantes:[]
  };

  
  es:any = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
    dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
    dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
    monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
    monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
    today: 'Hoy',
    clear: 'Limpiar'
};

userService: UserService;
 funciones:FuncionesJSService;

 estudiantes:any[]=[];

  constructor(private _inscritosServices:InscritosService,
    private route:ActivatedRoute,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef ) { this.userService = _userService; this.funciones = funcionesP;}

  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._inscritosServices.getEstudiantes(this.id).subscribe(data=>{
        if(data['success']){
          this.estadosEstudiante = data['estadosEstudiantes'];
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
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.column(8).visible(false);
          }); 
          
        }
        this.spinner.hide();
        this.cdr.detectChanges();
        },      
        err=>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            this.spinner.hide();  
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            }); 
            this.cdr.detectChanges();
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
    this.dtOptions.order = [[ 7, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.deferRender = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      this.funciones.addFilter(this, 3, "#filter-programa");
      this.funciones.addFilter(this, 5, "#filter-beneficio");
      this.funciones.addFilter(this, 7, "#filter-estado");  
      this.funciones.addFilter(this, 6, "#filter-dia");    
      $("#filter-dia").on('change',() => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {        
            //dtInstance.columns().search("").draw();
            var val = $.fn.dataTable.util.escapeRegex(
                $("#filter-dia").val()
            );
            
            this.funciones.showFilter(this,{idx: 6, idElement: '#filter-dia', name: ($("#filter-dia").val() != "") ? dtInstance.column(6).header().textContent + " : " + $("#filter-dia").val() : ""});
            
            dtInstance.column(6).search( $("#filter-dia").val() )
                .draw();          
        });
      });
    }
    
  }

  cambiarEstadoModal(estudiante){
    this.auxInscrito.codigo = estudiante.codigo;
    this.auxInscrito.convocatoria_id = this.convocatoria.id;
    this.auxInscrito.beneficio = estudiante.beneficio_id;
    this.errores = [];
    this.file_soporte = null;
    $('#estadoModal').modal('show');
    this.cdr.detectChanges();
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
    this.auxInscrito.estado_id = this.registroCambioEstado.estado_id;
    this.auxInscrito.observacion = this.registroCambioEstado.observacion;
    for (let index = 0; index < this.estadosEstudiante.length; index++) {
      if (this.estadosEstudiante[index].id == this.auxInscrito.estado_id) {
        this.auxInscrito.estado = this.estadosEstudiante[index].nombre;
        break;
      }
      
    }

    let formData = new FormData();
    for (let nombre in this.auxInscrito) {
      if (this.auxInscrito[nombre] != null && this.auxInscrito[nombre] != "") {
        formData.append(nombre, this.auxInscrito[nombre]);
      }
    }
    
    if (this.file_soporte != null) {
      formData.append("file_soporte", this.file_soporte);
    }

    this.spinner.show();
    this._inscritosServices.cambiarEstadoEstudiante(formData).subscribe(data => {
      if(data['success']){
        for(let i=0;i<this.convocatoria.estudiantes.length;i++){
          if(this.convocatoria.estudiantes[i].codigo == this.auxInscrito.codigo && this.convocatoria.estudiantes[i].beneficio_id == this.auxInscrito.beneficio){
            this.convocatoria.estudiantes[i]['estadoInscripcion'] = this.auxInscrito.estado;
            this.convocatoria.estudiantes[i]['estadoInscripcionId']= this.auxInscrito.estado_id;
            break;
          }
        }
        
        soporte.clear();
        //this.rerender();
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
        this.spinner.hide();
        this.cdr.detectChanges();
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        this.spinner.hide();
        this.cdr.detectChanges();
      }
      
    }),error=>{
      swal({
        type: 'error',
        title: 'Error',
        text: 'No se pudo efectuar la operación. Intente más tarde.',
      })
      this.spinner.hide();
      this.cdr.detectChanges();
  };
    
  }

  cambiarEstadoDiaModal(estudiante){
    this.auxInscritoDia.codigo = estudiante.codigo;
    this.auxInscritoDia.convocatoria_id = this.convocatoria.id;
    this.auxInscritoDia.beneficio = estudiante.beneficio_id;
    this.errores = [];
    this.spinner.show();
    this._inscritosServices.consultarDias(this.auxInscritoDia).subscribe(data => {
      if(data['success']){
        this.auxInscritoDia.dias = data['dias'];
        for (let index = 0; index < this.auxInscritoDia.dias.length; index++) {
          this.auxInscritoDia.dias[index].nuevoEstado = null;
        }
        this.cdr.detectChanges();
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        this.cdr.detectChanges();
      }    
      
      this.spinner.hide();
      this.cdr.detectChanges();
    }),error=>{
      swal({
        type: 'error',
        title: 'Error',
        text: 'No se pudo efectuar la operación. Intente más tarde.',
      })
      this.spinner.hide();
    };
    $('#estadoDiaModal').modal('show');
    this.cdr.detectChanges();
  }

  cambiarDiaEstado(formulario:NgForm){

    this.spinner.show();
    this._inscritosServices.cambiarEstadoDiaEstudiante(this.auxInscritoDia).subscribe(data => {
      if(data['success']){

        for(let i=0;i<this.convocatoria.estudiantes.length;i++){
          if(this.convocatoria.estudiantes[i].codigo == this.auxInscritoDia.codigo && this.convocatoria.estudiantes[i].beneficio_id == this.auxInscritoDia.beneficio){
            this.convocatoria.estudiantes[i]['estadoInscripcion'] = data['estadoNuevo']['nombre'];
            this.convocatoria.estudiantes[i]['estadoInscripcionId'] = data['estadoNuevo']['id'];
            break;
          }
        }

        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        formulario.resetForm();
        $('#estadoDiaModal').modal('hide');
        this.spinner.hide();
        this.cdr.detectChanges();
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        this.spinner.hide();
        this.cdr.detectChanges();
      }
      
    }),error=>{
      swal({
        type: 'error',
        title: 'Error',
        text: 'No se pudo efectuar la operación. Intente más tarde.',
      })
      this.spinner.hide();
      this.cdr.detectChanges();
    };
    
  }

  verHistorialEstado(postulado){

    this.historialEstados = postulado.historialEstado;
    $('#historialEstadosModal').modal('show');
    this.cdr.detectChanges();
  }

  verSoporteEstado(estado){
    this.rutaPdf = estado.soporte;
    $('#historialEstadosModal').modal('hide');
    $('#pdfSoporte').modal('show');
    this.cdr.detectChanges();
  }

  closeSoporte(){
    $('#pdfSoporte').modal('hide');
    $('#historialEstadosModal').modal('show'); 
    this.cdr.detectChanges();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
    this.cdr.detectChanges();
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

  cambiarEstadosMultiples(){
    this.errores = [];
    this.arrayCodigos = [];
    this.file_soporte = null;
    $('#estadoModalMultiple').modal('show');
  }

  cambiarEstadoMultiple(formulario:NgForm, soporte){
    if(!formulario.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Revise el formulario y vuelva a intentarlo.',
      });
      return
    }
   

    this.array = this.codigos.split(",");

    for (let i = 0; i < this.array.length; i++) {
      this.arrayCodigos.push(this.array[i].trim())   
    }

    for (let i = 0; i < this.arrayCodigos.length; i++) {
      if (this.arrayCodigos[i].length == 0) {
        this.arrayCodigos.splice(i,1);
      }
    }

    this.auxInscrito.convocatoria_id = this.convocatoria.id;
    this.auxInscrito.estado_id = this.registroCambioEstado.estado_id;
    this.auxInscrito.observacion = this.registroCambioEstado.observacion;
    for (let index = 0; index < this.estadosEstudiante.length; index++) {
      if (this.estadosEstudiante[index].id == this.auxInscrito.estado_id) {
        this.auxInscrito.estado = this.estadosEstudiante[index].nombre;
        break;
      } 
    }

    let formData = new FormData();
    for (let nombre in this.auxInscrito) {
      if (this.auxInscrito[nombre] != null && this.auxInscrito[nombre] != "") {
        formData.append(nombre, this.auxInscrito[nombre]);
      }
    }

    for (let index = 0; index < this.arrayCodigos.length; index++) {
      formData.append('codigos[]', ""+this.arrayCodigos[index]);   
    }
    
    if (this.file_soporte != null) {
      formData.append("file_soporte", this.file_soporte);
    }

    this.spinner.show();
    this._inscritosServices.cambiarEstadoMultiple(formData).subscribe(data => {
      if(data['success']){

        for (let j = 0; j < data['codigosValidos'].length; j++) {
          for(let i=0;i<this.convocatoria.estudiantes.length;i++){
            if(this.convocatoria.estudiantes[i].codigo == data['codigosValidos'][j]){
              this.convocatoria.estudiantes[i]['estadoInscripcion'] = this.auxInscrito.estado;
              this.convocatoria.estudiantes[i]['estadoInscripcionId']= this.auxInscrito.estado_id;
              break;
            }
          }
        }
        
        this.codigosInvalidos = null;
        if (data['codigosInvalidos'].length > 0) {
          this.codigosInvalidos = data['codigosInvalidos'];
        }
        
        soporte.clear();
        //this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        this.file_soporte = null;
        formulario.resetForm();
        $('#estadoModalMultiple').modal('hide');
        this.cdr.detectChanges();
      }else{
        this.errores = data['errores'];
        if (data['codigosInvalidos'].length > 0) {
          this.codigosInvalidos = data['codigosInvalidos'];
        }
        this.spinner.hide();
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        $('#estadoModalMultiple').modal('hide');
        this.arrayCodigos = [];
        this.cdr.detectChanges();
      }
      
    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.arrayCodigos = [];
      this.spinner.hide()
      this.cdr.detectChanges();
    });
  }

  cambiarEstadoCheck(){
    this.auxInscrito.convocatoria_id = this.convocatoria.id;
    this.errores = [];
    this.file_soporte = null;
    $('#estadoModalCheck').modal('show');
    this.cdr.detectChanges();
  }

  cambiarCheck(formulario:NgForm , soporte){
    if(!formulario.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Revise el formulario y vuelva a intentarlo.',
      });
      return
    }
    this.auxInscrito.estado_id = this.registroCambioEstado.estado_id;
    this.auxInscrito.observacion = this.registroCambioEstado.observacion;
    for (let index = 0; index < this.estadosEstudiante.length; index++) {
      if (this.estadosEstudiante[index].id == this.auxInscrito.estado_id) {
        this.auxInscrito.estado = this.estadosEstudiante[index].nombre;
        break;
      }      
    }

    let formData = new FormData();
    for (let nombre in this.auxInscrito) {
      if (this.auxInscrito[nombre] != null && this.auxInscrito[nombre] != "") {
        formData.append(nombre, this.auxInscrito[nombre]);
      }
    }
    
    if (this.file_soporte != null) {
      formData.append("file_soporte", this.file_soporte);
    }

    formData.append('estudiantesString', JSON.stringify(this.estudiantes));

    this.spinner.show();
    this._inscritosServices.cambiarEstadoEstudianteCheck(formData).subscribe(data => {
      if(data['success']){

        for (let j = 0; j < data['codigosValidos'].length; j++) {
          for(let i=0;i<this.convocatoria.estudiantes.length;i++){
            if(this.convocatoria.estudiantes[i].codigo == data['codigosValidos'][j].codigo && this.convocatoria.estudiantes[i].beneficio_id == data['codigosValidos'][j].beneficio_id){
              this.convocatoria.estudiantes[i]['estadoInscripcion'] = this.auxInscrito.estado;
              this.convocatoria.estudiantes[i]['estadoInscripcionId']= this.auxInscrito.estado_id;
              break;
            }
          }
        }

        this.codigosInvalidos = [];
        this.estudiantes = [];

        if (data['codigosInvalidos'].length > 0) {
          for (let i = 0; i < data['codigosInvalidos'].length; i++) {      
            this.codigosInvalidos.push(data['codigosInvalidos'][i].codigo);
          }
        }
        
        soporte.clear();
        //this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        this.file_soporte = null;
        formulario.resetForm();
        $('#estadoModalCheck').modal('hide');
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }


  Invalidos() {  
    $('#codigosInvalidos').modal({backdrop:"static"});
  }


}
