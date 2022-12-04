import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Estudiante } from 'src/app/interfaces/estudiantes.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import {Router, ActivatedRoute} from "@angular/router";
import { DatosEmergencia } from 'src/app/class/api';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

//Servicios
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { BeneficiosService } from 'src/app/services/beneficios.service';
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';

declare var $:any;

@Component({
  selector: 'app-dashboard-estudiante',
  templateUrl: './dashboard-estudiante.component.html',
  styleUrls: ['./dashboard-estudiante.component.css']
})

export class DashboardEstudianteComponent implements OnInit {
  
  estudiante:Estudiante;
  convocatoriasAyudantia:any[] = [];
  convocatoriasMonitorias:any[] = [];
  convocatoriasRefrigerio:any[] = [];
  encuestas:any[] = [];
  convocatoria:any = {
    ayudantia : null,
    monitoria : null,
    refrigerio : null,
    deportistas : null
  }
  datosEmergencia:DatosEmergencia;
  eps:any[];
  departamentos:any[];

  constructor(private _estudianteService: EstudiantesService, private convocatoriaAyudantias : ConvocatoriaService, private convocatoriaRefrigerios : ConvocatoriaRefrigerioService,
    private beneficioService:BeneficiosService, private spinner: NgxSpinnerService, private router:Router) {

      this.datosEmergencia = new DatosEmergencia();
      this.datosEmergencia.es_telefono_propio = true;
      this.eps = [];
      this.departamentos = [];
      
      this.spinner.show();

      this.convocatoriaAyudantias.getConvocatoriasInscripcion().subscribe((data:any)=>{
        
        this.convocatoriasAyudantia = data;
        this.spinner.hide();
      });

      this.convocatoriaRefrigerios.getConvocatoriasInscripcion().subscribe((data:any)=>{
        this.convocatoriasRefrigerio = data;
        this.spinner.hide();
      });

      this.convocatoriaAyudantias.getConvocatoriasInscripcionMonitorias().subscribe((data:any)=>{
        
        this.convocatoriasMonitorias = data;
        this.spinner.hide();
      });

      this._estudianteService.getEncuestas().subscribe((data:any) => {
        this.encuestas = data;
        if(this.encuestas['encFaltantes'].length > 0){
          let idEncuesta = this.encuestas['encFaltantes'][0]['idEncuesta'];
          this.router.navigate(['/refrigerios/estudiante/encuesta', idEncuesta]);
        }
      });

      this.beneficioService.getEPS().subscribe((data:any) => {
        this.eps = [...data];
        this.spinner.hide();
      }, (err:HttpErrorResponse) => {
        swal("Error de servidor", err.error, "error");
        this.spinner.hide();
      })
     
      this.beneficioService.getMunicipios().subscribe((data:any) => {
        this.departamentos = [...data];
        console.log(data);
        this.spinner.hide();
      }, (err:HttpErrorResponse) => {
        swal("Error de servidor", err.error, "error");
        this.spinner.hide();
      })

    }

  ngOnInit() {
    this.spinner.show();

    this._estudianteService.getInfoEstudiante().subscribe(data=>{
      
      this.estudiante=data['datosEstudiante'];
      console.log(this.estudiante);
      this._estudianteService.getFotoEstudiante(this.estudiante.codigo + "").subscribe((data:string) => {
        this.estudiante.foto = data;
      });
      if(this.estudiante != null){
        
        this.beneficioService.vertificarSolicitudRutaHumanitaria(this.estudiante.id).subscribe((data:any) => {
          if(data.success){
            this.datosEmergencia = Object.assign(data.data);
            this.datosEmergencia.user_id = this.estudiante.id;
            this.datosEmergencia.es_telefono_propio = this.datosEmergencia.acudiente == null;
            if(this.datosEmergencia.destino_diferente){
              this.datosEmergencia.departamento = this.departamentos[this.departamentos.findIndex(d => d.departamento == data.data.departamento)];
              this.datosEmergencia.municipio = this.datosEmergencia.departamento.municipios[this.datosEmergencia.departamento.municipios.findIndex(m => m.municipio == data.data.municipio)]
              
            }
            
          }
        }, (err:HttpErrorResponse) => {
          swal("Error de servidor", err.error, "error");
          this.spinner.hide();
        });
      }
      
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });    
    });

    
    
  }

  enviarFormularioAyudantia(){
    $('#modalConvocatoriaAyudantias').modal('hide');
    this.router.navigate(['/plazasConvocatorias',this.convocatoria.ayudantia.id, this.estudiante.codigo]);
  }

  enviarFormularioMonitoria(){
    $('#modalConvocatoriaMonitorias').modal('hide');
    this.router.navigate(['/plazasConvocatorias',this.convocatoria.monitoria.id, this.estudiante.codigo]);
  }

  enviarFormularioRefrigerio(){
    $('#modalConvocatoriaRefrigerios').modal('hide');
    this.router.navigate(['/inscripcion',this.convocatoria.refrigerio.id]);
  }

  /**
   * Metodo para almacenar la información de solicitud de ruta humanitaria
   * @param form formulario de solicitud de ayuda humanitaria
   */
  guardarSolicitud(form:NgForm){
    console.log(form);
    if(!form.valid) return;
    console.log("valid");

    this.spinner.show();
    this.datosEmergencia.user_id = this.estudiante.id;
    let temp = Object.assign({},this.datosEmergencia);
    if(this.datosEmergencia.destino_diferente){
      this.datosEmergencia.departamento = this.datosEmergencia.departamento.departamento;
      this.datosEmergencia.municipio = this.datosEmergencia.municipio.municipio;
    }
    
    this.beneficioService.guardarSolicitudRutaHumanitaria(this.datosEmergencia).subscribe((resp:any) => {
      if(resp.success){
        this.datosEmergencia.apoyo_id = resp.data.datos.apoyo_id;
        this.datosEmergencia.departamento = temp.departamento;
        this.datosEmergencia.municipio = temp.municipio;
        swal("Registro exitoso", "Se ha registrado su solicitud correctamente.", "success");
      }else{
        swal("Error", resp.message, "error");
      }
      $("#rutaModal").modal("hide");
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    });
  }

}
