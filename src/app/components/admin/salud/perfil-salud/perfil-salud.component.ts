import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, AfterViewChecked } from '@angular/core';
import { PROFILE_BY } from 'src/app/class/api';
import { CitasService } from 'src/app/services/citas.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';

@Component({
  selector: 'app-perfil-salud',
  templateUrl: './perfil-salud.component.html',
  styleUrls: ['./perfil-salud.component.css']
})
export class PerfilSaludComponent implements OnInit {

  @Input() id:number;
  @Input() tipoBusqueda:PROFILE_BY;



  atencion:Atencion = new Atencion();

  constructor( private _citasService : CitasService) { }

  ngOnInit() {
    this.search();
  }

  show(id:number):void{
    
    this.id = id;
    this.search();
  }

  

  search():void{
    
    if(this.tipoBusqueda){
      switch (this.tipoBusqueda) {
        case PROFILE_BY.ID_Cita:
          if(this.id){
            
              this._citasService.getInfoPacienteByCita(this.id).subscribe(data=>{        
                if (data['success']) {
                  this.atencion = Object.assign(this.atencion, data['objRetornado']);
                } 
            }, err=> {
              let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
              swal({
                type: 'error',
                title: 'Error',
                text: respuesta.msg,
              });    
            });
          }
        break;

        case PROFILE_BY.ID_Paciente:
            
            if(this.id){
              this._citasService.getInfoPacienteById(this.id).subscribe(data=>{        
                  if (data['success']) {
                    // console.log(data);
                    this.atencion = Object.assign(this.atencion, data['objRetornado']);
                  } 
              }, err=> {
                let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
                swal({
                  type: 'error',
                  title: 'Error',
                  text: respuesta.msg,
                });    
              });
            }
          break;

        case PROFILE_BY.Session:
            this._citasService.getInfoPacienteById().subscribe(data=>{        
              if (data['success']) {
                this.atencion = Object.assign(this.atencion, data['objRetornado']);
              } 
          }, err=> {
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });    
          });
         break;
      
        default:

          break;
      }
    }
  }


}

class Atencion{
    paciente:string;
    identificacion:string;
    email:string = null;
    sexo:boolean;
    fecha_nacimiento:string;
    eps:string;
    tipo_sangre:string;
    estado_civil:string;
    ocupacion:string;
    residencia:string;
    Edad:number;
}