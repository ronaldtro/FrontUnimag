import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ExcusaService } from 'src/app/services/excusas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
declare var $:any; 
declare var jQuery:any;
@Component({
  selector: 'app-excusas',
  templateUrl: './excusas.component.html',
  styleUrls: ['./excusas.component.css']
})
export class ExcusasComponent implements OnInit {
  errores:object[]=[];
  excusa:any = {};
  excusas:any[] = [];
  beneficioSeleccionado:any = null;
  convocatoriaSelect:any = null;
  convocatorias:any[] = [];
  dateNow: Date;
  soporte?:File;
  fecha_maxima: Date;
  isValid:string="";
  mensaje:string=null;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  constructor(private _excusaService:ExcusaService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) {  
      this.spinner.show();
      this._excusaService.getDatos().subscribe(data => {
        this.excusas = data['excusas'];
        this.convocatorias = data['convocatorias'];
        this.initDtOptions();
        this.dtTrigger.next();
        this.spinner.hide();
      }, err =>{
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide();
      });
  }

  ngOnInit() {
    this.dateNow = new Date();
    this.fecha_maxima = new Date();
    this.fecha_maxima.setDate(this.fecha_maxima.getDate()+7);
  }
  modalAgregarExcusa(){
    this.errores = [];
    this.excusa = {};
    $('#agregarExcusaModal').modal('show');
  }
  validation(control:FormControl){
    if(control.valid==false){
      this.isValid="is-invalid";
    }else{
      this.isValid="";
    }
  }
  agregarExcusa(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this.excusa.convocatoria_id = this.convocatoriaSelect.id;
    this.excusa.beneficio_id = this.beneficioSeleccionado.id;
    this.excusa.fecha_excusa = this.excusa.fecha_excusa.toLocaleDateString();
    this._excusaService.guardarExcusa(this.excusa,this.soporte).subscribe(data => {
      if(data['success'] == true){
        this.excusas.push(data['excusa']);
        formulario.resetForm();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#agregarExcusaModal').modal('hide');
          //this.router.navigate(['/unidades']);
        }, 2000);
      }else{
        if(data['mensaje'] != null){
          this.mensaje = data['mensaje'];
          swal({
            type: 'error',
            title: 'Error',
            text: 'Se han encontrado incidencias. Favor revisar la información.',
          });
        }else{
          this.errores = data['errores'];
          swal({
            type: 'error',
            title: 'Error',
            text: 'No se pudo efectuar la operación. Intente más tarde.',
          });
        }
        
      }
      
    }), err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    };
    this.spinner.hide();
  }
  initDtOptions(){
    this.dtOptions.order = [[ 1, "asc" ],[ 0, "asc" ]];

  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  onUploadFile(event){
    for(let file of event.files) {
      this.soporte=file;
    }
  }

  onClearFile(){
    this.soporte=null;
  }
}
