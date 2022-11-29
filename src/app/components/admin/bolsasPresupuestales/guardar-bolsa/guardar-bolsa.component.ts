import { Component, OnInit, OnDestroy } from '@angular/core';
import { BolsaPresupuestal } from 'src/app/interfaces/bolsaPresupuestal.interface';
import { FileUploadModule } from 'primeng/fileupload';
import { NgForm, FormControl } from '@angular/forms';
import {Router, ActivatedRoute} from "@angular/router";
import { BolsaPresupuestalService } from 'src/app/services/bolsa-presupuestal.service';
import swal from 'sweetalert2';
import { Api } from 'src/app/class/api';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $:any;
declare var Tutorial:any;

@Component({
  selector: 'app-guardar-bolsa',
  templateUrl: './guardar-bolsa.component.html',
  styleUrls: ['./guardar-bolsa.component.css']
})
export class GuardarBolsaComponent implements OnInit, OnDestroy {
  isValid:string="";
  send:boolean=false;
  rutaPdf:string;
  dateNow: Date;
  periodos:object[]=[];
  fuentes:object[]=[];
  fondos:object[]=[];
  api:string = Api.dev;
  valorBolsaAux:number;
  bolsa:BolsaPresupuestal = {
    denominacion: null,
    periodo_id: null,
    tipo_fondo_id: null,
    tipo_fuente_id: null
  }
  tutorial:any = null;
  id:number;
  file_soporte?:File;
  errores:object[]=[];
  mensajeError:any = null;
  constructor(private _bolsaPresupuestalService:BolsaPresupuestalService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService) { 
      this.spinner.show();
      this.route.params.subscribe(parametros=>{
        this.id = parametros['id'];
        this.spinner.hide();
        if(this.id != null){
          this._bolsaPresupuestalService.getBolsa(this.id)
            .subscribe(bolsa=>{this.bolsa = bolsa.bolsas,
              this.bolsa.valor = this.numberWithCommas(this.bolsa.valor)
              
            })
            
        }
        
      })
    this.spinner.show();
    this._bolsaPresupuestalService.getDatosSolicitar().subscribe(data => {
      this.periodos = data.periodos;
      this.fuentes = data.fuentes;
      this.fondos = data.fondos;
      this.spinner.hide();
    });

    /*this._bolsaPresupuestalService.getBolsa(this.id).subscribe(data => {
    });*/

  }

  ngOnInit() {
    this.dateNow = new Date();
  }

  ngOnDestroy() {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.file_soporte=file;
    }
  }

  onClearFile(){
    this.file_soporte=null;
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
  verSoporte(soporte){
    this.rutaPdf = soporte;
    $('#pdfSoporte').modal('show');
  }

  guardar(formulario:NgForm){
    this.errores = []; this.mensajeError = null;
    if(!formulario.valid || ((this.file_soporte == null || this.file_soporte.size == 0) && this.bolsa.id == null )){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Revise la información ingresada y vuelva a intentar guardar la información.',
      });
      return;
    }
    this.spinner.show();
    this._bolsaPresupuestalService.guardarBolsa(this.bolsa,this.file_soporte).subscribe(data => {
      if(data['success']){
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/bolsasPresupuestales']);
        }, 1500);
      }else{
        this.errores = data['errores'];
        this.mensajeError = data['mensajeError'];
       
        this.spinner.hide();
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
    if(this.file_soporte){return}
  }
  numberWithCommas(x) {
    if(typeof x != "number"){
      this.valorBolsaAux = x.replace(/,/g, '');
      x = x.replace(/,/g, '');
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.bolsa.valor = parts.join(".");
      return parts.join(".");
    }else{
      this.valorBolsaAux = x;
      var parts2 = x.toString().split(".");
      parts2[0] = parts2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts2.join(".");
      //this.bolsa.valor = parts2.join(".");
    }
    
  }

  initTutorial(x:number){
    
    if(x == 0){// Si se va a crear

      this.tutorial = new Tutorial(
        {
          intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de creación de bolsas presupuestales</p><p class="container">El sistema permite añadir nuevas bolsas presupuestales relacionadas con el periodo vigente en la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán crear las bolsas presupuestales en el sistema.</p>'},
          elements:[
            {id: '#denominacion', text: 'El campo "Denominación" permite indicar una descripción a la bolsa a guardar para su posterior identificación. El texto ingresado no debe superar los 255 caracteres. Este campo es obligatorio.'},
            {id: '#valor', text: 'El campo "Valor" permite ingresar el valor total que va a contener la bolsa presupuestal, tenga en cuenta que solamente admite valores numéricos mayores o iguales a 1. Este campo es obligatorio.'},
            {id: '#periodo', text: 'El campo "Periodo" permite seleccionar el periodo para el cual se desea crear la bolsa presupuestal, tenga en cuenta que solamente podrá seleccionar aquellos periodos que se encuentren activos en el sistema. Este campo es obligatorio.'},
            {id: '#tipoFondo', text: 'El campo "Tipo de fondo" permite seleccionar el tipo de fondo con el cual se contará para la creación de la bolsa presupuestal, tenga en cuenta que solamente podrá seleccionar aquellos tipos de fondo que se encuentren activos en el sistema. Este campo es obligatorio.'},
            {id: '#fuente', text: 'El campo "Fuente" permite seleccionar el tipo de fuente que financiará la creación de la bolsa presupuestal, tenga en cuenta que solamente podrá seleccionar aquellas fuentes que se encuentren activas en el sistema. Este campo es obligatorio.'},
            {id: '#fecha_expedicion', text: 'El campo "Fecha de expedición" permite seleccionar la fecha en la que se está creando la bolsa presupuestal, tenga en cuenta que la fecha seleccionada no puede ser mayor a la fecha actual. Este campo es obligatorio.'},
            {id: '#responsable', text: 'El campo "Responsable" permite ingresar el nombre de la persona responsable o a cargo del dinero de la bolsa presupuestal, tenga en cuenta que el texto ingresado no debe superar los 455 caracteres. Este campo es obligatorio.'},
            {id: '#ejecutor', text: 'El campo "Ejecutor" permite ingresar el nombre de la persona o entidad que está a cargo del proyecto, tenga en cuenta que el texto ingresado no debe superar los 455 caracteres. Este campo es obligatorio.'},
            {id: '#soporte', text: 'El campo "Soporte" permite adjuntar un documento de soporte para la bolsa presupuestal, el cual deberá estar en formato PDF y con un peso menor o igual a 2MB. Este campo es obligatorio.'},
            {id: '#volver', text: 'El botón "Volver al listado" permite regresar a la lista de bolsas presupuestales.'},
            {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida, después de un breve periodo de tiempo será redirigido a la lista de bolsas presupuestales.'},
          ]
        });
        this.tutorial.start();
    } else {// Si se va a editar

      this.tutorial = new Tutorial(
        {
          intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de edición de bolsas presupuestales</p><p class="container">El sistema permite editar la bolsa presupuestal relacionada con el periodo vigente en la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirá editar la bolsa presupuestal en el sistema.</p>'},
          elements:[
            {id: '#denominacion', text: 'El campo "Denominación" permite indicar una descripción a la bolsa a guardar para su posterior identificación. El texto ingresado no debe superar los 255 caracteres. Este campo es obligatorio.'},
            {id: '#valor', text: 'El campo "Valor" permite modificar el valor total que contiene la bolsa presupuestal, tenga en cuenta que solamente admite valores numéricos mayores o iguales a 1.'},
            {id: '#periodo', text: 'El campo "Periodo" permite modificar el periodo para el cual se desea tener activa la bolsa presupuestal, tenga en cuenta que solamente podrá seleccionar aquellos periodos que se encuentren activos en el sistema.'},
            {id: '#tipoFondo', text: 'El campo "Tipo de fondo" permite modificar el tipo de fondo con el cual se contará para la creación de la bolsa presupuestal, tenga en cuenta que solamente podrá seleccionar aquellos tipos de fondo que se encuentren activos en el sistema.'},
            {id: '#fuente', text: 'El campo "Fuente" permite modificar el tipo de fuente que financia la bolsa presupuestal, tenga en cuenta que solamente podrá seleccionar aquellas fuentes que se encuentren activas en el sistema.'},
            {id: '#fecha_expedicion', text: 'El campo "Fecha de expedición" permite modificar la fecha en la que se creó la bolsa presupuestal, tenga en cuenta que la fecha seleccionada no puede ser mayor a la fecha actual.'},
            {id: '#responsable', text: 'El campo "Responsable" permite modificar el nombre de la persona responsable o a cargo del dinero de la bolsa presupuestal, tenga en cuenta que el texto ingresado no debe superar los 455 caracteres.'},
            {id: '#ejecutor', text: 'El campo "Ejecutor" permite modificar el nombre de la persona que ejecutó la creación de la bolsa presupuestal, tenga en cuenta que el texto ingresado no debe superar los 455 caracteres.'},
            {id: '#soporte', text: 'El campo "Soporte" permite modificar el documento de soporte para la bolsa presupuestal, este deberá estar en formato PDF y con un peso menor o igual a 2MB.'},
            {id: '#volver', text: 'El botón "Volver al listado" permite regresar a la lista de bolsas presupuestales.'},
            {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida, después de un breve periodo de tiempo será redirigido a la lista de bolsas presupuestales.'},
          ]
        });
        this.tutorial.start();
    }
  }
}
