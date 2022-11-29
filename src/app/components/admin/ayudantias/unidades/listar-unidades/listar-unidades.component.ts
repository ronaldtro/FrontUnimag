import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { UnidadService } from 'src/app/services/unidad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
declare var $:any;
declare var jQuery:any;
@Component({
  selector: 'app-listar-unidades',
  templateUrl: './listar-unidades.component.html',
  styleUrls: ['./listar-unidades.component.css']
})
export class ListarUnidadesComponent implements OnInit, OnDestroy {
  unidades: any[] = [];
  rolesSelect: any[] = [];
  unidadRol:any={};
  prueba:number;
  errores:object[]=[];
  unidad:{id?:number,nombre:string,codigo?:string,estado:boolean};
  unidadEditar:any = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  unidadSelect:any = {};
  codigoSelect?:string;
  unidadesSelect:{id?:string,nombre:string,codigo?:string,email:string}[] = [];
  constructor(private _unidadService:UnidadService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) { 
    this.spinner.show()
    this._unidadService.getListado().subscribe(data => {
      this.unidades = data.unidades;
      this.rolesSelect = data.roles;
      this.dtTrigger.next();
      this.spinner.hide()
    });
    this._unidadService.getUnidades().subscribe(data => {
      this.unidadesSelect = data;
      for (let index = 0; index < this.unidadesSelect.length; index++) {
        this.unidadesSelect[index].codigo = this.unidadesSelect[index].id;
        this.unidadesSelect[index].id = null;
      }
    });
    this.route.params.subscribe(parametros=>{
      
      this.unidad = parametros['unidad'];
      
      /*if(this.id != null){
        this._bolsaPresupuestalService.getBolsa(this.id)
          .subscribe(bolsa=>this.bolsa = bolsa.bolsas)
      }*/
      
    })
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

  cambiarEstado(unidad){
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
        this._unidadService.cambiarEstado(unidad.id).subscribe(data => {
          if(data.json().success){
            for (let index = 0; index < this.unidades.length; index++) {
              if (this.unidades[index].id == unidad.id) {
                this.unidades[index].estado = !this.unidades[index].estado;
              }
            }
            swal({
              title: 'Acción realizada',
              text: 'Acción realizada satisfactoriamente.',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }else{
            this.errores = data.json().errores;
            swal({
              type: 'error',
              title: 'Error',
              text: 'La bolsa presupuestal no se encuentra registrada en la base de datos',
            });
          }
          this.spinner.hide();
        });
      }
    })
  }
  modalCrearUnidad(){
    this.errores = [];
    this.unidadSelect = null;
    $('#crearUnidadModal').modal('show');
  }
  guardarUnidad(formulario:NgForm){
    if(!formulario.valid){
      return;
    }
    this.spinner.show()
    this._unidadService.guardarUnidad(this.unidadSelect).subscribe(data => {
      if(data.json().success){
        this.unidades.push(data.json().unidad);
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        setTimeout(() => {
          $('#crearUnidadModal').modal('hide');
          //this.router.navigate(['/unidades']);
        }, 2000);
      }else{
        this.errores = data.json().errores;
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      this.spinner.hide();
    }), err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()
    };
  }
  modalEditarUnidad(unidad){
    this.errores = [];
    this.unidadEditar = unidad;
    $('#editarUnidadModal').modal('show');
  }
  editarUnidad(formulario:NgForm){
    if(!formulario.valid){
      return;
    }
    this.spinner.show();
    this._unidadService.editarUnidad(this.unidadEditar).subscribe(data => {
      if(data.json().success){
        for (let index = 0; index < this.unidades.length; index++) {
          if (this.unidades[index].id == this.unidadEditar.id) {
            this.unidades[index] = data.json().unidad;
          }
        }
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        setTimeout(() => {
          $('#editarUnidadModal').modal('hide');
          //this.router.navigate(['/unidades']);
        }, 2000);
      }else{
        this.errores = data.json().errores;
         for(let i = 0; i < this.errores.length; i++ ){
         }
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      this.spinner.hide();
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
  }
  agregarRolModal(unidad){

    this.errores = [];
    this.unidadRol = Object.assign({}, unidad);
    console.log(this.unidadRol);
    $('#agregarRolModal').modal('show');
  }
  agregarRol(formulario:NgForm){
    if(!formulario.valid || this.unidadRol.roles.length == 0){
      return
    }
    this.spinner.show();
    this._unidadService.agregarRol(this.unidadRol).subscribe(data => {
      if(data.json().success){
        for (let index = 0; index < this.unidades.length; index++) {
          if (this.unidades[index].id == this.unidadRol.id) {                         
            this.unidades[index].roles = data.json().roles;
            console.log(this.unidades[index]);
          }
        }
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        $('#agregarRolModal').modal('hide');
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
    
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
