import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Eps } from 'src/app/class/eps';
import { CitasService } from 'src/app/services/citas.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-actualizar-datos',
  templateUrl: './actualizar-datos.component.html',
  styleUrls: ['./actualizar-datos.component.css']
})
export class ActualizarDatosComponent implements OnInit {

  salud:any[] = Eps.eps;
  tipos_sangre : any[] = [];
  estados_civil : any [] = [];
  tipos_doc :  any [] = [];
  userService: UserService;

  // formulario:any={
  //   nombre:null,
  //   identificacion:null,
  //   sexo:null,
  //   fecha_nacimiento:null,
  //   tipo_id:null,
  //   eps:null,
  //   tipo_sangre:null,
  //   estado_civil:null,
  //   ocupacion:null,
  //   direccion:null,
  //   accion:null,
  // }
  formulario:Persona = new Persona();
  error: any;
  id: any;




  constructor( private _citasService: CitasService ,
               private router:Router,
               private route: ActivatedRoute, 
               private _location: Location,
               private spinner: NgxSpinnerService,
               private _userService:UserService) { this.userService = _userService }
               

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._citasService.getDatosActualizacion(this.id).subscribe(data=>{ 
        if (data['success']) {
        this.estados_civil=data['objRetornado'].estado_civil;  
        this.tipos_sangre=data['objRetornado'].tipo_sangre;
        this.tipos_doc =  data['objRetornado'].tipos_identificacion;
        this.formulario  = Object.assign(this.formulario, data['objRetornado'].persona);
        
        // this.formulario.fecha_nacimiento = new Date(this.formulario.fecha_nacimiento)
        // console.log(this.formulario.fecha_nacimiento);
        this.spinner.hide();
        }
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
         this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });    
      });
  });


  }


  ActualizarInformacion(forma: NgForm)
  {
    // this.spinner.show();
    console.log(forma);

    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      // this.spinner.hide();
    } else {
      if (this.userService.tipoMatch(['Estudiante'])) {
        this.formulario.accion = true;
      } else {
        this.formulario.accion = false;
      }


      this._citasService.postActualizarDatos(this.formulario).subscribe(data => {
          if (data['success']) {
            
            swal({
              type: "success",
              title: "Realizado",
              text: "Información actualizada satisfactoriamente.",
              timer: 2000,
              showConfirmButton: false
            });
            
            setTimeout(() => {

                if (this.userService.tipoMatch(['Estudiante'])) {
                  this.router.navigate(['/citasAgenda']);
                } else {

                  if (data['tipo'] == 3){
                    this.router.navigate(['/atenciones/deportologia/1/'+data['identificacion']]);
                  }

                  if (data['tipo'] == 4) {
                    this.router.navigate(['/atenciones/medicinageneral/1/'+data['identificacion']]);
                  }
                  
                  if (data['tipo'] == 6) {
                    this.router.navigate(['/atenciones/enfermeria/1/'+data['identificacion']]);
                  }
                  
                }

            }, 1500);
            // identificacion
            // this.spinner.hide(); 
            // forma.resetForm();   
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            // this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          // this.spinner.hide()
        });
    }
  }

  goBack():void{
    this._location.back();
  }


}
class Persona{
  nombre:string;
    identificacion:string;
    sexo:string;
    fecha_nacimiento:string;
    tipo_id:number;
    eps:string;
    tipo_sangre:string;
    estado_civil:string;
    ocupacion:string;
    direccion:string;
    accion:boolean;
    paciente:any;

    constructor(){
      this.estado_civil = null;
      this.tipo_sangre = null;
    }
}
