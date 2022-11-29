import { Component, OnInit } from '@angular/core';
import { ProfesionalSaludService } from 'src/app/services/profesionalSalud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesional } from 'src/app/interfaces/profesionalSalud.interface';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';

@Component({
  selector: 'app-guardar-profesionalsalud',
  templateUrl: './guardar-profesionalsalud.component.html',
  styleUrls: ['./guardar-profesionalsalud.component.css']
})
export class GuardarProfesionalsaludComponent implements OnInit {
  id:number;
  errores:any[]=[];
  tiposProfesionales:object[]=[];
  profesional:Profesional = {
    tipoProfesional_id:null,
  };
  constructor(private _profesionalSaludService:ProfesionalSaludService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService) { 
      this.spinner.show();
      this.route.params.subscribe(parametros=>{
        this.id = parametros['id'];
        
        if(this.id != null){
          console.log(this.id);
          this._profesionalSaludService.getProfesional(this.id)
            .subscribe(prof=>{this.profesional = prof['profesional']
              
            }, err =>{
              let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
              swal({
                type: 'error',
                title: 'Error',
                text: respuesta.msg,
              });
              this.spinner.hide();
            })
            
        }
        this.spinner.hide();
      })
    this.spinner.show();
    this._profesionalSaludService.getDatosCrear().subscribe(data => {
      this.tiposProfesionales = data['tiposProfesionales'];
      this.spinner.hide();
    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });

    /*this._bolsaPresupuestalService.getBolsa(this.id).subscribe(data => {
    });*/

  }

  ngOnInit() {
  }
  guardar(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._profesionalSaludService.guardarProfesional(this.profesional).subscribe(data => {
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
          this.router.navigate(['/profesionalesSalud']);
        }, 1500);
      }else{
        if(data['errores'] != null){
          this.errores = data['errores'];
        }        
        this.spinner.hide();
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        
      }
      
    }),err=> {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()    
    };
  }
}
