import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { AtencionService } from 'src/app/services/atencion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/primeng';
import { PROFILE_BY } from 'src/app/class/api';
import { PerfilSaludComponent } from '../perfil-salud/perfil-salud.component';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-detalle-cita-enfermeria',
  templateUrl: './detalle-cita-enfermeria.component.html',
  styleUrls: ['./detalle-cita-enfermeria.component.css'],
  providers: [MessageService]
})
export class DetalleCitaEnfermeriaComponent implements OnInit {
  id: any;
  profile_by:PROFILE_BY = PROFILE_BY.ID_Paciente;
  @ViewChild(PerfilSaludComponent) perfilReference:PerfilSaludComponent;

  constructor(
    private _detallecitaEnfermeria: AtencionService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location,  
  ) { }
      atencion:any = {
        motivo_Coonsulta:null,
        impresion_diagnostica:null,
      };
      sexual:any = {
        menarquia :null, 
        sexarquia :null, 
        fum :null, 
        ciclos :null,             
        abortos :null, 
        partos :null,              
        cesareas :null, 
        citologia :null, 
        planificacion :null, 
        anticonceptivo :null,               
        observaciones :null, 
     
      };
      metabolicos:any = {
        presion :null ,      
        glicemia :null,
        estatura :null,
        peso :null,
        abdomen:null,     
      };

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._detallecitaEnfermeria.getAtencionEnfermeria(this.id).subscribe(data=>{        
        this.atencion = data['objRetornado']['atencion']; 
        this.sexual = data['objRetornado']['sexual']; 
        this.metabolicos = data['objRetornado']['metabolicos']; 
        
        this.perfilReference.show(this.atencion.paciente);
        console.log( 'esta es la atención',this.atencion); 
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

  backClicked() {
    this._location.back();
  }



}
