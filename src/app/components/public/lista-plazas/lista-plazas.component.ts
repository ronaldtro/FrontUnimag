import { Component, OnInit, ViewChild } from '@angular/core';
import { Api, TiposConvocatorias as TipoConvocatoriaEnum, Convocatoria, TiposConvocatorias } from 'src/app/class/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { plazas_routes } from '../../admin/ayudantias/plazas/plazas.routes';
import { postulacion } from 'src/app/interfaces/plaza.interface';
import { Plazas } from 'src/app/interfaces/Plazas.interface';
import { PostulacionPlazaComponent } from '../plazas/postulacion-plaza/postulacion-plaza.component';
declare var $:any;

//Servicios
import { PlazasPService } from 'src/app/services/plazas-p.service';
import { UserService } from 'src/app/services/user.service';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';


@Component({
  selector: 'app-lista-plazas',
  templateUrl: './lista-plazas.component.html',
  styleUrls: ['./lista-plazas.component.css'],
  providers: [MessageService]
})
export class ListaPlazasComponent implements OnInit {

  p:any;
  plazas:any=[];
  plaza_id:number;
  errores:object[]=[];
  respuestaAceptar:boolean; 
  beneficio:string = "";
  tipo_beneficio_id:number;
  api=Api.dev;
  tiposAyudantias: object[] = [];
  tiposPlazas: object[] = [];
  tiposBeneficiosSelect: object[] = [];
  unidades: object[] = [];
  etapas: any[] = [];
  etapaActual: any = {};
  tipo_ayudantia:number=null;
  tipo_plaza_id:number=null;
  unidad_id:number = null;
  porcentaja_creditos:number = null;
  promedio_minimo:number = null;
  tieneCodigo : string;
  convocatoriaId : number;
  formulario:postulacion;
  tiposConvocatorias = TiposConvocatorias;
  propuestaMetodologica:string;

  @ViewChild(PostulacionPlazaComponent) postulacionPlazaReference:PostulacionPlazaComponent;

  convocatoria: Convocatoria;

  constructor(private _listaService : PlazasPService ,
     private activatedRoute:ActivatedRoute,
     private spinner: NgxSpinnerService, 
     private messageService: MessageService, 
     private _userService: UserService,
     private _convocatoriaPService:ConvocatoriaPService,
     private router: Router) { 

      this.convocatoria = new Convocatoria();
      this.formulario = new postulacion()
     }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params =>{
      let codigo = params['codigo'];
      this.convocatoriaId = params['id'];
      this.tieneCodigo = codigo != undefined ? codigo : null;
      this._listaService.getDatos(params['id'], codigo).subscribe(data=>{

        this.propuestaMetodologica = data['propuesta_metodologica'];

        this.convocatoria = Object.assign(data['convocatoria']);
        console.log(this.convocatoria);

        this.plazas = data['datosPlazas'];
        if (this.plazas.length === undefined) {
          
          this.plazas = [];
        } else {
          
        }
        this.etapaActual = data['etapaActual'];
        // if(this.etapaActual == null){
        //   this.etapaActual = {id: 0, peso: 0};
        // }
        
        let today = data['fechaActual'] != null ? new Date(data['fechaActual'] + "T23:59:59Z").getTime() : Date.now();
    
        this.etapas = data['etapas'];
        this.tiposAyudantias = data['tiposayudantias'];
        this.tiposPlazas = data['tiposplazas'];
        this.tiposBeneficiosSelect = data['tipos_beneficios'];
        this.postulacionPlazaReference.setTiposBeneficios(this.tiposBeneficiosSelect);
        this.unidades = data['unidades'];

        let clonEtapas = JSON.parse(JSON.stringify( this.etapas ));

        if(this.etapaActual == null || this.etapaActual == ""){
          let peso_etapa_inscripcion = (this.convocatoria.tipo_convocatoria.id == TipoConvocatoriaEnum.AYUDANTIA) ? 3 : 4;
          clonEtapas = clonEtapas.filter(function(a) {
            return a.peso > peso_etapa_inscripcion;
          });
          
          // let testDates = [{fechaFin:"2019-02-07"}, {fechaFin:"2019-02-13"}, {fechaFin:"2019-02-14"},{fechaFin:"2019-02-18"},{fechaFin:"2019-02-19"}, {fechaFin:"2019-06-07"}, {fechaFin:"2019-06-10"}, {fechaFin:"2019-06-17"}]

          clonEtapas.sort(function(a, b) {
            return new Date(b.fechaFin + "T00:00:00Z").getTime() - new Date(a.fechaFin + "T00:00:00Z").getTime();
          });
          
          this.etapaActual = clonEtapas.filter(function(a) {
            return (today - new Date(a.fechaFin + "T00:00:00Z").getTime()) > 0;
          })[0];
          if(this.etapaActual == undefined){
            let peso_etapa_entrevista = (this.convocatoria.tipo_convocatoria.id == TipoConvocatoriaEnum.AYUDANTIA) ? 4 : 6;
            this.etapaActual = clonEtapas.filter(function(a) {
              return a.peso == peso_etapa_entrevista;
            })[0];
          }

        }
    

        this.spinner.hide();  
          
      }, err=> {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()    
      });
    });
  }

  sentenceCase(input) {
    input = ( input === undefined || input === null ) ? '' : input;
    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
    return match.toUpperCase();
    });
   }

  limpiarPlaza() {
    this.tipo_plaza_id = null;
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
  postularseModal(plaza:Plazas){

    if(this._userService.isLogin()){
      this.errores = [];
      this.formulario.plaza_id = plaza.id;

      //Establecer plaza
      this.postulacionPlazaReference.setPlaza(plaza);
      this.postulacionPlazaReference.setTipoConvocatoria(this.convocatoria.tipo_convocatoria.id);
      this.postulacionPlazaReference.setPropuestaMetodologica(this.propuestaMetodologica);

      $('#exampleModal').modal('show');
      
    }else{
      let url=this.router.url;
      this.router.navigate(['/estudiantes/login'], {queryParams: {redirect:url}});
    }

  }
  postularse(formulario:NgForm){

    if(!this._userService.isLogin()){
      let url=this.router.url;
      $('#exampleModal').modal('hide');
      this.router.navigate(['/estudiantes/login'], {queryParams: {redirect:url}});
      return;
    }
    if(!formulario.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe seleccionar una opción de respuesta',
      });
      return;
    }
    if(this.formulario.propuesta_metodologica == null && this.convocatoria.tipo_convocatoria.id == this.tiposConvocatorias.MONITORIA){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe subir un archivo PDF con la propuesta metodológica',
      });
      return;
    }
    this.formulario.id_tipo_convocatoria = this.convocatoria.tipo_convocatoria.id;
    this.spinner.show();
    this._convocatoriaPService.postular(this.formulario).subscribe(data=>{
      if(data['success']){
        $('#exampleModal').modal('hide');
        this.spinner.hide();
        swal({
          type: 'success',
          title: 'Realizado',
          text: 'Se ha registrado satisfactoriamente la solicitud.',
          showConfirmButton: false,
          timer: 2000
        })
      }else{
        this.spinner.hide();
        if(data['error']){
          swal({
            type: 'warning',
            title: 'Alerta',
            text: data['error']
          })
        }
        if(data['errores']){
          for(let i=0;i<data['errores'].length;i++){
            if(data['errores'][i]['errores'].length>0){
              for(let j=0; j<data['errores'][i]['errores'].length; j++){
                this.messageService.add({severity:'warn', summary: 'Ok', detail:data['errores'][i]['errores'][j]['ErrorMessage']});
                swal({
                  type: 'error',
                  title: 'Error',
                  text: data['errores'][i]['errores'][j]['ErrorMessage']
                });
              }
            }
          }
        }
      }
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.messageService.add({severity:'error', summary: 'Error', detail: respuesta.msg });
      this.spinner.hide();  
    })
  }
  onFileSelected(event):void {
    if(event.target.files.length > 0) 
     {
       $("#name-file").html(event.target.files[0].name);
       console.log(event.target.files[0].name);
     }
   }
}

