import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BeneficiosService } from '../../../services/beneficios.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-complementaria-estudiante',
  templateUrl: './informacion-complementaria-estudiante.component.html',
  styleUrls: ['./informacion-complementaria-estudiante.component.css']
})
export class InformacionComplementariaEstudianteComponent implements OnInit {
  datosComplementarios:any = {
    sisben:null,
    incapacidadTotal: false,
    fallecimientoDepende:false,
    enfermedadGrave:false,
    madreGestante:false,
    eps:null
  };
  eps:any[];
  form:NgForm;

  constructor(private beneficioService: BeneficiosService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.beneficioService.getEPS().subscribe((data:any) => {
      this.eps = [...data];
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    })
  }

  validateForm(){
    if (this.form.invalid) {

      if(this.datosComplementarios.sisben == null){
        this.form.controls['sisben'].markAsTouched();
      }
      return false;
    }
    return true;
  }

}
