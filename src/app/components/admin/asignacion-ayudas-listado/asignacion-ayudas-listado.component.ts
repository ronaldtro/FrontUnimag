import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked, ViewChildren, QueryList } from '@angular/core';
import { CondicionService } from 'src/app/services/condicion.service';
import { DatosEstudiante } from 'src/app/class/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignacion-ayudas-listado',
  templateUrl: './asignacion-ayudas-listado.component.html',
  styleUrls: ['./asignacion-ayudas-listado.component.css']
})
export class AsignacionAyudasListadoComponent implements OnInit, OnDestroy, AfterViewChecked {

  estudiantes:any[];
  solicitudesAprobadas:any[];
  estudianteSeleccionado:any;

  // @ViewChild(DataTableDirective)
  // dtElement: DataTableDirective;

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<any>;

  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  dtOptionsAprobadas: any = Object.assign({}, DTConfig.dtConf);
  dtTrigger: Subject<string> = new Subject();
  dtTriggerAprobadas: Subject<string> = new Subject();
  funciones:FuncionesJSService;

  appliedFilters:any[] = [];
  componente:any;

  constructor(private condicionesService:CondicionService, private spinner: NgxSpinnerService, private _funciones: FuncionesJSService, private _userService: UserService,private router : Router) { 
    this.estudiantes = [];
    this.solicitudesAprobadas = [];
    this.funciones = _funciones;
    this.componente = this;
  }

  ngOnInit() {
    this.router.navigate(['/listadoSolicitudAyudas/listado-pendientes']);
    //this.router.navigate(['/listadoSolicitudAyudas/listado-aprobadas']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewChecked(): void {
  }



 

}
