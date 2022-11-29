import { Component, OnInit, ChangeDetectorRef, ViewChild, LOCALE_ID} from '@angular/core';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { PROFILE_BY } from 'src/app/class/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AtencionService } from 'src/app/services/atencion.service';
import {Location, DatePipe} from '@angular/common';
import {medicinaDeportiva } from 'src/app/interfaces/atencion';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { IfStmt } from '@angular/compiler';

import { PerfilSaludComponent } from '../../perfil-salud/perfil-salud.component'
import { CalcularEdadPipe } from 'src/app/pipes/calcular-edad.pipe';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-medicina-deportiva',
  templateUrl: './medicina-deportiva.component.html',
  styleUrls: ['./medicina-deportiva.component.css']
})
export class MedicinaDeportivaComponent implements OnInit {

  @ViewChild(PerfilSaludComponent) perfilsalud:PerfilSaludComponent;

  //pipe necesarios para calcular desde la fecha que se trae de la base de datos la edad del paciente
  pipeObtenerFecha:obtenerFechaPipe = new obtenerFechaPipe();
  pipeCalcularEdad:CalcularEdadPipe = new CalcularEdadPipe();
  pipeDate:DatePipe = new DatePipe('en-US');


  datosAtencion: any;
  tiposPacientes: any [] = [];
  tiposAtenciones:any[] = [];
  antecedentesCV:any[] = [];
  antecedentes:any[] = [];
  tipoComplexion:any[] = [];
  tiposRiesgosCV:any[] = [];

  Edad:number;

  clasificacioCV:any[] = [];
  clasesCV:any[] = [];
  clasificacionEscogidas:any[]=[];

  flexibilidades:any[]=[];
  niveles_flexibilidades:any[]=[];

  estabilidades:any[]=[];
  niveles_estabilidades:any[]=[];

  escala_caidas:any[]=[];

  postura_morfologica:any[]=[];
  postura_funcionales:any[]=[];

  determinaciones_antropometricas:any[]=[];

  deficit_musculares:any[]=[];



  messageService: any;
  errores: any[];
  error: any[] = [];
  dateNow: Date;
  id: any;
  
  imc:number = 0;
  pesoIimc:number = 0;
  perimetro:number = 0;
  complexion:number = 0;
  pesoIdeal:number= 0;

  Graso:number = 0;
  Peso_Graso:number = 0;
  Peso_Oseo:number = 0;
  Oseo:number = 0;
  Peso_Residual:number = 0;
  Residual:number = 0;
  Peso_Muscular:number = 0;
  Muscular:number = 0;
  PLG:number = 0;
  exceso_grasa:number = 0;

  velocidad_max_km:number = 0;
  max_kpm:number = 0;
  doble_producto:number = 0;
  mets:number = 0;
  vo2_max:number = 0;
  vo2_max_kg:number = 0;
  valor_test_banca:number=0;

  //Variables para controlar que si hay un cambio en algun campo de esta seccion se pongan los demas obligatorios.
  controlador_seccion_con_ef_flexib = false;
  controlador_seccion_antropometria = false;
  controlador_seccion_examenes = false;
  controlador_seccion_prueba_esfuerzo = false;
  controlador_seccion_valores_prueba_esfuerzo = false;
  controlador_seccion_dx_tto = false;

  bandera:any;
  atencion: any = {
    id_cita:null, 
    id_servicio:null, 
    duracion:null, 
    servicio:null, 
    paciente:null, 
    identificacion:null,    
  };

  formulario:medicinaDeportiva = new medicinaDeportiva();
  profile_by = PROFILE_BY.ID_Cita;
  constructor(
    private route: ActivatedRoute, 
    private _atencionDeportivaService : AtencionService,
    private changeDetector: ChangeDetectorRef ,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private _router:Router,
  ) { }

   ngOnInit() {
    this.spinner.show();
    this.dateNow = new Date();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.bandera = params["bandera"];
      if (this.bandera == 0) {
      this._atencionDeportivaService.getDatosAtencionDeportologo(this.id).subscribe(data=>{     
        this.atencion=data['objetoRetornado']['cita'];

        this.datosAtencion = JSON.parse(data['objetoRetornado']['datosAtencion']);
        this.datosAtencion = this.datosAtencion['objetoRetornado'];

        this.tiposAtenciones = this.datosAtencion.tipos_atenciones; 
        this.tiposPacientes = this.datosAtencion.tipos_pacientes;    
        this.antecedentesCV = this.datosAtencion.tipoRiesgaosCV;  
        this.clasificacioCV = this.datosAtencion.clasificacionRiesgosCV; 
        this.clasesCV = this.datosAtencion.clasesRCV; 
        this.antecedentes = this.datosAtencion.antecedentes; 
        this.tipoComplexion = this.datosAtencion.tipoComplexion;
        this.tiposRiesgosCV = this.datosAtencion.tipos_riesgoscv; 
        this.niveles_flexibilidades=this.datosAtencion.niveles_flexibilidades;
        this.niveles_estabilidades=this.datosAtencion.niveles_estabilidades;
        this.escala_caidas=this.datosAtencion.escala_caidas;
        this.postura_morfologica=this.datosAtencion.postura_morfologica;
        this.postura_funcionales=this.datosAtencion.postura_funcionales;
        this.determinaciones_antropometricas = this.datosAtencion.determinaciones_antropometricas;
        this.deficit_musculares = this.datosAtencion.deficit_musculares;

        this.formulario.id_paciente = this.atencion.id_paciente;
        this.formulario.fecha_atencion = this.atencion.fecha; 
        this.formulario.id_cita =  params['id']; 
        this.formulario.tipo_paciente = null;
        this.formulario.antropomericos.tipoComplexion = 0;
        this.formulario.flexibilidades = this.datosAtencion.flexibilidades;
        this.formulario.estabilidades = this.datosAtencion.estabilidades; 
        this.formulario.atencion_programada = true;
        
          this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
         this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });    
      });
    } else{
      this.profile_by = PROFILE_BY.ID_Paciente;
      this._atencionDeportivaService.getDatosAtencionNoProgramada(this.id).subscribe(data=>{     
        this.atencion=data['objetoRetornado']['cita'];

        this.datosAtencion = JSON.parse(data['objetoRetornado']['datosAtencion']);
        this.datosAtencion = this.datosAtencion['objetoRetornado'];
        
        this.tiposAtenciones = this.datosAtencion.tipos_atenciones; 
        this.tiposPacientes = this.datosAtencion.tipos_pacientes;    
        this.antecedentesCV = this.datosAtencion.tipoRiesgaosCV;  
        this.clasificacioCV = this.datosAtencion.clasificacionRiesgosCV; 
        this.clasesCV = this.datosAtencion.clasesRCV; 
        this.antecedentes = this.datosAtencion.antecedentes; 
        this.tipoComplexion = this.datosAtencion.tipoComplexion;
        this.tiposRiesgosCV = this.datosAtencion.tipos_riesgoscv; 
        this.niveles_flexibilidades=this.datosAtencion.niveles_flexibilidades;
        this.niveles_estabilidades=this.datosAtencion.niveles_estabilidades;
        this.escala_caidas=this.datosAtencion.escala_caidas;
        this.postura_morfologica=this.datosAtencion.postura_morfologica;
        this.postura_funcionales=this.datosAtencion.postura_funcionales;
        this.determinaciones_antropometricas = this.datosAtencion.determinaciones_antropometricas;
        this.deficit_musculares = this.datosAtencion.deficit_musculares;

        this.formulario.id_paciente = this.atencion.id_paciente; 
        this.formulario.tipo_paciente = null;
        this.formulario.antropomericos.tipoComplexion = 0;
        this.formulario.flexibilidades = this.datosAtencion.flexibilidades;
        this.formulario.estabilidades = this.datosAtencion.estabilidades; 
        this.formulario.atencion_programada = false;


          this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
         this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });    
      });

    }


    }); 
  }


  ngAfterViewChecked(): void {
    this.formulario.antropomericos.tipoComplexion = this.TipoDeComplexion()
    this.changeDetector.detectChanges();
  }
  
  cardiovascular(){
    $('#cardiovascular').modal('show');
  }

  onSelect(id:any){
    this.formulario.classfRCV=null;
    //debugger;
    //this.clasificacionEscogidas = this.getclases().filter((item)=>{return item.clasificacionCV_id == id});
    this.clasificacionEscogidas = Object.assign([], this.clasesCV).filter((item:any) => {return item.clasificacion_id == id })
  }

  getclases(){  
      let CRCV:any[] =[]
       this.clasesCV.forEach(element => {
        CRCV.push(element);      
       })
       return CRCV
  }



  AtencionDeportiva(forma: NgForm) {
    this.spinner.show();
   if (!forma.valid) {
     swal({
       type: "error",
       title: "Error",
       text: "Complete los campos del formulario.",
       timer: 2000,
       showConfirmButton: false
     });
     this.spinner.hide();
   } else {
     this._atencionDeportivaService.postRegistrarAtencionDeportiva(this.formulario).subscribe(data => {
         if (data['success']) {
           swal({type: "success", title: "Realizado" ,text: "Se ha registrado la atención satisfactoriamente.",timer: 2000, showConfirmButton: false});
           
           setTimeout(() => {
             this._router.navigateByUrl('/agendaDiaria/1'); 
           }, 1500);
           
           this.spinner.hide();
         } else {
           console.log(data)
           this.error = data['errores'];
           swal({
             type: "error",
             title: "Error",
             text: "Corrige los errores",
             timer: 2000,
             showConfirmButton: false
           });
           this.spinner.hide();
         }
       }, err =>{
         let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
         swal({
           type: 'error',
           title: 'Error',
           text: respuesta.msg,
         });
         this.spinner.hide()
       });
      }
 }

 
  // formula de indice de masa corporal
  IMC():number{   
    if(( this.formulario.antropomericos.peso  != undefined && this.formulario.antropomericos.peso != 0) && (this.formulario.antropomericos.talla != undefined && this.formulario.antropomericos.talla!= 0)){
      this.imc = (this.formulario.antropomericos.peso / Math.pow(this.formulario.antropomericos.talla,2));
    }    
    return this.imc;
  }
  // peso ideal segun imc
  pesoIdealIMC():number{   
    if(this.formulario.antropomericos.talla != undefined && this.formulario.antropomericos.talla!= 0){
      this.pesoIimc = (21.7 * Math.pow(this.formulario.antropomericos.talla,2));
    }    
    return this.pesoIimc;
  }
  // relacion de cc
  perimetroCC():number{
    if(( this.formulario.antropomericos.cintura  != undefined && this.formulario.antropomericos.cintura != 0) && (this.formulario.antropomericos.cadera != undefined && this.formulario.antropomericos.cadera != 0)){
      this.perimetro = (this.formulario.antropomericos.cintura / this.formulario.antropomericos.cadera);
    }    
    return this.perimetro;
  }
  // formula de la complexión
  complex():number{
    if(( this.formulario.antropomericos.talla  != undefined && this.formulario.antropomericos.talla != 0) && (this.formulario.antropomericos.carpo != undefined && this.formulario.antropomericos.carpo != 0)){
      this.complexion = ((this.formulario.antropomericos.talla * 100) / this.formulario.antropomericos.carpo);
    }    
    return this.complexion;
  }


  /**
   * Metodo par hallar el nuevo valor del tipo de complexion del formulario
   * y lo retorna.
   */
  TipoDeComplexion():number{
    let tipoComplexion = 0;
    if (( this.complexion > 10.4 && this.atencion.sexo) || ( this.complexion > 11 && !this.atencion.sexo)){
      tipoComplexion = 1;
    }
    if((this.complexion > 9.6 && this.complexion < 10.4 && this.atencion.sexo) || (this.complexion > 10.1 && this.complexion < 11 && !this.atencion.sexo) ){
      tipoComplexion = 2;
    }    
    
    if(( this.complexion != 0 && this.complexion < 9.6 && this.atencion.sexo) || (this.complexion != 0 && this.complexion < 10.1 && !this.atencion.sexo)){
      tipoComplexion = 3;
    }
    return tipoComplexion
  }


  PesoIdeal():number{
    let constante:number = 0;
    this.pesoIdeal = 0;

    for (let i = 0; i < this.tipoComplexion.length; i++) {
      if (this.tipoComplexion[i].id == this.TipoDeComplexion() ) {
        constante = this.tipoComplexion[i].constante_de_complexion;
      }
    }
    this.pesoIdeal =  (Math.pow(this.formulario.antropomericos.talla,2) * constante);
    return this.pesoIdeal;
  }

  /**
   * la funcionalidad de este metodo es tener controlada la seccion de con ef flexib
   * ya que esos datos no son obligatorios hasta que alguno es llenado, todos deben estar
   * vacios o nulos para que esta parte del formulario no sea obligatoria.
   */
  cambiarEstado(){
    let permiso = false;
    if(this.formulario.test_wells != null || 
        (this.formulario.escala_caida != null && this.formulario.escala_caida != 0)|| 
        (this.formulario.postura_funcional != null && this.formulario.postura_funcional != 0) || 
        (this.formulario.postura_morfologica != null && this.formulario.postura_morfologica != 0)){

        permiso = true;
    }

    this.formulario.flexibilidades.forEach(flexibilidad => {
        
        if(flexibilidad.nivel != null && flexibilidad.nivel != 0){
          permiso = true;
        }
    });

    this.formulario.estabilidades.forEach(estabilidad => {
      if(estabilidad.nivel != null && estabilidad.nivel != 0){
        permiso = true;
      }
    });

    this.controlador_seccion_con_ef_flexib = permiso;
  
  }

  recibirEdad(edad){
    console.log(this.perfilsalud.atencion);
  }
  /**
   * la funcionalidad de este metodo es tener controlada la seccion de antropometria
   * ya que esos datos no son obligatorios hasta que alguno es llenado, todos deben estar
   * vacios o nulos para que esta parte del formulario no sea obligatoria.
   */
  cambiarEstadoAntropometria(){
    let permiso = false;

    if( this.formulario.pliegues_grasos.pecho != null ||
        this.formulario.pliegues_grasos.axilar != null ||
        this.formulario.pliegues_grasos.triceps != null ||
        this.formulario.pliegues_grasos.subescapular != null ||
        this.formulario.pliegues_grasos.suprailiaco != null ||
        this.formulario.pliegues_grasos.abdominal != null ||
        this.formulario.pliegues_grasos.muslo != null ||
        this.formulario.pliegues_grasos.pierna != null ||
        this.formulario.diametros_oseos.muneca != null ||
        this.formulario.diametros_oseos.femoral != null ||
        this.formulario.grasa_ideal != null ||
        (this.formulario.deficit_muscular != null && this.formulario.deficit_muscular != 0)){
      permiso = true;
    }

    this.controlador_seccion_antropometria = permiso;
  }


  /**
   * Sirve para calcular los pesos y los porcentajes dependiendo del check al que le hagan click
   * mediante unas formulas establecidas
   * @param nombreSeleccionado 
   */
  calcularPesosYPorcentajes(nombreSeleccionado){
    let fecha = this.pipeObtenerFecha.transform(this.perfilsalud.atencion.fecha_nacimiento);
    fecha = this.pipeDate.transform(fecha,'yyyy/MM/dd');
    this.Edad = this.pipeCalcularEdad.transform(fecha);

    if(nombreSeleccionado = "Hombre Sedentario Abdominal"){
      this.Graso = (495 / ((1.10938) - ((0.0008267) * (this.formulario.pliegues_grasos.pecho + this.formulario.pliegues_grasos.muslo + this.formulario.pliegues_grasos.abdominal)) + ((0.0000016) * ((this.formulario.pliegues_grasos.pecho + this.formulario.pliegues_grasos.muslo + this.formulario.pliegues_grasos.abdominal) ^ 2)) - (0.0002575 * this.Edad))) - 450
      this.Peso_Graso = this.Graso * this.formulario.antropomericos.peso / 100
      this.Peso_Oseo = ((((this.formulario.antropomericos.talla ^ 2) * (this.formulario.diametros_oseos.muneca / 100) * (this.formulario.diametros_oseos.femoral / 100)) * 400) ^ 0.712) * 3.02
      this.Oseo = this.Peso_Oseo * 100 / this.formulario.antropomericos.peso
      this.Peso_Residual = 24 * this.formulario.antropomericos.peso / 100
      this.Residual = this.Peso_Residual * 100 / this.formulario.antropomericos.peso
      this.Peso_Muscular = this.formulario.antropomericos.peso - (this.Peso_Graso + this.Peso_Oseo + this.Peso_Residual)
      this.Muscular = this.Peso_Muscular * 100 / this.formulario.antropomericos.peso
      this.PLG = this.formulario.antropomericos.peso - this.Peso_Graso
    }

    if(nombreSeleccionado = "Hombre Sedentario"){
      this.Graso = (495 / ((1.112) - ((0.00043499) * (this.formulario.pliegues_grasos.pecho + this.formulario.pliegues_grasos.axilar + this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.subescapular + this.formulario.pliegues_grasos.suprailiaco + this.formulario.pliegues_grasos.abdominal + this.formulario.pliegues_grasos.muslo)) + ((0.00000055) * ((this.formulario.pliegues_grasos.pecho + this.formulario.pliegues_grasos.axilar + this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.subescapular + this.formulario.pliegues_grasos.suprailiaco + this.formulario.pliegues_grasos.abdominal + this.formulario.pliegues_grasos.muslo) ^ 2)) - (0.00028826 * this.Edad))) - 450
      this.Peso_Graso = this.Graso * this.formulario.antropomericos.peso / 100
      this.Peso_Oseo = ((((this.formulario.antropomericos.talla ^ 2) * (this.formulario.diametros_oseos.muneca / 100) * (this.formulario.diametros_oseos.femoral / 100)) * 400) ^ 0.712) * 3.02
      this.Oseo = this.Peso_Oseo * 100 / this.formulario.antropomericos.peso
      this.Peso_Residual = 24 * this.formulario.antropomericos.peso / 100
      this.Residual = this.Peso_Residual * 100 / this.formulario.antropomericos.peso
      this.Peso_Muscular = this.formulario.antropomericos.peso - (this.Peso_Graso + this.Peso_Oseo + this.Peso_Residual)
      this.Muscular = this.Peso_Muscular * 100 / this.formulario.antropomericos.peso
      this.PLG = this.formulario.antropomericos.peso - this.Peso_Graso  
    }

    if(nombreSeleccionado = "Hombre Deportista"){
      this.Graso = ((this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.subescapular + this.formulario.pliegues_grasos.suprailiaco + this.formulario.pliegues_grasos.abdominal + this.formulario.pliegues_grasos.muslo + this.formulario.pliegues_grasos.pierna) * 0.1051) + 2.586
      this.Peso_Graso = this.Graso * this.formulario.antropomericos.peso / 100
      this.Peso_Oseo = ((((this.formulario.antropomericos.talla ^ 2) * (this.formulario.diametros_oseos.muneca / 100) * (this.formulario.diametros_oseos.femoral / 100)) * 400) ^ 0.712) * 3.02
      this.Oseo = this.Peso_Oseo * 100 / this.formulario.antropomericos.peso
      this.Peso_Residual = 24 * this.formulario.antropomericos.peso / 100
      this.Residual = this.Peso_Residual * 100 / this.formulario.antropomericos.peso
      this.Peso_Muscular = this.formulario.antropomericos.peso - (this.Peso_Graso + this.Peso_Oseo + this.Peso_Residual)
      this.Muscular = this.Peso_Muscular * 100 / this.formulario.antropomericos.peso
      this.PLG = this.formulario.antropomericos.peso - this.Peso_Graso
    }


    if(nombreSeleccionado = "Mujer Sedentaria Pelvica"){
      this.Graso = (495 / ((1.0994291) - ((0.0009929) * (this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.muslo + this.formulario.pliegues_grasos.suprailiaco)) + ((0.0000023) * ((this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.muslo + this.formulario.pliegues_grasos.suprailiaco) ^ 2)) - (0.0001392 * this.Edad))) - 450
      this.Peso_Graso = this.Graso * this.formulario.antropomericos.peso / 100
      this.Peso_Oseo = ((((this.formulario.antropomericos.talla ^ 2) * (this.formulario.diametros_oseos.muneca / 100) * (this.formulario.diametros_oseos.femoral / 100)) * 400) ^ 0.712) * 3.02
      this.Oseo = this.Peso_Oseo * 100 / this.formulario.antropomericos.peso
      this.Peso_Residual = 20.9 * this.formulario.antropomericos.peso / 100
      this.Residual = this.Peso_Residual * 100 / this.formulario.antropomericos.peso
      this.Peso_Muscular = this.formulario.antropomericos.peso - (this.Peso_Graso + this.Peso_Oseo + this.Peso_Residual)
      this.Muscular = this.Peso_Muscular * 100 / this.formulario.antropomericos.peso
      this.PLG = this.formulario.antropomericos.peso - this.Peso_Graso
    }

    if(nombreSeleccionado = "Mujer Sedentaria"){
      this.Graso = (495 / ((1.097) - ((0.00046971) * (this.formulario.pliegues_grasos.pecho + this.formulario.pliegues_grasos.axilar + this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.subescapular + this.formulario.pliegues_grasos.suprailiaco + this.formulario.pliegues_grasos.abdominal + this.formulario.pliegues_grasos.muslo)) + ((0.00000056) * ((this.formulario.pliegues_grasos.pecho + this.formulario.pliegues_grasos.axilar + this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.subescapular + this.formulario.pliegues_grasos.suprailiaco + this.formulario.pliegues_grasos.abdominal + this.formulario.pliegues_grasos.muslo) ^ 2)) - (0.00012828 * this.Edad))) - 450
      this.Peso_Graso = this.Graso * this.formulario.antropomericos.peso / 100
      this.Peso_Oseo = ((((this.formulario.antropomericos.talla ^ 2) * (this.formulario.diametros_oseos.muneca / 100) * (this.formulario.diametros_oseos.femoral / 100)) * 400) ^ 0.712) * 3.02
      this.Oseo = this.Peso_Oseo * 100 / this.formulario.antropomericos.peso
      this.Peso_Residual = 20.9 * this.formulario.antropomericos.peso / 100
      this.Residual = this.Peso_Residual * 100 / this.formulario.antropomericos.peso
      this.Peso_Muscular = this.formulario.antropomericos.peso - (this.Peso_Graso + this.Peso_Oseo + this.Peso_Residual)
      this.Muscular = this.Peso_Muscular * 100 / this.formulario.antropomericos.peso
      this.PLG = this.formulario.antropomericos.peso - this.Peso_Graso
    }

    if(nombreSeleccionado = "Mujer Deportista"){
      this.Graso = ((this.formulario.pliegues_grasos.triceps + this.formulario.pliegues_grasos.subescapular + this.formulario.pliegues_grasos.suprailiaco + this.formulario.pliegues_grasos.abdominal + this.formulario.pliegues_grasos.muslo + this.formulario.pliegues_grasos.pierna) * 0.1548) + 3.58
      this.Peso_Graso = this.Graso * this.formulario.antropomericos.peso / 100
      this.Peso_Oseo = ((((this.formulario.antropomericos.talla ^ 2) * (this.formulario.diametros_oseos.muneca / 100) * (this.formulario.diametros_oseos.femoral / 100)) * 400) ^ 0.712) * 3.02
      this.Oseo = this.Peso_Oseo * 100 / this.formulario.antropomericos.peso
      this.Peso_Residual = 20.9 * this.formulario.antropomericos.peso / 100
      this.Residual = this.Peso_Residual * 100 / this.formulario.antropomericos.peso
      this.Peso_Muscular = this.formulario.antropomericos.peso - (this.Peso_Graso + this.Peso_Oseo + this.Peso_Residual)
      this.Muscular = this.Peso_Muscular * 100 / this.formulario.antropomericos.peso
      this.PLG = this.formulario.antropomericos.peso - this.Peso_Graso
    }

  }

  calcularExcesoGrasa(){
    this.exceso_grasa = ((this.Graso - this.formulario.grasa_ideal) * this.formulario.antropomericos.peso) / 100
  }

  /**
   * la funcionalidad de este metodo es tener controlada la seccion de examenes
   * ya que esos datos no son obligatorios hasta que alguno es llenado, todos deben estar
   * vacios o nulos para que esta parte del formulario no sea obligatoria.
   */
  cambiarEstadoExamen(){
    let permiso = false;
    if((this.formulario.laboratorios != null && this.formulario.laboratorios != "") ||
      (this.formulario.imagenes_diagnosticas != null && this.formulario.imagenes_diagnosticas != "") ||
      (this.formulario.pruebas_especiales != null && this.formulario.pruebas_especiales != "") ||
      this.formulario.ct != null ||
      this.formulario.hdl != null ||
      this.formulario.tg != null ||
      this.formulario.glicemina != null ||
      this.formulario.class_aha_acc != null){
        permiso = true;
      }

      this.controlador_seccion_examenes = permiso;
  }

  /**
   * la funcionalidad de este metodo es tener controlada la seccion de prueba de esfuerzo
   * ya que esos datos no son obligatorios hasta que alguno es llenado, todos deben estar
   * vacios o nulos para que esta parte del formulario no sea obligatoria.
   */
  cambiarEstadoPruebaEsfuerzo(){
    let permiso = false;
    if( this.formulario.prueba_esfuerzo!= null && this.formulario.prueba_esfuerzo != "" ){
      permiso = true;
    }
    this.controlador_seccion_prueba_esfuerzo = permiso;
  }

  /**
   * la funcionalidad de este metodo es tener controlada la seccion de valores prueba de esfuerzo
   * ya que esos datos no son obligatorios hasta que alguno es llenado, todos deben estar
   * vacios o nulos para que esta parte del formulario no sea obligatoria.
   */
  cambiarEstadoValoresPruebaEsfuerzo(){
    let permiso = false;
    
    if(this.formulario.max_velocidad_mill != null||
      this.formulario.pendiente != null ||
      this.formulario.max_distancia_recorrida != null ||
      this.formulario.fc_max != null||
      this.formulario.pa_diastolica_max != null ||
      this.formulario.umbral_anaerobico != null||
      this.formulario.max_watts != null||
      this.formulario.pa_sistolica_max != null||
      this.formulario.fc_post != null||
      this.formulario.fc_min != null||
      (this.formulario.interpretacion_test != null && this.formulario.interpretacion_test != "")){
      permiso = true;
    }

    this.controlador_seccion_valores_prueba_esfuerzo = permiso;

  }

  calcularVelocidadMaxKm(){
    if(this.formulario.max_velocidad_mill != null){
      this.velocidad_max_km = this.formulario.max_velocidad_mill * 1.609
    }else{
      this.velocidad_max_km = 0;
    }
    this.cambiarEstadoValoresPruebaEsfuerzo();
  }

  calcularMaxKpm(){
    if(this.formulario.max_watts != null){
      this.max_kpm = this.formulario.max_watts * 6.02;
    }else{
      this.max_kpm = 0;
    }
    this.cambiarEstadoValoresPruebaEsfuerzo();
  }

  calcularDobleProducto(){
    if(this.formulario.pa_sistolica_max != null && this.formulario.fc_max != null){
      this.doble_producto = this.formulario.fc_max * this.formulario.pa_sistolica_max;
    }else{
      this.doble_producto = 0;
    }
    this.cambiarEstadoValoresPruebaEsfuerzo();
  }

  onTestDeBanda(){
    this.vo2_max_kg = (((this.velocidad_max_km * 1000) / 60) * (0.1 + ((this.formulario.pendiente / 100) * 1.8))) + 3.5;
    this.vo2_max = this.vo2_max_kg * this.formulario.antropomericos.peso;
    this.mets = this.vo2_max_kg / 3.5;
  }

  onTestEnCicla(){
    this.vo2_max = (this.max_kpm * 2) + (this.formulario.antropomericos.peso * 3.5);
    this.vo2_max_kg = this.vo2_max / this.formulario.antropomericos.peso;
    this.mets = this.vo2_max_kg / 3.5;
  }

  onTest12Min(){
    this.vo2_max_kg = (22.351 * this.formulario.max_distancia_recorrida) - 11.288;
    this.vo2_max = this.vo2_max_kg * this.formulario.antropomericos.peso;
    this.mets = this.vo2_max_kg / 3.5;
  }

  onTest6Min(){
    this.vo2_max_kg = ((22.351 * this.formulario.max_distancia_recorrida) - 11.288) * 2
    this.vo2_max = this.vo2_max_kg * this.formulario.antropomericos.peso
    this.mets = this.vo2_max_kg / 3.5
  }

  calcularValorTestBanca(){
    if(this.formulario.signosVitales.fc != null &&
      this.formulario.fc_post != null &&
      this.formulario.fc_min != null){
        this.valor_test_banca = ((this.formulario.signosVitales.fc + this.formulario.fc_min + this.formulario.fc_post) - 200) / 10;
      }else{
        this.valor_test_banca = 0;
      }
  }

  cambiarEstadoDxTto(){
    let permiso = false;
    if((this.formulario.diagnostico_medico_deportivo != null && this.formulario.diagnostico_medico_deportivo != "")||
    (this.formulario.tratamiento_medico != null && this.formulario.tratamiento_medico != "")||
    (this.formulario.ss_examenes != null && this.formulario.ss_examenes != "")||
    (this.formulario.remision_medica != null && this.formulario.remision_medica != "")){
      permiso = true;
    }
      
    this.controlador_seccion_dx_tto = permiso;
  }

  


}
