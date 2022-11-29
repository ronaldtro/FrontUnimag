import { Component, OnInit } from '@angular/core';
import { PlazaService } from 'src/app/services/plaza.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Plazas } from 'src/app/interfaces/Plazas.interface';
import swal from 'sweetalert2';
import {Location} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { Estudiante } from 'src/app/class/api';

@Component({
  selector: 'app-ratificar',
  templateUrl: './ratificar.component.html',
  styleUrls: ['./ratificar.component.css']
})
export class RatificarComponent implements OnInit {

  plaza_id:number;
  plaza:Plazas;
  monitoresARatificar:MonitorARatificar[];
  estudiantesSeleccionados:MonitorARatificar[];
  userService:UserService;
  data:any = {
    codigo: null
  }
  estudianteEncontrado:Estudiante;

  constructor(private _plazaService: PlazaService, 
    private route: ActivatedRoute, 
    private spinner: NgxSpinnerService, 
    private _location: Location,
    private _userService:UserService,
    private _estudianteService:EstudiantesService) { 
    route.params.subscribe(parametros => {
      
      this.plaza_id = parametros['plaza_id'];
      
    });
    this.plaza = new Plazas();
    this.monitoresARatificar = [];
    this.estudiantesSeleccionados = [];
    this.userService = _userService;
    
  }

  ngOnInit() {
    this.spinner.show();
    this._plazaService.getPlazaSolicitada(this.plaza_id).subscribe((data:any)=>{
      this.spinner.hide();
      this.plaza = Object.assign({}, data["plazaSolicitada"]);
    }, (err:HttpErrorResponse) => {
      console.error(err.error);
    });
    this.spinner.show();
    this._plazaService.getMonitoresParaRatificarDePlazaAnterior(this.plaza_id).subscribe((data:MonitorARatificar[]) => {
      this.spinner.hide();
      this.monitoresARatificar = Object.assign([], data);
      this.estudiantesSeleccionados = [...this.monitoresARatificar.filter(m => m.es_ratificado)];
    }, (err:HttpErrorResponse) => {
      console.error(err.error);
    })
  }

  /**
   * Permite ratificar los estudiantes seleccionados por el usuario
   */
  ratificarEstudiantes():void{
    if(this.estudiantesSeleccionados.length){
      this.estudiantesSeleccionados.map(e => e.codigo);
      this.spinner.show();
      this._plazaService.ratificarEstudiantesSeleccionados({
        plaza_id: this.plaza.id,
        codigos: this.estudiantesSeleccionados.map(e => e.codigo)
      }).subscribe((data:any) => {
        this.spinner.hide();
        swal({
          type: 'success',
          title: 'Realizado',
          text: 'Se ha registrado satisfactoriamente la solicitud.',
          showConfirmButton: false,
          timer: 1500
        })
        this.spinner.hide();
        this.goBack();
      }, (err:HttpErrorResponse) => {
        console.error(err.error);
      });
    }else{
      swal({
        type: 'warning',
        title: 'Selección de ratificados',
        text: 'No se seleccionó ningún ratificado para esta plaza',
        showConfirmButton: false,
        timer: 1500
      });
      this.goBack();
    }
  }

  buscarEstudiante(_form:NgForm):void{
    if(!_form.valid){

      return;
    }
    this.spinner.show();
    this._estudianteService.getEstudianteByCodigo(this.data.codigo).subscribe((data:Estudiante) =>{
      this.spinner.hide();
      let est:MonitorARatificar = new MonitorARatificar();
      let test = Object.assign(est, data);
      if(est.activo == "SI"){
        est.nombre = data.nombre;
        est.programa = data.programa,
        est.promedio_acum = data.promedio_acum,
        est.porcentaje_cred = data.porcentaje_cred,
        est.facultad = data.facultad;
        this.monitoresARatificar.push(est);
        this.estudiantesSeleccionados.push(est);
        this.data.codigo = null;
      }else{
        swal("Estudiante inactivo", "El estudiante "+ est.nombre +" con código "+ est.codigo +" aparece INACTIVO en la información suministrada por el Grupo de Admisiones, Registro y Control Académico. Intente agregar al estudiante nuevamente una vez se haya actualizado su estado.", "error");
        
      }
      
      
      _form.form.markAsUntouched();
      _form.form.markAsPristine();
      _form.resetForm();
    },(err:HttpErrorResponse) =>{
      console.error(err.error);
    });
  }

  goBack():void{
    this._location.back();
  }

}

export class MonitorARatificar{
  id:number;
  nombre:string;
  programa:string;
  facultad:string;
  codigo:string;
  id_plaza:number;
  id_plaza_convocatoria_est:number;
  plaza:string;
  convocatoria:string;
  id_convocatoria:number;
  no_calificaciones:number;
  calificiones:number;
  calificacion_tutor:number;
  estado:boolean;
  porcentaje_cred:number;
  promedio_acum:number;
  activo:string;
  es_ratificado:boolean;
}
