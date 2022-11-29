import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { TiposProfesionalesService } from 'src/app/services/tipoProfesional.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
declare var $:any; 
declare var jQuery:any;
@Component({
  selector: 'app-tiposprofesionalessalud',
  templateUrl: './tiposprofesionalessalud.component.html',
  styleUrls: ['./tiposprofesionalessalud.component.css']
})
export class TiposprofesionalessaludComponent implements OnInit,OnDestroy {

  tiposProfesionales: any[] = [];
  errores:object[]=[];
  tipoProfesional:any = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  
  constructor(private _tipoProfesionalService:TiposProfesionalesService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) { 
      this.spinner.show();
    this._tipoProfesionalService.getTiposProfesionales().subscribe(data => {
      this.tiposProfesionales = data['tiposProfesionales'];
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

  modalCrearTipoProfesional(){
    this.errores = [];
    this.tipoProfesional = {};
    $('#crearTipoModal').modal('show');
  }
  guardarTipoProfesional(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._tipoProfesionalService.guardarTipoProfesional(this.tipoProfesional).subscribe(data => {
      if(data['success']){
        if(this.tipoProfesional.id == null){
          this.tiposProfesionales.push(data['tipoProfesional']);
        }else{
          for (let index = 0; index < this.tiposProfesionales.length; index++) {
            if (this.tiposProfesionales[index].id == this.tipoProfesional.id) {
              this.tiposProfesionales[index] = data['tipoProfesional'];
            }
          }
        }
        formulario.resetForm();
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#crearTipoModal').modal('hide');
          //this.router.navigate(['/unidades']);
        }, 2000);
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
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
  modalEditarTipo(tipo){
    let copy = Object.assign({}, tipo);
    this.errores = [];
    this.tipoProfesional = copy;
    $('#crearTipoModal').modal('show');
  }
  cambiarEstado(tipo){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._tipoProfesionalService.cambiarEstado(tipo.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.tiposProfesionales.length; index++) {
              if (this.tiposProfesionales[index].id == tipo.id) {
                this.tiposProfesionales[index].estado = !this.tiposProfesionales[index].estado;
                break;
              }
            }
            this.rerender();
            swal({
              title: 'Acción realizada',
              text: 'Acción realizada satisfactoriamente.',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'El tipo de profesional no se encuentra registrado en la base de datos',
            });
          }
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
    })
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
}
