import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';
import { AtencionService } from 'src/app/services/atencion.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-atenciones-no-programadas',
  templateUrl: './atenciones-no-programadas.component.html',
  styleUrls: ['./atenciones-no-programadas.component.css']
})
export class AtencionesNoProgramadasComponent implements OnInit {
  
  @Input() idTipoProfesional: Number;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: any = Object.assign({},DTConfig.dtConf) ;
  dtTrigger: Subject<string> = new Subject();

  dtOptions2: any = Object.assign({},DTConfig.dtConf) ;
  dtTrigger2: Subject<string> = new Subject();


  atencionesNoProgramadas:any[] = [];
  constructor(  private _atencioneService:AtencionService,
                private funciones:FuncionesJSService,
                private location:Location) {

                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                                                      fecha:'2019-08-14',
                                                      hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-07-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-15',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-03-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  this.atencionesNoProgramadas.push({paciente:'ANGELA PATRICIA RODRIGUEZ ARANGO',
                  fecha:'2019-08-14',
                  hora_atencion:'07:10 AM'});
                  
                  

                 }

  ngOnInit() {
    this._atencioneService.getAtencionesNoProgramadas(this.idTipoProfesional).subscribe( resp => { 
      this.initDtOptions();
      this.dtTrigger.next();
    });
  }

  initDtOptions(){ 
      
    this.dtOptions.order = [[ 1, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar'
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0,1,2]
        }
      },
      { 
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1,2]
        }
      }
    ];
     
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => { 
        this.funciones.addFilter(this, 1, "#filter-fecha2"); 
    }; 

  }

  backClicked(){
    this.location.back();
  }

}
