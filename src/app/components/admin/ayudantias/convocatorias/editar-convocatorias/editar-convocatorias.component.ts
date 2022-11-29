import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';
import { Convocatoria } from 'src/app/interfaces/convocatorias.interface';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { FormControl, NgForm } from '@angular/forms';
import { Etapas } from 'src/app/interfaces/etapas.interfaces';
import { Api, EtapasMonitorias } from '../../../../../class/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';

declare var $:any;
declare var Tutorial:any;

@Component({
  selector: 'app-editar-convocatorias',
  templateUrl: './editar-convocatorias.component.html',
  styleUrls: ['./editar-convocatorias.component.css'],
  providers: [MessageService]

})
export class EditarConvocatoriasComponent implements OnInit, OnDestroy {
  id:number;
  convocatoria: Convocatoria;
  tipoConvocatoria: number;
  bolsas:Objeto[]=[];
  estados:Objeto[]=[];
  errores:Message[]=[];
  dateNow: Date;
  isValid:string="";
  send:boolean=false;
  mostrar:boolean=false;
  etapa:Etapas={
    fecha_fin:null,
    fecha_inicio:null,
    estado_id:null,
    peso_etapa:null,
    peso:null
  };
  api:string = Api.dev;
  editar:boolean=false;
  guardar:boolean=false;
  doc:number;
  tutorial:any = null;

  constructor(private router:Router,
              private route:ActivatedRoute,
              private _convocatoriaService:ConvocatoriaService,
              private messageService: MessageService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id = params.id;
      this._convocatoriaService.getConvocatoria(this.id).subscribe(data=>{
        this.tipoConvocatoria = data['convocatoria'][0]['tipo_id'];
        let fecha:any[];
        fecha = data['convocatoria'][0].fecha_expedicion.split("-")

        data['convocatoria'][0].fecha_expedicion = new Date(fecha[0], fecha[1]-1, fecha[2]);
        
        for(let i=0; i < data['convocatoria'][0].etapas.length; i++){
          fecha = data['convocatoria'][0].etapas[i].fecha_inicio.split("-");
          data['convocatoria'][0].etapas[i].fecha_inicio = new Date(fecha[0], fecha[1]-1, fecha[2], fecha[3] , fecha [4]);
          fecha = data['convocatoria'][0].etapas[i].fecha_fin.split("-");
          data['convocatoria'][0].etapas[i].fecha_fin = new Date(fecha[0], fecha[1]-1, fecha[2], fecha[3] , fecha [4]);          
        }

        this.bolsas = data['bolsas'];
        this.estados = data['estados'];
        this.convocatoria = data['convocatoria'][0];
        for(let i = 0; i < this.convocatoria.etapas.length; i++){
          for(let j = 0; j < data['estados'].length; j++){

            if(this.convocatoria.etapas[i].estado_id == data['estados'][j].id){

              this.convocatoria.etapas[i].peso_etapa = data['estados'][j].peso;
            }
          }
        }
        this.convocatoria.file_soporte = null;
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
    })
  }

  ngOnDestroy() {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.convocatoria.file_soporte=file;
    }
  }

  onClearFile(){
    this.convocatoria.file_soporte=null;
  }

  onUploadFileFormato(event){
    for(let file of event.files) {
      this.convocatoria.file_formato=file;
    }
  }

  onClearFileFormato(){
    this.convocatoria.file_formato=null;
  }
  
  
  onUploadFileR(event){
    for(let file of event.files) {
      this.convocatoria.file_soporte_resolucion=file;
    }
  }

  onClearFileR(){
    this.convocatoria.file_soporte_resolucion=null;
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

  addEtapas(){
    this.send=true;
    if(!this.etapa.fecha_inicio || !this.etapa.fecha_fin || !this.etapa.estado_id  ){
      return
    }

    if(this.etapa.fecha_fin < this.etapa.fecha_inicio){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'la fecha final no puede ser menor o igual a la inicial'});
      this.errores = [];
      return;
    }

    this.etapa.peso_etapa = this.estados[this.estados.findIndex(e => e.id == this.etapa.estado_id)].peso;
    this.etapa.nombre = this.estados[this.estados.findIndex(e => e.id == this.etapa.estado_id)].nombre;

    for(let i=0; i<this.convocatoria.etapas.length; i++){
      if(this.convocatoria.etapas[i].estado_id== this.etapa.estado_id){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Ya registró esa etapa, Por favor registre otra'});
        this.errores = [];
        return;
      }
      
      if((this.convocatoria.etapas[i].fecha_inicio!=null || this.convocatoria.etapas[i].fecha_fin !=null) && this.etapa.estado_id != EtapasMonitorias.INICIO_ACTIVIDADES_RATIFICADOS && this.etapa.estado_id != EtapasMonitorias.ENCUESTA_MONITORES && this.etapa.estado_id != EtapasMonitorias.ENCUESTA_MONITORES_TUTOR){

        if(this.etapa.fecha_inicio.getTime() === this.convocatoria.etapas[i].fecha_inicio.getTime() 
          || this.etapa.fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime()
          || this.etapa.fecha_inicio.getTime() == this.convocatoria.etapas[i].fecha_fin.getTime() 
          || this.etapa.fecha_fin.getTime() == this.convocatoria.etapas[i].fecha_inicio.getTime()
          || (this.etapa.fecha_fin.getTime() < this.convocatoria.etapas[i].fecha_fin.getTime() && this.etapa.fecha_fin.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime() )
          || (this.etapa.fecha_inicio.getTime() < this.convocatoria.etapas[i].fecha_fin.getTime() && this.etapa.fecha_inicio.getTime() > this.convocatoria.etapas[i].fecha_inicio.getTime() )){
          this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Verifique las fechas, Hay cruce en algunas fechas'});
            
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
       
    let et:Etapas={
      nombre : this.etapa.nombre,
      fecha_inicio : this.etapa.fecha_inicio,
      fecha_fin : this.etapa.fecha_fin,
      estado_id : this.etapa.estado_id,
      peso_etapa: this.etapa.peso_etapa
    };
    console.log(et);
    this.convocatoria.etapas.push(et);
   
    this.etapa.nombre = null;
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
      text: "¿Está seguro de eliminar el registro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-danger m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal(
          'Registro eliminado',
          'Acción realizada satisfactoriamente. Presione el botón Guardar para efectuar los cambios realizados',
          'success'
        )
        this.convocatoria.etapas.splice(idx,1);
      }
    })
  }

  editEtapa(etapa:Etapas = undefined){
    if(etapa == undefined){
      etapa={
        fecha_fin:null,
        fecha_inicio:null,
        estado_id:null,
        peso_etapa:null,
        peso:null
      };
    }
    this.etapa = Object.assign({},etapa);
    console.log(this.etapa);
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

  viewDoc(doc:number){
    this.doc=doc;
    $('#modelId').modal('show');
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

    if(this.convocatoria.etapas.length==0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Debe haber registrada una etapa al menos'});
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
    this._convocatoriaService.editarConvocatoria(this.convocatoria).subscribe(data=>{
      
      this.errores = [];
      if(data['success']==true){
          swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });
          this.spinner.hide();
          this.errores = [];

          setTimeout(() => {
            this.router.navigate(['/convocatorias',this.convocatoria.tipo_id]);
          }, 1500);
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:'Tiene errores en el formulario'});
        this.errores = [];
        for(let i=0; i<data['errores'].length; i++){
          if(data['errores'][i].errores.length>0){
            this.errores.push({severity:'error', summary:'', detail:data['errores'][i].errores[0]['ErrorMessage']});
          }
        }
        this.spinner.hide();
      }
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();  
    })  
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
      intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de edición de convocatorias</p><p class="container">El sistema permite editar la convocatoria para el periodo vigente en la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirá editar la convocatoria en el sistema.</p>'},
      elements:[
        {id: '#titulo', text: 'El campo "Título" permite modificar el nombre actual de la convocatoria, tenga en cuenta que solamente admite hasta un máximo de 255 caracteres. Al seleccionar el presupuesto, se le antepone al título la palabra "Convocatoria" y el periodo al cual pertenece dicho presupuesto. Este campo es obligatorio.'},
        {id: '#presupuesto', text: 'El campo "Presupuesto" permite modificar el presupuesto con el que se cuenta actualmente en la convocatoria, tenga en cuenta que solamente podrá seleccionar aquellos presupuestos que se encuentren activos en el sistema. Este campo es obligatorio.'},
        {id: '#fecha_expedicion', text: 'El campo "Fecha de expedición" permite modificar la fecha en la que se creó la convocatoria, tenga en cuenta que la fecha seleccionada no puede ser mayor a la fecha actual. Este campo es obligatorio.'},
        {id: '#soporte', text: 'El campo "Soporte" permite modificar el documento de soporte para la convocatoria, el cual deberá estar en formato PDF y con un peso menor o igual a 2MB. Este campo es obligatorio.'},
        {id: '#maximo_horas', text: 'El campo "Máximo de horas a realizar por estudiante" permite modificar el número máximo de horas que cada estudiante debe tener aprobadas para validar su trabajo en la convocatoria, tenga en cuenta que solamente admite valores numéricos entre 1 y 999, incluidos ambos. Este campo es obligatorio.'},
        {id: '#resolucion', text: 'El campo "Resolución" permite agregar un documento de resolución para la convocatoria en caso de ser necesario, el cual deberá estar en formato PDF y con un peso menor o igual a 2MB. Este campo <strong>no</strong> es obligatorio.'},
        {id: '#nota_min', text: 'El campo "Porcentaje mínimo de evaluación para aprobar estudiante" permite modificar el porcentaje mínimo que debe conseguir el estudiante en su proceso de evaluación para la aprobación en la convocatoria, tenga en cuenta que solamente admite valores numéricos entre 0 y 100, incluidos ambos. Este campo es obligatorio.'},
        {id: '#descripcion', text: 'El campo "Descripción" permite modificar la descripción sobre la convocatoria, tenga en cuenta que el texto ingresado no debe superar los 500 caracteres. Este campo <strong>no</strong> es obligatorio.'},
        {id: '#table_etapas', text: 'Esta tabla contiene las etapas que tiene la convocatoria. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de cada etapa de la convocatoria.'},
        {id: '#anadirEtapas', text: 'El botón "Añadir etapas" permite agregar etapas a la convocatoria en caso de que a esta le haga falta alguna.'},
        {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la fecha de inicio y final de la etapa de la convocatoria, tenga en cuenta que la fecha de inicio no debe ser mayor a la fecha de fin y tampoco pueden haber fechas cruzadas entre las etapas.', count: 1},
        {id: '#volver', text: 'El botón "Volver al listado" permite regresar a la lista de convocatorias.'},
        {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida, después de un breve periodo de tiempo será redirigido a la lista de convocatorias.'},
      ]
    });
    
    this.tutorial.start();
  }
}
