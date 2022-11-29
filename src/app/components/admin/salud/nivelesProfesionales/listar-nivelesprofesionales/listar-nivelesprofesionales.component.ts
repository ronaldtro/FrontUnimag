import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { NivelesProfesionalesService } from 'src/app/services/nivelesProfesionales.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NivelProfesional } from 'src/app/interfaces/nivelProfesional.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-nivelesprofesionales',
  templateUrl: './listar-nivelesprofesionales.component.html',
  styleUrls: ['./listar-nivelesprofesionales.component.css']
})
export class ListarNivelesprofesionalesComponent implements OnInit,OnDestroy {

  nivelesProfesionales: NivelProfesional[] = [];
  errores:object[]=[];
  nivel:NivelProfesional = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  
  
  constructor(private _nivelProfesionalService:NivelesProfesionalesService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) { 
      this.spinner.show();
    this._nivelProfesionalService.getNiveles().subscribe(data => {
      this.nivelesProfesionales = data['nivelesProfesionales'];
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

  modalCrearNivelProfesional(){
    this.errores = [];
    this.nivel = {};
    $('#crearNivelModal').modal('show');
  }
  guardarNivelProfesional(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._nivelProfesionalService.guardarNivel(this.nivel).subscribe(data => {
      if(data['success']){
        if(this.nivel.id == null){
          this.nivelesProfesionales.push(data['nivel']);
        }else{
          for (let index = 0; index < this.nivelesProfesionales.length; index++) {
            if (this.nivelesProfesionales[index].id == this.nivel.id) {
              this.nivelesProfesionales[index] = data['nivel'];
              break;
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
          $('#crearNivelModal').modal('hide');
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
  modalEditarNivel(nivel){
    let copy = Object.assign({}, nivel);
    this.errores = [];
    this.nivel = copy;
    $('#crearNivelModal').modal('show');
  }
  cambiarEstado(nivel){
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
        this._nivelProfesionalService.cambiarEstado(nivel.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.nivelesProfesionales.length; index++) {
              if (this.nivelesProfesionales[index].id == nivel.id) {
                this.nivelesProfesionales[index].estado = !this.nivelesProfesionales[index].estado;
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
              text: 'El nivel profesional no se encuentra registrado en la base de datos',
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
