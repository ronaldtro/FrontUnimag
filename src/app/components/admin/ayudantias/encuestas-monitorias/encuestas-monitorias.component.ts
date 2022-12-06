import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

//Servicios
import { ComiteMonitoriasService } from 'src/app/services/comite-monitorias.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-encuestas-monitorias',
  templateUrl: './encuestas-monitorias.component.html',
  styleUrls: ['./encuestas-monitorias.component.css']
})
export class EncuestasMonitoriasComponent implements OnInit {

  id:number = null;
  encuesta:EncuestaMonitorias;
  calificaciones:number[];
  userService:UserService;
  token:string;

  constructor (
    private _comiteMonitoriaService:ComiteMonitoriasService,
    private _estudianteService: EstudiantesService,
    private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router:Router,
    private _location: Location,
    private _userService:UserService )
  {
    this.encuesta = new EncuestaMonitorias();
    this.userService = _userService;
  }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params =>{
      this.id = params['id'];
      if(this.id != null){
        this._comiteMonitoriaService.getDatosEncuesta(this.id).subscribe(data=>{
          this.mostrarEncuesta(data);
          this.spinner.hide();
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide();
        });
      }else{
        let tipo_encuesta = params['tipo_encuesta'];
        this.token = params["token"];
        if(tipo_encuesta == "estudiante" || tipo_encuesta == 1){
          this._comiteMonitoriaService.getDatosEncuestaByToken(this.token).subscribe((data:any)=> {
            if(data["success"]){
              this.mostrarEncuesta(data);
            }else{
              this.encuesta = null;
            }
            
            this.spinner.hide();
          }, (err:any)=> {
            this.spinner.hide();
            console.error(err);
          })
        }
        
      }
      
    });
  }

  mostrarEncuesta(data:any):void{
    this.encuesta = Object.assign(data['encuesta']);
    this._estudianteService.getFotoEstudiante(this.encuesta.monitor.codigo + "").subscribe((data:string) => {
      this.encuesta.monitor.foto = data;
    });
    for (let i = 0; i < this.encuesta.componentes.length; i++) {
      for (let j = 0; j < this.encuesta.componentes[i].items.length; j++) {
        this.encuesta.componentes[i].items[j].valoresCalificacion = [];
        for (let k = this.encuesta.componentes[i].items[j].min_calificacion; k <= this.encuesta.componentes[i].items[j].max_calificacion; k++) {
          this.encuesta.componentes[i].items[j].valoresCalificacion.push(k);
        }
      }
    }
  }

  enviarEncuesta(form:NgForm):void {
    if(!form.valid){
      swal({
        type: 'error',
        title: 'Error al enviar la encuesta',
        text: "Verifique que todas las preguntas se hayan respondido",
      });
      return;
    }
    if (this.id != null) {

      let envio:EnviarEncuesta = new EnviarEncuesta();
      envio.plaza_convocatoria_estudiante_id = this.id;
      envio.componentes = this.encuesta.componentes;
      this.spinner.show();
      this._comiteMonitoriaService.guardarEncuestaDocenteTutor(envio).subscribe((data:any) => {
        swal({
          title: "Encuesta realizada",
          text: "Gracias por realizar la encuesta. Tenga buen día.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });  
        this.spinner.hide();
        this._location.back();
      }, (err:any) => {
        console.error(err.message);
      });
    } else {
      
      let envio:EnviarEncuesta = new EnviarEncuesta();
      envio.token = this.token;
      envio.componentes = this.encuesta.componentes;
      this.spinner.show();
      this._comiteMonitoriaService.guardarEncuesta(envio).subscribe((data:any) => {
        swal({
          title: "Encuesta realizada",
          text: "Gracias por realizar la encuesta. Tenga buen día.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });  
        this.spinner.hide();
        this.router.navigate(['/']);
      }, (err:any) => {
        console.error(err.message);
      });
    }
  }

}

class EncuestaMonitorias{
  id:number;
  fecha_limite_calificacion:Date;
  max_encuestados:number;
  monitor:any;
  componentes:Componente[];
  constructor(){
    this.monitor = new Object();
    this.componentes = [];
  }
}

class Componente{
  id:number;
  nombre:string;
  items:Item[];
  constructor(){
    this.items = [];
  }
}

class Item{
  id:number;
  nombre:string;
  max_calificacion:number;
  min_calificacion:number;
  valoresCalificacion:number[];
  calificacion:number = null;
  constructor(){
    this.valoresCalificacion = [];
  }
}

class EnviarEncuesta{
  token:string;
  plaza_convocatoria_estudiante_id:number;
  componentes : Componente[];
}
