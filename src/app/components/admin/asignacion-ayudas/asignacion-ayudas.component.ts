import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { CondicionService } from 'src/app/services/condicion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatosEstudiante } from 'src/app/class/api';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $:any;
const maxCantCodigos = 100;

@Component({
  selector: 'app-asignacion-ayudas',
  templateUrl: './asignacion-ayudas.component.html',
  styleUrls: ['./asignacion-ayudas.component.css']
})
export class AsignacionAyudasComponent implements OnInit {

  codigos_input:string;
  codigosValidos:DatosEstudiante[];
  almacenesEntrega:any[];
  beneficios:any[];

  constructor(private condicionService:CondicionService, private spinner: NgxSpinnerService) {
    this.codigosValidos = [];
    this.almacenesEntrega = [];
    this.beneficios = [];
   }

  ngOnInit() {
    this.spinner.show();
    this.condicionService.getAlmacenesEntrega().subscribe((data:any[]) => {
      this.almacenesEntrega = data;
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    });

    this.spinner.show();
    this.condicionService.getBeneficiosDeAyuda().subscribe((data:any[]) => {
      this.beneficios = data;
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    });

  }

  /**
   * Metodo que permite consultar los codigos de los estudiantes a ayudar
   * @param form formulario para envio de códigos
   */
  consultarCodigos(form:NgForm):void{
    
    //2012114094,20201571033,202012410332,2018,2018161027,2016114094,154 test

    if(!form.valid){
      return;
    }

    //Obtiene solo numeros entre 10 y 12 caracteres.
    let codigosValidos = this.codigos_input.match(/\d{10,12}/g);
    if(codigosValidos.length == 0){
      swal("Error","Debe ingresar al menos un código válido para realizar la consulta", "error");
      return;
    }
    if(codigosValidos.length > maxCantCodigos){
      swal("Error","Ha insertado más de " + maxCantCodigos + " códigos", "warning");
      return;
    }
    this.codigosValidos = [];
    for(let i = 0; i < codigosValidos.length; i++){
      let estudiante = new DatosEstudiante();
      estudiante.codigo = codigosValidos[i].trim();
      if(this.codigosValidos.findIndex(item => item.codigo == codigosValidos[i]) == -1){
        this.codigosValidos.push(estudiante);
      }
      
    }

    for(let i = 0; i < this.codigosValidos.length; i++){
      this.condicionService.getDatosEstudiante(this.codigosValidos[i].codigo).subscribe((data:DatosEstudiante) => {
        if(data["statusCode"] == 404){
          this.codigosValidos[i].nombre = data["message"];
        }else{
          this.codigosValidos[i] = Object.assign(this.codigosValidos[i], data);
          if(this.beneficios.length == 1) this.codigosValidos[i].estudianteBeneficio.beneficio_id = this.beneficios[0].id;
          
        }
        
        this.codigosValidos[i].cargando = false;
      }, (err:HttpErrorResponse) => {
        swal("Error de servidor", err.error, "error");
      });
    }

    console.log(this.codigosValidos);
  }

  /**
   * Metodo para registrar la ayuda
   * @param form formulario para registrar ayuda
   */
  registrarAyuda(form:NgForm, estudiante:DatosEstudiante):void{
    if(!form.valid){
      return;
    }

    estudiante.estudianteBeneficio.estudiante_id = estudiante.id;
    estudiante.estudianteBeneficio.sisben = estudiante.sisben;
        
    
    if(this.tieneBeneficio(estudiante) || estudiante.tiene_beneficio_alimenticio.length > 0 || estudiante.tiene_ayudantia.length > 0){
      swal({
        title: 'Registrar beneficio',
        text: "Este estudiante ya posee un apoyo, estímulo o beneficio registrado ¿Está seguro de registrar este nuevo beneficio?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'btn btn-success m-1',
        cancelButtonClass: 'btn m-1',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.enviarRegistroAyuda(estudiante);
        }
      })  
    }else{
      this.enviarRegistroAyuda(estudiante);
    }
    
  }

  /**
   * Metodo que invoca el servicio para almacenar el beneficio asignado al estudiante
   * @param estudiante datos de estudiante a registrar
   */
  enviarRegistroAyuda(estudiante:DatosEstudiante):void{
    this.spinner.show();
    this.condicionService.registrarAsignacionDeAyuda(estudiante.estudianteBeneficio).subscribe((data:any) => {
      if(data["success"]){
        $("#collapseDatos-"+estudiante.id).collapse("hide");
        $("#collapseBeneficios-"+estudiante.id).collapse("hide");
        estudiante.estudianteBeneficio.id = data["id"];
        estudiante.registrado = true;
        this.spinner.hide();
      }else{
        this.spinner.hide();
        swal("Error de servidor",data["message"], "error");
      }
    }, (err:HttpErrorResponse) => {
      this.spinner.hide();
      swal("Error de servidor", err.error, "error");
    });
  }

  /**
   * Metodo para verificar si un estudiante ya tiene el beneficio 
   * @param estudiante estudiante a beneficiar
   */
  tieneBeneficio(estudiante:DatosEstudiante):boolean{
    return estudiante.beneficios.filter(item => item.id == estudiante.estudianteBeneficio.beneficio_id).length > 0;
  }

  /**
   * Metodo para deshacer el registro
   * @param estudiante datos del estudiante con beneficio
   */
  undo(estudiante:DatosEstudiante):void{
    this.spinner.show();
    this.condicionService.eliminarRegistroAyuda(estudiante.estudianteBeneficio.id).subscribe((data:any) => {
      if(data["success"]){
        estudiante.registrado = false;
      }else{
        swal("Error", data["message"], "error");
      }
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      this.spinner.hide();
      swal("Error de servidor", err.error, "error");
    });
  }

}

