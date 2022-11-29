import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalcularEdadPipe } from 'src/app/pipes/calcular-edad.pipe';
import swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  encuesta:Encuesta;
  tipo_calificaciones:Calificacion[];

  constructor(
    private _estudidantesService:EstudiantesService,
    private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router:Router
  ) { 
    this.encuesta = new Encuesta();
    this.tipo_calificaciones = [];
  }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id'];
      this._estudidantesService.getDatosEncuestas(id).subscribe(
        (data:any) => {
          
          this.encuesta = data['encuestas'];
          for (let i = 0; i < data['tiposCalificaciones'].length; i++) {
            this.tipo_calificaciones.push(data['tiposCalificaciones'][i]);
          }
          this.spinner.hide();
        }, (err:any) => {
          console.error(err);
        }
      );
    });

    
    
  }
  

/**
 * Metodo para enviar los datos de la encuesta resuelta por el estudiante.
 * 
 * @param form Formulario que contiene los datos de la encuesta realizada
 */

  enviarEncuesta(form:NgForm):void{
    if(!form.valid){
      swal({
        title: "Error al enviar encuesta",
        text: "Revise el formulario y vuelva a intentarlo.",
        type: "error",
      }); 
      return;
    }
    this.spinner.show();
    this._estudidantesService.guardarEncuesta(this.encuesta).subscribe((data:any) => {
      swal({
        title: "Encuesta realizada",
        text: "Gracias por realizar la encuesta. Tenga buen día",
        type: "success",
        timer: 2000,
        showConfirmButton: false
      });  
      this.spinner.hide();
      this.router.navigate(['/estudiantes/dashboard']);
    })
  }

}

export class Encuesta{
  id:number;
  beneficio:Beneficio;
  componentes:Componente[];
  constructor(){
    this.beneficio = new Beneficio();
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
  calificacion_id:number = null;
}

class Beneficio{
  id:number;
  nombre:string;
}

class Calificacion{
  id:number;
  nombre:string;
}