import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ProfesionalSaludService } from 'src/app/services/profesionalSalud.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { UserService } from 'src/app/services/user.service';
import { DataTableDirective } from 'angular-datatables';
declare var $:any; 
declare var jQuery:any;
@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styleUrls: ['./profesionales.component.css']
})
export class ProfesionalesComponent implements OnInit,OnDestroy {
  errores:object[]=[];
  idProfesional:number = null;
  profesionales:any[] = [];
  profesional:any = {};
  estudiosPro:any[] = [];
  estudioSeleccionado:any = null;
  estudioNuevo:any = {id:null,nivelProfesional_id:null};

  nivelProfesionalSelect:any = null;
  nivelesProfesionales:any[] = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  appliedFilters:any[] = [];
  funciones:FuncionesJSService;
  userService: UserService;

  constructor(private _profesionalSaludService:ProfesionalSaludService,private router:Router,
    private _userService:UserService,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef,
    private funcionesP: FuncionesJSService ) { this.userService = _userService; this.funciones = funcionesP; 
      this.spinner.show();
    this._profesionalSaludService.getDatos().subscribe(data => {
      this.profesionales = data['profesionales'];
      console.log(this.profesionales);
      this.nivelesProfesionales = data['nivelesProfesionales'];
      this.initDtOptions();
      this.dtTrigger.next();
      this.spinner.hide();
    }), err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    };
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
  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }
  modalAgregarEstudio(profesional){
    this.errores = [];
    this.estudiosPro = profesional.estudios;
    this.idProfesional = profesional.id
    $('#agregarEstudioModal').modal('show');
    $("#collapseNuevoEstudio").collapse('hide');
  }
  
  cerrarModalNuevoEstudio(nuevoEstudioForm:NgForm){
    nuevoEstudioForm.resetForm();
    this.errores = [];
    $('#nuevoEstudioModal').modal('hide');
    $('#agregarEstudioModal').modal('show');
    $("#collapseNuevoEstudio").collapse('hide');
  }
  modalNuevoEstudio(estudioForm:NgForm){
    estudioForm.resetForm();
    this.errores = [];
    $('#agregarEstudioModal').modal('hide');
    $('#nuevoEstudioModal').modal('show');
  }
  
  agregarEstudio(formulario:NgForm){
    
    if(!formulario.valid){
      return
    }
    let sw=0;
    for(let i=0;i<this.estudiosPro.length;i++){
      if(this.estudiosPro[i].id == this.estudioSeleccionado.id){
        sw=1;
        break;
      }
    }
    if(sw==0 && this.estudioSeleccionado.id != null){
      this._profesionalSaludService.agregarEstudio(this.idProfesional,this.estudioSeleccionado.id,this.nivelProfesionalSelect.id).subscribe(data => {
        if(data['success']){
          this.estudiosPro.push(this.estudioSeleccionado);
          this.rerender();
          swal({
              title: "Realizado",
              text: "Acción realizada satisfactoriamente.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
          });
          
          setTimeout(() => {
            $("#collapseNuevoEstudio").collapse('hide');
            this.estudioSeleccionado = {};
            this.nivelProfesionalSelect.estudios = [];
            this.nivelProfesionalSelect = {};
            formulario.resetForm();
          }, 2000);
        }else{
          this.errores = data['errores'];
          swal({
            type: 'error',
            title: 'Error',
            text: 'Favor revisar el formulario.',
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
      
    }else{
      swal({
        type: 'error',
        title: 'Error',
        text: 'El estudio ya se encuentra ingresado.',
      });
    }
  }
  nuevoEstudioMetodo(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._profesionalSaludService.nuevoEstudio(this.estudioNuevo).subscribe(data => {
      if(data['success']){
        for(let i=0;i<this.nivelesProfesionales.length;i++){
          if(this.nivelesProfesionales[i].id == this.estudioNuevo.nivelProfesional_id){
            this.nivelesProfesionales[i].estudios.push(data['estudiorealizado']);
            break;
          }
        }
        formulario.resetForm();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#nuevoEstudioModal').modal('hide');
          $('#agregarEstudioModal').modal('show');
          formulario.resetForm();
        }, 2000);
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'Favor revisar el formulario.',
        });
      }
      this.spinner.hide();
    }),err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    };
  }
  eliminarEstudio(estudio_id){
    swal({
      title: 'Eliminar estudio',
      text: "¿Está seguro de eliminar el estudio?",
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
        this._profesionalSaludService.eliminarEstudio(this.idProfesional,estudio_id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.estudiosPro.length; index++) {
              if (this.estudiosPro[index].id == estudio_id) {
                this.estudiosPro.splice(index, 1);
                break;
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
            swal({
              type: 'error',
              title: 'Error',
              text: 'El usuario no se encuentra registrada en la base de datos',
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
  cambiarEstado(profesional){
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
        this._profesionalSaludService.cambiarEstado(profesional.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.profesionales.length; index++) {
              if (this.profesionales[index].id == profesional.id) {
                this.profesionales[index].estado = !this.profesionales[index].estado;
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
    this.dtOptions.order = [[ 4, "asc" ],[ 0, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0,1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0,1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1, 2, 3, 4, 5]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 3, "#filter-sexo"); 
      this.funciones.addFilter(this, 4, "#filter-tipoProfesion");
      this.funciones.addFilter(this, 5, "#filter-estado");  
        
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
