import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Plazas } from 'src/app/interfaces/Plazas.interface';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';
import { postulacion } from 'src/app/interfaces/plaza.interface';
import { PostulacionPlazaComponent } from '../postulacion-plaza/postulacion-plaza.component';
import { TiposConvocatorias } from 'src/app/class/api';
declare var $:any;


@Component({
  selector: 'app-plazas-informacion',
  templateUrl: './plazas-informacion.component.html',
  styleUrls: ['./plazas-informacion.component.css'],
  providers: [MessageService]

})
export class PlazasInformacionComponent implements OnInit {
  id:number;
  formulario:postulacion = new postulacion();
  respuestaAceptar:boolean; 
  plaza:Plazas = null;
  beneficio:string = "";
  tipo_beneficio_id:number;
  errores:object[]=[];
  tiposAyudantias:Objeto[]=[];
  tiposPlazas:Objeto[]=[];
  tiposBeneficiosSelect:Objeto[]=[];
  etapaActual:Objeto = null;
  etapas:any = [];
  codigo:number=null;

  tiposConvocatorias = TiposConvocatorias;

  @ViewChild(PostulacionPlazaComponent) postulacionPlazaReference:PostulacionPlazaComponent;

  constructor(private _convocatoriaPService:ConvocatoriaPService, 
              private route:ActivatedRoute, 
              private messageService: MessageService,
              private spinner: NgxSpinnerService, 
              private _userService: UserService,
              private router: Router,
              private _location: Location
              ) { }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id=params.id
      this._convocatoriaPService.getPlaza(this.id).subscribe(data=>{
        this.plaza=data['plazaSolicitada'];
        this.tiposAyudantias=data['tiposAyudantias'];
        this.tiposPlazas=data['tiposPlazas'];
        this.tiposBeneficiosSelect = data['tipos_beneficios'];
        this.postulacionPlazaReference.setTiposBeneficios(this.tiposBeneficiosSelect);
        this.etapaActual = data['etapaActual'];
        this.etapas = data['etapas'];

        let today = Date.now();

        if(this.etapaActual == null){
          let peso_etapa_inscripcion = (this.plaza.tipo_convocatoria == TiposConvocatorias.AYUDANTIA) ? 3 : 4;
          this.etapas = this.etapas.filter(function(a) {
            return a.peso > peso_etapa_inscripcion;
          });
            
          // let testDates = [{fechaFin:"2019-02-07"}, {fechaFin:"2019-02-13"}, {fechaFin:"2019-02-14"},{fechaFin:"2019-02-18"},{fechaFin:"2019-02-19"}, {fechaFin:"2019-06-07"}, {fechaFin:"2019-06-10"}, {fechaFin:"2019-06-17"}]

          this.etapas.sort(function(a, b) {
            return new Date(b.fechaFin + "T00:00:00Z").getTime() - new Date(a.fechaFin + "T00:00:00Z").getTime();
          });
          
          this.etapaActual = this.etapas.filter(function(a) {
            return (today - new Date(a.fechaFin + "T00:00:00Z").getTime()) > 0;
          })[0];
          if(this.etapaActual == undefined){
            let peso_etapa_entrevista = (this.plaza.tipo_convocatoria == TiposConvocatorias.AYUDANTIA) ? 4 : 6;
            this.etapaActual = this.etapas.filter(function(a) {
              return a.peso == peso_etapa_entrevista;
            })[0];
          }
        }

        //Establecer plaza
        this.postulacionPlazaReference.setPlaza(this.plaza);
        this.postulacionPlazaReference.setTipoConvocatoria(this.plaza.tipo_convocatoria);

        this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.messageService.add({severity:'error', summary: 'Error', detail: respuesta.msg });
        this.spinner.hide();  
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

  postularseModal(){
    if(this._userService.isLogin()){
      this.errores = [];
      //this.beneficio = {};
      //Establecer plaza
      this.postulacionPlazaReference.setPlaza(this.plaza);
      this.postulacionPlazaReference.setTipoConvocatoria(this.plaza.tipo_convocatoria);
      $('#exampleModal').modal('show');
    }else{
      let url=this.router.url;
      this.router.navigate(['/estudiantes/login'], {queryParams: {redirect:url}});
    }
    
  } 
  goBack() {
    this._location.back();
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
    if(this.formulario.propuesta_metodologica == null && this.plaza.tipo_convocatoria == 3){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe subir un archivo PDF con la propuesta metodológica',
      });
      return;
    }
   
    //this.beneficio.plaza_id = this.id;
    this.formulario.plaza_id = this.id;
    this.formulario.id_tipo_convocatoria = this.plaza.tipo_convocatoria;
    this.spinner.show();
    this._convocatoriaPService.postularEstudiante(this.formulario).subscribe(data=>{
      if(data['success']){
        $('#exampleModal').modal('hide');
        this.spinner.hide();
        swal({
          type: 'success',
          title: 'Realizado',
          text: 'Se ha registrado satisfactoriamente la solicitud.',
          showConfirmButton: false,
          timer: 1500
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

  cancelar(form:NgForm){
    form.resetForm();
  }

  onUploadFileFormato(event){
    for(let file of event.files) {
      this.formulario.propuesta_metodologica=file;
    }
  }

  onClearFileFormato(){
    this.formulario.propuesta_metodologica=null;
  }


  goLogin(){
    let url=this.router.url;
    this.router.navigate(['/estudiantes/login'], {queryParams: {redirect:url}})
  }
}
