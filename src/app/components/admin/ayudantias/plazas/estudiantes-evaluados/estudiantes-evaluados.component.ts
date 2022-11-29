import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { PlazaService } from 'src/app/services/plaza.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { EstudiantePlaza, EstudianteEval } from 'src/app/interfaces/estudiantesPlazas.Interfaces';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiposConvocatorias } from 'src/app/class/api';

@Component({
  selector: 'app-estudiantes-evaluados',
  templateUrl: './estudiantes-evaluados.component.html',
  styleUrls: ['./estudiantes-evaluados.component.css'],
  providers: [MessageService]
})
export class EstudiantesEvaluadosComponent implements OnInit {

  id:number;
  cupos:number;
  
  
  aprobados:any ={
    idPlaza: 0,
    listadoAprobados: [] = []
  };
  estudiantesEvaluados:EstudianteEval={
    convocatoria:"",
    tipo_convocatoria:null,
    cupos:0,
    estado:"",
    evaluados:[],
    etapa_id:null,
    nota_minima:0,
    puntaje:0
  }

  tiposConvocatorias = TiposConvocatorias;

  constructor(private _plazasServices:PlazaService, 
              private route:ActivatedRoute , 
              private _userService:UserService , 
              private messageService: MessageService,
              private router:Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this.spinner.show();
      this._plazasServices.getEstudiantesEval(this.id).subscribe(data=>{
        if(data['success']){
          
          this.estudiantesEvaluados = data['plaza'];
          this.cupos = this.estudiantesEvaluados.cupos;
          this.aprobados.listadoAprobados = data['aprobados'];
          this.aprobados.idPlaza= this.id;
          this.spinner.hide();
         
        }
      })
    });
  }

  guardar(forma: NgForm) {


    if (this.aprobados.listadoAprobados.length < 1 ) {
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: "Debe seleccionar por lo menos un estudiante." });
    } else if (this.aprobados.listadoAprobados.length > this.cupos ) {
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: "El numero de estudiantes supera el número de cupos." });
    } else {
      swal({
        title: 'Aprobar estudiantes',
        text: '¿Está seguro de realizar esta acción?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
      }).then((res) => {
        if (res.value) {
          this._plazasServices.postAprobarEst(this.aprobados).subscribe(data=>{
            if (data['success']) {
              
              swal({
                type: "success",
                title: "Realizado",
                text: "Se han aprobado los estudiantes satisfactoriamente.",
                timer: 2000,
                showConfirmButton: false
               });
               this.router.navigate([`/plazas/${this.id}/estudiantes`]);  
            }});
        }else if (res.dismiss === swal.DismissReason.cancel){
          // swal({
          //   type: "error",
          //   title: "Cancelado",
          //   text: "Se ha cancelado la acción.",
          //   timer: 2000,
          //   showConfirmButton: false
          //    });
        }
      }); 
    }

    
  }













}
