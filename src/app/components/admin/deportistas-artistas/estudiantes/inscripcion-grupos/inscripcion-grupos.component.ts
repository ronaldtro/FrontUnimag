import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-inscripcion-grupos',
  templateUrl: './inscripcion-grupos.component.html',
  styleUrls: ['./inscripcion-grupos.component.css']
})

export class InscripcionGruposComponent implements OnInit {

  listaGrupos : any[] = [];
  listaRoles : any[] = [];
  inscripcion : any = {idRol : null};
  errores:Message[]=[];
  error:any;
  
  constructor(private _inscripcionArtistasDeportistasService:InscripcionArtistasDeportistasService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.spinner.show();

    this._inscripcionArtistasDeportistasService.getDatosInscripcionGrupos().subscribe(data => {
      
      this.listaGrupos = data['grupos'];
    
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
    });
  }

  abrirModalRoles(grupo:any){
    this.inscripcion = {idRol : null};
    this.errores = [];

    this.inscripcion.idGrupo = grupo.id;

    this._inscripcionArtistasDeportistasService.getRolesGrupo(grupo.id).subscribe(data => {

      this.listaRoles = data['roles']
    });

    $('#elegirRolModal').modal('show');
  }


  guardarInscripcion(){
 
    this._inscripcionArtistasDeportistasService.guardarInscripcionGrupo(this.inscripcion).subscribe(data=>{

      if(data["success"]){

        this.listaGrupos.filter(grupo => {
          if(grupo.id === this.inscripcion.idGrupo){
              grupo.estudiantesInscritos = data['numeroEstudiantesRegistrados'];
          }
        });

        swal({
          title: "Realizado",
          text: "Se ha inscrito correctamente",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });

        this.errores = [];
        setTimeout(() => {
          $('#elegirRolModal').modal('hide');
          this.router.navigate(['/estudiantes', 'dashboard']);
        }, 1500);
      }else{
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo inscribir',
        });
      }
    });
  }
  
  goBack():void{
    this._location.back();
  }

}
