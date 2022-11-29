import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { AtencionService } from 'src/app/services/atencion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/primeng';
import { PROFILE_BY } from 'src/app/class/api';
import { PerfilSaludComponent } from '../perfil-salud/perfil-salud.component';

declare var $:any;
declare var jQuery:any;
@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.css'],
  providers: [MessageService]
})
export class DetalleCitaComponent implements OnInit {
  evolucion:any = {
    conducta:null, 
    atencionClinica:null,
  };
  id: any;
  profile_by:PROFILE_BY = PROFILE_BY.ID_Paciente;
  @ViewChild(PerfilSaludComponent) perfilReference:PerfilSaludComponent;

  atencionClinica_id: any;
  atencion:any = {
// examenes fisicos
    ta	:null,
    temperatura	:null,
    fr	:null,
    glasgow	:null,
    fc	:null,
    peso	:null,
    talla	:null,
    observacion	:null,
    examenesFisicos:null,
    // laborartoios
    laborartoios:null,
    enfermedad_actual:null,
    conducta:null,
  };
  antecedentes_gineco:any={
    menarquia:null,   
    sexarquia	:null,
    fum	:null,
    ciclos	:null,
    gravidez	:null,
    abortos	:null,
    partos	:null,
    vaginales	:null,
    cesareas	:null,
    ectopicos	:null,
    gemelar	:null,
    muertos	:null,
    vivos	:null,
    viven	:null,
    observaciones	:null,
  };
  error: any[];

  constructor(
    private _detallecita: AtencionService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location,  
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._detallecita.getAtencion(this.id).subscribe(data=>{        
        this.atencion = data['atencion']; 
        this.antecedentes_gineco = data['antecedentes_gineco']; 
        this.atencionClinica_id = data['atencion'].atencionClinica; 

        this.perfilReference.show(this.atencion.paciente);

        // examenes fisico   
      
        this.atencion.ta = data['atencion'].atenciones_clinicas.ta;
        this.atencion.temperatura	 = data['atencion'].atenciones_clinicas.temperatura;
        this.atencion.fr	 = data['atencion'].atenciones_clinicas.fr;
        this.atencion.glasgow	 = data['atencion'].atenciones_clinicas.glasgow;
        this.atencion.fc	 = data['atencion'].atenciones_clinicas.fc;
        this.atencion.peso	 = data['atencion'].atenciones_clinicas.peso;
        this.atencion.talla	 = data['atencion'].atenciones_clinicas.talla;
        this.atencion.observacion	 = data['atencion'].atenciones_clinicas.observacion;
        this.atencion.examenesFisicos	 = data['atencion'].atenciones_clinicas.examenesFisicos;
        this.atencion.laborartoios	 = data['atencion'].atenciones_clinicas.laborartoios;
        this.atencion.enfermedad_actual	 = data['atencion'].atenciones_clinicas.enfermedad_actual;
        this.atencion.conducta	 = data['atencion'].atenciones_clinicas.conducta;

       console.log( 'esta es la atención',this.atencion);
       console.log( 'esta es la antecedentes_gineco',this.antecedentes_gineco);
          
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

    }); 
  }


  conducta(){    
    $('#conductaModal').modal('show');
  }

  conductaGuardar(forma: NgForm){
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this.evolucion.atencionClinica = this.atencionClinica_id;
      this._detallecita.addEvolucion(this.evolucion)
        .subscribe(data => {
          if (data['success']) {
            
            this.atencion.conducta.push(data['objRetornado']);
          
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente la evolución.",
              timer: 2000,
              showConfirmButton: false
            });
            
            $('#conductaModal').modal('hide');
            forma.resetForm(this.evolucion);
            this.error = [];
            this.spinner.hide();
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
    }

  }

  backClicked() {
    this._location.back();
  }

  // ngAfterContentChecked(): void {
  //   this.changeDetector.detectChanges();
  // }

}
