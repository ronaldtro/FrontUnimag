import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy } from '@angular/core';
import { ConvocatoriaRefrigerioService } from '../../../../../services/convocatoria-refrigerio.service';
import { Api } from '../../../../../class/api';
declare var $:any;
import { Subject } from 'rxjs/Subject';
import { DTConfig } from '../../../../../class/dtconfig';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ConvocatoriaRefrigerio } from 'src/app/interfaces/convocatoria-refrigerio.interface';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import {MessageService} from 'primeng/components/common/messageservice';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import {saveAs as importedSaveAs} from "file-saver";
import { Message } from 'primeng/components/common/api';

declare var jQuery:any;


@Component({
  selector: 'app-listar-convocatorias-refrigerios',
  templateUrl: './listar-convocatorias-refrigerios.component.html',
  styleUrls: ['./listar-convocatorias-refrigerios.component.css'],
  providers: [MessageService]
})
export class ListarConvocatoriasRefrigeriosComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  convocatorias:any[]=[];
  errores:Message[]=[];
  api:string = Api.dev;
  urlDoc: string;
  estados:Objeto[];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  userService: UserService;
  constructor(private _convocatoriaService:ConvocatoriaRefrigerioService, 
              private router:Router, private spinner: NgxSpinnerService, 
              private messageService: MessageService, 
              private _userService:UserService, private elementRef: ElementRef, private funciones: FuncionesJSService) { this.userService = _userService }
  
  ngOnInit() {
    this.spinner.show();
    this._convocatoriaService.listConvocatorias().subscribe(data=>{
      this.convocatorias=data['convocatorias'];
      this.estados=data['estados'];
      this.initDtOptions();
      this.dtTrigger.next();
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()
    });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      }
    ];
  }

  viewDoc( doc:string ){
    this.urlDoc = doc;
    $('#modelId').modal('show');
  }

  updateConvocatoria(convocatoria: ConvocatoriaRefrigerio){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
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
        convocatoria.estado=!convocatoria.estado;
        this.spinner.show();
        this._convocatoriaService.actualizarEstado(convocatoria.id, convocatoria.estado).subscribe(data=>{         
          this.rerender();
          if(data['success']){
            swal(
              'Estado modificado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
          }
          this.spinner.hide();
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  getlista(convocatoria:any){
    this.spinner.show();
    this._convocatoriaService.geDatosEst(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Estudiantes postulados " + convocatoria.titulo); this.spinner.hide(); });
  }

}
