import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { EstudiosRealizadosService } from 'src/app/services/estudiosRealizados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NivelProfesional } from 'src/app/interfaces/nivelProfesional.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { UserService } from 'src/app/services/user.service';
declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-estudiosrealizados',
  templateUrl: './listar-estudiosrealizados.component.html',
  styleUrls: ['./listar-estudiosrealizados.component.css']
})
export class ListarEstudiosrealizadosComponent implements OnInit ,OnDestroy {

  estudios: any[] = [];
  nivelesProfesionales: NivelProfesional[] = [];
  errores:object[]=[];
  estudio:any = {};
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  appliedFilters:any[] = [];
  funciones:FuncionesJSService;
  userService: UserService;
  
  constructor(private _estudioService:EstudiosRealizadosService,private router:Router,
    private _userService:UserService,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef,
    private funcionesP: FuncionesJSService ) { this.userService = _userService; this.funciones = funcionesP; 
      this.spinner.show();
    this._estudioService.getEstudios().subscribe(data => {
      this.estudios = data['estudiosrealizados'];
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

  modalCrearEstudio(){
    this.errores = [];
    this.estudio = {
      nivelProfesional_id:null
    };
    $('#crearEstudioModal').modal('show');
  }
  guardarEstudio(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._estudioService.guardarEstudio(this.estudio).subscribe(data => {
      if(data['success']){
        if(this.estudio.id == null){
          this.estudios.push(data['estudiorealizado']);
        }else{
          for (let index = 0; index < this.estudios.length; index++) {
            if (this.estudios[index].id == this.estudio.id) {
              this.estudios[index] = data['estudiorealizado'];
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
          $('#crearEstudioModal').modal('hide');
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
      this.spinner.hide();
    };
    this.spinner.hide();
  }
  modalEditarEstudio(estudio){
    let copy = Object.assign({}, estudio);
    this.errores = [];
    this.estudio = copy;
    $('#crearEstudioModal').modal('show');
  }
  cambiarEstado(estudio){
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
        this._estudioService.cambiarEstado(estudio.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.estudios.length; index++) {
              if (this.estudios[index].id == estudio.id) {
                this.estudios[index].estado = !this.estudios[index].estado;
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
              text: 'El estudio no se encuentra registrado en la base de datos',
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
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 1, "#filter-nivelProfesional");
      this.funciones.addFilter(this, 2, "#filter-estado");  
        
    }

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
