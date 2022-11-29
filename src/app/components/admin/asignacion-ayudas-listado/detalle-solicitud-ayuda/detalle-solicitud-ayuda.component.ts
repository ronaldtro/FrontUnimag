import { Component, OnInit, Input } from '@angular/core';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { HttpErrorResponse } from '@angular/common/http';
import swal from 'sweetalert2';
import { CondicionService } from 'src/app/services/condicion.service';

declare var $:any;

@Component({
  selector: 'app-detalle-solicitud-ayuda',
  templateUrl: './detalle-solicitud-ayuda.component.html',
  styleUrls: ['./detalle-solicitud-ayuda.component.css']
})
export class DetalleSolicitudAyudaComponent implements OnInit {

  @Input() estudianteSeleccionado: any;

  constructor(private estudianteService: EstudiantesService, private condicionesEstudiantesService: CondicionService) { }

  ngOnInit() {
  }

  /**
   * Metodo par amostrar la información del estudiante seleccionado
   * @param estudiante estudiante a mostrar
   */
  show(estudiante:any){
    this.estudianteSeleccionado = estudiante;
    $("#detallesModal").modal("show");
  }

  actualizarSisben():void{
      this.estudianteService.actualizarSisben(this.estudianteSeleccionado.id, this.estudianteSeleccionado.sisben).subscribe((data:any) => {
        if(data["success"]){
          this.estudianteSeleccionado.sisben = data.sisben;
        }else{
          swal("Error", data["message"], "error");
        }
      }, (err:HttpErrorResponse) => {
        swal("Error de servidor", err.error, "error");
      });
  }

  eliminarEnvio(entrega:any):void{
    this.condicionesEstudiantesService.eliminarEnvioAyuda(entrega.id).subscribe((data:any) => {
      if(data["success"]){
        this.estudianteSeleccionado.envios.splice(this.estudianteSeleccionado.envios.indexOf(entrega), 1);
        swal("Envío eliminado", "Se ha eliminado el registro con éxito", "success");
      }else{
        swal("Error", data["message"], "error");
      }
    }, (err:HttpErrorResponse) => {
        swal("Error de servidor", err.error, "error");
      })
  }

}
