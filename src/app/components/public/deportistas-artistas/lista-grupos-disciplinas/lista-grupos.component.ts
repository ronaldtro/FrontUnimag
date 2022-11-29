import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { Location } from '@angular/common';
import { Api } from 'src/app/class/api';
import { DisciplinasService } from 'src/app/services/disciplina.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit {

  /**
   * Contiene la lista de las disciplinas de una modalidad que se haya seleccionado.
   */
  listaDisciplinas : any[] = [];

  nombreModalidad : string;
  idModalidad : number;
  api=Api.dev;

  constructor(private _grupoService : GruposDeportivosService,
    private _inscripcionArtistasDeportistasService:InscripcionArtistasDeportistasService, 
    private route:ActivatedRoute, 
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  /**
   * Obtiene las disciplinas por la modalidad. 
   */
  ngOnInit() {
  this.spinner.show();
    this.route.params.subscribe(param => {
      this.nombreModalidad = param['modalidad'];

      if(this.nombreModalidad == 'deportivos'){
          this.idModalidad = 1;
      }else{
        if(this.nombreModalidad == 'culturales'){
          this.idModalidad = 2;
        }
      }
   
      this._inscripcionArtistasDeportistasService.getDisciplinasPorModalidad(this.idModalidad).subscribe(data => {
        this.listaDisciplinas = data['disciplinas'];
        this.spinner.hide();
      }, err=> {
        this.spinner.hide();
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Oops...',
          text: respuesta.msg,
        });
      });
    });
  }
}
