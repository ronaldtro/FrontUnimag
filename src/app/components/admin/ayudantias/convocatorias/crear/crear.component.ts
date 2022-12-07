import { Component, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';

import { Convocatoria } from '../../../../../interfaces/convocatorias.interface';
import { NgForm, FormControl } from '@angular/forms';
import { Etapas } from '../../../../../interfaces/etapas.interfaces';
import { Objeto } from '../../../../../interfaces/objeto.interfaces';
import swal from 'sweetalert2';
import {MessageService} from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { EtapasMonitorias } from 'src/app/class/api';

declare var $:any;
declare var Tutorial:any;

//SERVICIOS
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
  providers: [MessageService]
})
export class CrearComponent implements OnInit, OnDestroy {
  
  bolsas:Objeto[]=[];
  estados:Objeto[]=[];
  isValid:string="";
  guardar:boolean=false;
  editar:boolean=false;
  idx:number;
  errores:Message[]=[];
  es: any;

  tutorial:any = null;

  etapa:Etapas={
    fecha_fin:null,
    fecha_inicio:null,
    estado_id:null,
    peso_etapa:null
  };
  dateNow: Date;
  send:boolean=false;
  mostrar:boolean=false;
  
  convocatoria: Convocatoria={
    etapas:[],
    bolsa_presupuestal_id : null,
    tipo_id:null,
    tipo:null,
  };
  id: any;
  
  
  constructor( private _convocatoriaService:ConvocatoriaService, 
               private messageService: MessageService,
               private router:Router,
               private route:ActivatedRoute,
               private _location: Location,
               private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id = params.id;
    this._convocatoriaService.getDatos(this.id).subscribe(data=>{
      this.bolsas = data['bolsas'];
      this.estados = data['estados'];
      for (let i = 0; i < data['estados'].length; i++) {
        let et:Etapas={
          fecha_inicio : null,
          fecha_fin: null,
          estado_id : data['estados'][i].id,
          peso_etapa : data['estados'][i].peso
        };
        this.convocatoria.etapas.push(et);
      }        
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
      this.spinner.hide(); 
    });
  }); 

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
      dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  ngOnDestroy(): void {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  pasarFecha(fechaInicio: Date, fechaFin: Date){
    fechaFin = fechaInicio;
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.convocatoria.file_soporte=file;
    }
  }

  onClearFile(){
    this.convocatoria.file_soporte=null;
  }

  onUploadFileR(event){
    for(let file of event.files) {
      this.convocatoria.file_soporte_resolucion=file;
    }
  }

  onClearFileR(){
    this.convocatoria.file_soporte_resolucion=null;
  }

  onUploadFileFormato(event){
    for(let file of event.files) {
      this.convocatoria.file_formato=file;
    }
  }

  onClearFileFormato(){
    this.convocatoria.file_formato=null;
  }

  save(formulario:NgForm){
    
    if(!formulario.valid){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Complete todos los campos del formulario'});
      this.errores = [];
      if(!formulario.controls.fecha_expedicion.valid){
        this.isValid="is-invalid";
      }else{
        this.isValid="";
      }
      return
    }

    if(!this.convocatoria.file_soporte){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Complete todos los campos del formulario'});
      this.errores = [];
      return
    }
    if(this.convocatoria.etapas.length==0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Debe haber registrada al menos una etapa'});
      this.errores = [];
      return
    }

    for(let i=0; i<this.convocatoria.etapas.length; i++){
      if(this.convocatoria.etapas[i].fecha_inicio==null && this.convocatoria.etapas[i].fecha_fin==null){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Las fechas de las etapas no pueden quedar vacías'});
        this.errores = [];
        return;
      }
    }
      
    this.spinner.show();
    this.convocatoria.tipo_id = this.id;
    this._convocatoriaService.guardarConvocatoria(this.convocatoria).subscribe(data=>{
      this.errores = [];
      if(data['success']==true){
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });        
        this.errores = [];
        setTimeout(() => {
          this.router.navigate(['/convocatorias',this.id]);
        }, 1500);

      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:'Tiene errores en el formulario'});
        for(let i=0; i<data['errores'].length; i++){
          if(data['errores'][i].errores.length>0){
            this.errores.push({severity:'error', summary:'', detail:data['errores'][i].errores[0]['ErrorMessage']});
          }
        }
      }
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
      this.spinner.hide();  
    })
  }

  validation(control:FormControl){
    if(control.valid==false){
      this.isValid="is-invalid";
    }else{
      this.isValid="";
    }
  }

  isFechaValid(fecha:Date, touch:boolean):string{
    if(!fecha && (this.send || touch)){
      return "is-invalid"
    }
    return "";
  }

  addEtapas(fecha_inicio:Date, fecha_fin:Date, estado_id:number, peso:number){
    this.send=true;
    if(!fecha_inicio || !fecha_fin || !estado_id  ){
      return
    }

    if(fecha_fin<fecha_inicio){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'la fecha final no puede ser menor o igual a la inicial'});
      this.errores = [];
      return;
    }

    for(let i=0; i<this.convocatoria.etapas.length; i++){
      if(this.convocatoria.etapas[i].estado_id==estado_id){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Ya registró esa etapa, Por favor registre otra'});
        this.errores = [];
        return;
      }
      if(this.convocatoria.etapas[i].fecha_inicio!=null || this.convocatoria.etapas[i].fecha_fin !=null){

        if(this.convocatoria.etapas[i].estado_id != 29){
          if(fecha_inicio.getTime() === this.convocatoria.etapas[i].fecha_inicio.getTime() 
            || fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
            || fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime() 
            || fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_inicio.getTime()
            || (fecha_fin.getTime() < this.convocatoria.etapas[i].fecha_fin.getTime() && fecha_fin.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime() )
            || (fecha_inicio.getTime() < this.convocatoria.etapas[i].fecha_fin.getTime() && fecha_inicio.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime() )){
            this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Verifique las fechas, Hay cruce en algunas fechas'});
            this.errores = [];
            return; 
          }

          if(peso > this.convocatoria.etapas[i].peso_etapa){
            if(fecha_inicio.getTime() < this.convocatoria.etapas[i].fecha_inicio.getTime()
            ||fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
            ||fecha_fin.getTime() < this.convocatoria.etapas[i].fecha_inicio.getTime()
            ||fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()){
            this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Las fechas de esta etapa deben ser mayores a las ya ingresadas'});
            this.errores = [];
            return; 
            }

          }

          if(peso < this.convocatoria.etapas[i].peso_etapa){
            if(fecha_inicio.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime()
            ||fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
            ||fecha_fin.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime()
            ||fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()){
              
            this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Las fechas de esta etapa deben ser menores a las ya ingresadas'});
            this.errores = [];
            return; 
            }
          }
        }
        
      }
    }
   
    
    let et:Etapas={
      fecha_inicio,
      fecha_fin,
      estado_id,
      peso_etapa:peso

    };
   
    this.convocatoria.etapas.push(et);
    this.etapa.fecha_fin=null;
    this.etapa.fecha_inicio=null;
    this.etapa.estado_id=null;
    this.mostrar=false;
    $('#exampleModal').modal('hide')

    this.send=false;
  }

  deleteEtapas(idx:number){
        
    swal({
      title: 'Eliminar registro',
      text: "¿Está seguro de eliminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      // confirmButtonClass: 'btn btn-danger m-1',
      // cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal(
          'Registro eliminado',
          'Acción realizada satisfactoriamente. Presione el botón Guardar para efectuar los cambios realizados.',
          'success'
        )
        this.convocatoria.etapas.splice(idx,1);
      }
    })
  }

  editEtapa(etapa:Etapas){
    this.etapa = Object.assign({}, etapa);
    // this.etapa.estado_id=this.convocatoria.etapas[idx].estado_id
    // this.etapa.fecha_inicio=this.convocatoria.etapas[idx].fecha_inicio
    // this.etapa.fecha_fin=this.convocatoria.etapas[idx].fecha_fin
    // this.etapa.peso_etapa=this.convocatoria.etapas[idx].peso_etapa
  }

  saveEdit(){

    this.send=true;
    if(!this.etapa.fecha_inicio || !this.etapa.fecha_fin || !this.etapa.estado_id  ){
      return
    }

    if(this.etapa.fecha_fin < this.etapa.fecha_inicio){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'la fecha final no puede ser menor o igual a la inicial'});
      this.errores = [];
      return;
    }
    for(let i=0; i<this.convocatoria.etapas.length; i++){
      if(this.convocatoria.etapas[i].estado_id != this.etapa.estado_id){
        //Si la etapa es diferente a la etapa de inicio de actividades de ratificados
        if(this.etapa.estado_id != EtapasMonitorias.INICIO_ACTIVIDADES_RATIFICADOS && this.etapa.estado_id != EtapasMonitorias.ENCUESTA_MONITORES && this.etapa.estado_id != EtapasMonitorias.ENCUESTA_MONITORES_TUTOR){
          if((this.convocatoria.etapas[i].fecha_inicio!=null || this.convocatoria.etapas[i].fecha_fin !=null) && this.convocatoria.etapas[i].estado_id != EtapasMonitorias.INICIO_ACTIVIDADES_RATIFICADOS && this.convocatoria.etapas[i].estado_id != EtapasMonitorias.ENCUESTA_MONITORES && this.convocatoria.etapas[i].estado_id != EtapasMonitorias.ENCUESTA_MONITORES_TUTOR){
            
              if(this.etapa.fecha_inicio.getTime() === this.convocatoria.etapas[i].fecha_inicio.getTime() 
                || this.etapa.fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
                || this.etapa.fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime() 
                || this.etapa.fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_inicio.getTime()
                || (this.etapa.fecha_fin.getTime() < this.convocatoria.etapas[i].fecha_fin.getTime() && this.etapa.fecha_fin.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime() )
                || (this.etapa.fecha_inicio.getTime() < this.convocatoria.etapas[i].fecha_fin.getTime() && this.etapa.fecha_inicio.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime() )){
                this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Hay cruce en algunas fechas'});
                this.errores = [];
                return; 
              }
            
          
              if(this.etapa.peso_etapa > this.convocatoria.etapas[i].peso_etapa){
                if(this.etapa.fecha_inicio.getTime() < this.convocatoria.etapas[i].fecha_inicio.getTime()
                ||this.etapa.fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
                ||this.etapa.fecha_fin.getTime() < this.convocatoria.etapas[i].fecha_inicio.getTime()
                ||this.etapa.fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()){
                  this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Las fechas de esta etapa deben ser mayores a las ya ingresadas'});
                  this.errores = [];
                  return; 
                }
              }
  
              if(this.etapa.peso_etapa < this.convocatoria.etapas[i].peso_etapa){
                if(this.etapa.fecha_inicio.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime()
                ||this.etapa.fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
                ||this.etapa.fecha_fin.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime()
                ||this.etapa.fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()){
                  this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Las fechas de esta etapa deben ser menores a las ya ingresadas'});
                  this.errores = [];
                return; 
                }
        
              }
            
          }
        }
        
      }else{
        if(this.guardar){
          this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Ya registró esa etapa, Por favor registre otra'});
          this.errores = [];
          return;
        }
        
      }
    }

    this.convocatoria.etapas[this.convocatoria.etapas.findIndex(e => e.estado_id == this.etapa.estado_id)] = Object.assign({},this.etapa);

    // let et:Etapas={
    //   fecha_inicio,
    //   fecha_fin,
    //   estado_id,
    //   peso_etapa:peso
    // };

    // this.convocatoria.etapas[idx]=et;
   
    this.etapa.fecha_fin=null;
    this.etapa.fecha_inicio=null;
    this.etapa.estado_id=null;
    this.mostrar=false;
    $('#exampleModal').modal('hide')

    this.send=false;

    

  }

  clearModal(){
    this.send=false;
    this.mostrar=false;
    this.etapa.estado_id=null
    this.etapa.fecha_inicio=null
    this.etapa.fecha_fin=null
  }

  changePeso(estado_id){

    for (let i = 0; i < this.estados.length; i++) {
      if(this.estados[i].id== estado_id){
        this.etapa.peso_etapa = this.estados[i].peso;

      }
    }
  }

  changeTitulo(id:number){

    let result = this.bolsas.find(obj => obj.id==id);

    if(this.convocatoria.titulo =='' || !this.convocatoria.titulo){
      this.convocatoria.titulo = "Convocatoria " + result['periodo']+" - " 
    }else{
      let titulo = this.convocatoria.titulo.split(" - ");
      if(titulo[1]){
        this.convocatoria.titulo = "Convocatoria " + result['periodo']+ " - " + titulo[1] 
      }else{
        this.convocatoria.titulo = "Convocatoria " + result['periodo']+ " - " + titulo[0] 
      }
    }
  }

  initTutorial(){

    this.tutorial = new Tutorial(
    {
      intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de creación de convocatorias</p><p class="container">El sistema permite añadir nuevas convocatorias para el periodo vigente en la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán crear las convocatorias en el sistema.</p>'},
      elements:[
        {id: '#titulo', text: 'El campo "Título" permite ingresar el nombre que tendrá la convocatoria, tenga en cuenta que solamente admite hasta un máximo de 255 caracteres. Al seleccionar el presupuesto, se le antepone al título la palabra "Convocatoria" y el periodo al cual pertenece dicho presupuesto. Este campo es obligatorio.'},
        {id: '#presupuesto', text: 'El campo "Presupuesto" permite seleccionar el presupuesto con el que se cuenta para crear la convocatoria, tenga en cuenta que solamente podrá seleccionar aquellos presupuestos que se encuentren activos en el sistema. Este campo es obligatorio.'},
        {id: '#fecha_expedicion', text: 'El campo "Fecha de expedición" permite seleccionar la fecha en la que se está creando la convocatoria, tenga en cuenta que la fecha seleccionada no puede ser mayor a la fecha actual. Este campo es obligatorio.'},
        {id: '#soporte', text: 'El campo "Soporte" permite adjuntar un documento de soporte para la convocatoria, el cual deberá estar en formato PDF y con un peso menor o igual a 2MB. Este campo es obligatorio.'},
        {id: '#nota_min', text: 'El campo "Porcentaje mínimo de evaluación para aprobar estudiante" permite ingresar el porcentaje mínimo que debe conseguir el estudiante en su proceso de evaluación para la aprobación en la convocatoria, tenga en cuenta que solamente admite valores numéricos entre 0 y 100, incluidos ambos. Este campo es obligatorio.'},
        {id: '#maximo_horas', text: 'El campo "Máximo de horas a realizar por estudiante" permite ingresar el número máximo de horas que cada estudiante debe tener aprobadas para validar su trabajo en la convocatoria, tenga en cuenta que solamente admite valores numéricos entre 1 y 999, incluidos ambos. Este campo es obligatorio.'},
        {id: '#descripcion', text: 'El campo "Descripción" permite ingresar una descripción sobre la convocatoria, tenga en cuenta que el texto ingresado no debe superar los 500 caracteres. Este campo <strong>no</strong> es obligatorio.'},
        {id: '#table_etapas', text: 'Esta tabla contiene las etapas que debe tener cada convocatoria. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de cada etapa de la convocatoria.'},
        {id: '#anadirEtapas', text: 'El botón "Añadir etapas" permite agregar etapas a la convocatoria en caso de que a esta le haga falta alguna.'},
        {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la fecha de inicio y final de la etapa de la convocatoria, tenga en cuenta que la fecha de inicio no debe ser mayor a la fecha de fin y tampoco pueden haber fechas cruzadas entre las etapas.', count: 1},
        {id: '#volver', text: 'El botón "Volver al listado" permite regresar a la lista de convocatorias.'},
        {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida, después de un breve periodo de tiempo será redirigido a la lista de convocatorias.'},
      ]
    });
    
    this.tutorial.start();
  }

  goBack():void{
    this._location.back();
  }
  
}
