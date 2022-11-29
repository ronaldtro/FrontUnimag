import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'src/app/class/api';
import { Router, ActivatedRoute } from '@angular/router';
import { CondicionService } from 'src/app/services/condicion.service';
import { Condicion } from 'src/app/interfaces/condicion.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-listar-condiciones',
  templateUrl: './listar-condiciones.component.html',
  styles: []
})
export class ListarCondicionesComponent implements OnInit, OnDestroy, AfterViewInit {

  condiciones: Condicion[] = [];
  errores:object[]=[];
  condicion: Condicion = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = DTConfig.dtConf;
  api:string = Api.dev;
  index:any;
  
  constructor(private _condicionService:CondicionService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) { 
    
  }

  ngOnInit() {
    this.spinner.show();
    this._condicionService.getDatos().subscribe(data => {
      this.condiciones = data['condiciones'];
      this.dtTrigger.next();
      this.spinner.hide();
    });
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

  modalCrearCondicion(){
    this.errores = [];
    this.condicion = {};
    $('#crearCondicionModal').modal('show');
  }

  guardarCondicion(formulario:NgForm){
    if(!formulario.valid || this.condicion.nombre == ''){
      return
    }
    this.spinner.show();
    this._condicionService.guardarCondicion(this.condicion).subscribe(data => {
      if(data.json().success){
        if(this.condicion.id == null){
          this.condiciones.push(data.json().objRetornado);
          this.rerender();
        }else{
          
          this.condiciones[this.index] = data.json().objRetornado;
          this.rerender();
        }
        
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#crearCondicionModal').modal('hide');
          //this.router.navigate(['/unidades']);
        }, 2000);
        this.spinner.hide();
      }else{
        this.errores = data.json().errores;
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        this.spinner.hide();
      }
      
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
  }

  modalEditarCondicion(condicion){
    let copy = Object.assign({}, condicion);
    this.index = this.condiciones.indexOf(condicion);
    this.errores = [];
    this.condicion = copy;
    $('#crearCondicionModal').modal('show');
  }

  cambiarEstado(condicion){
    this.index = this.condiciones.indexOf(condicion);
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
        this._condicionService.cambiarEstado(condicion.id).subscribe(data => {
          if(data.json().success){
          this.condiciones[this.index].estado = !this.condiciones[this.index].estado;
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
              text: 'La condicion no se encuentra registrada en la base de datos.',
            });
          }
          this.spinner.hide();
        });
      }
    })
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
