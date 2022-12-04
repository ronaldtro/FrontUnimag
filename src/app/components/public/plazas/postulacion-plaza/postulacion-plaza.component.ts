import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { postulacion } from 'src/app/interfaces/plaza.interface';
import { Plazas } from 'src/app/interfaces/Plazas.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { TiposConvocatorias } from 'src/app/class/api';
declare var $:any;

//Servicios
import { UserService } from 'src/app/services/user.service';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';


@Component({
  selector: 'app-postulacion-plaza',
  templateUrl: './postulacion-plaza.component.html',
  styleUrls: ['./postulacion-plaza.component.css']
})
export class PostulacionPlazaComponent implements OnInit {

  formulario:postulacion;

  @Input() plaza:Plazas;
  @Input() tipoConvocatoria:TiposConvocatorias;
  @Input() tiposBeneficios:any[];
  @Input() propuestaMetodologica:string;

  tiposConvocatorias = TiposConvocatorias;

  constructor(
    private _convocatoriaPService:ConvocatoriaPService,
    private route:ActivatedRoute, 
    private messageService: MessageService,
    private spinner: NgxSpinnerService, 
    private _userService: UserService,
    private router: Router
  ) {
      this.formulario = new postulacion();
      this.plaza = new Plazas();
      this.tiposBeneficios = [];
     }

  ngOnInit() {
    this.onClearFileFormato();
  }

  setPlaza(plaza:Plazas):void{
    
    this.plaza = Object.assign(plaza);
    this.plaza['plaza_id'] = (plaza.id) ? plaza.id : plaza['idPlaza'];
    
  }

  setTipoConvocatoria(tipoConvocatoria:TiposConvocatorias):void{
    this.tipoConvocatoria = tipoConvocatoria;
  }

  setTiposBeneficios(tipos_beneficios:any):void{
    this.tiposBeneficios = tipos_beneficios;
    console.log(this.tiposBeneficios);
  }

  setPropuestaMetodologica(propuestaMetodologica:string):void{
    this.propuestaMetodologica = propuestaMetodologica;
  }

  cleanForm():void{
    this.formulario = new postulacion();
    this.onClearFileFormato();
  }

  postularse(formulario:NgForm){
    
    if(!this._userService.isLogin()){
      let url=this.router.url;
        $('#exampleModal').modal('hide');
        this.router.navigate(['/estudiantes/login'], {queryParams: {redirect:url}});
        return;
            
    }else{
      if(!this._userService.roleMatch(['Estudiante'])){
      
        swal({
          type: 'error',
          title: 'Error',
          text: 'Debe iniciar sesión como estudiante',
        });
        return;
      }
    }
    if(!formulario.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe seleccionar una opción de respuesta',
      });
      return;
    }
    if(this.formulario.propuesta_metodologica == null && this.tipoConvocatoria == this.tiposConvocatorias.MONITORIA){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe subir un archivo PDF con la propuesta metodológica',
      });
      return;
    }
   
    //this.beneficio.plaza_id = this.id;
    this.formulario.plaza_id = this.plaza['plaza_id'];
    this.formulario.id_tipo_convocatoria = this.tipoConvocatoria;
    this.formulario.beneficio = (this.formulario.beneficio) ? this.formulario.beneficio : null;
    this.spinner.show();
    this._convocatoriaPService.postularEstudiante(this.formulario).subscribe(data=>{
      if(data['success']){
        $('#exampleModal').modal('hide');
        this.formulario = new postulacion();
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

  onUploadFileFormato(event){
    for(let file of event.files) {
      this.formulario.propuesta_metodologica=file;
    }
  }

  onClearFileFormato(){
    this.formulario.propuesta_metodologica=null;
  }

}
