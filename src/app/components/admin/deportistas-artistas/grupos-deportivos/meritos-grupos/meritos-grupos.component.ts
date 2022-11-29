import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { MeritosGruposDeportivosService } from 'src/app/services/meritos-grupos-deportivos.service';

declare var $;
declare var jQuery;

@Component({
  selector: 'app-meritos-grupos',
  templateUrl: './meritos-grupos.component.html',
  styleUrls: ['./meritos-grupos.component.css']
})

export class MeritosGruposComponent implements OnInit, OnDestroy {
  @ViewChild('auto') auto;

  /**
   * Contiene todos los méritos que tiene un grupo o una persona.
   */
  listaMeritos : any[] = [];
  
  /**
   * Contiene los méritos que existe en la base de datos y que se pueden asignar a un grupo o persona.
   */
  listaMeritosParaAsignar : any[] = [];
  
  /** 
   * Contiene los datos de un mérito seleccionado.
   */
  merito : any = {};

  idGrupo : number = 0;
  idPersonaGrupo : number = 0;

  errores:object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private _meritosService: MeritosGruposDeportivosService,private router:Router,private route:ActivatedRoute, 
    private spinner: NgxSpinnerService, private elementRef: ElementRef) {
    }
  
  /**
   * Obtiene los méritos de un grupo o una persona.
   */
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      
      if(params.tipoMerito == 0){

        this.idGrupo = params.id;
        this._meritosService.getMeritos(this.idGrupo).subscribe(data => {
          this.listaMeritos = data['meritos'];
          this.listaMeritosParaAsignar = data['meritosParaAsignar'];
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

    }else{
      this.idPersonaGrupo = params.id;
      this._meritosService.getMeritosPersona(this.idPersonaGrupo).subscribe(data => {
        
        this.listaMeritos = data['meritos'];
        this.listaMeritosParaAsignar = data['meritosParaAsignar'];
        
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
    });
  }

  /**
   * Abre modal para crear un mérito.
   */
  modalCrearMerito(){
    this.errores = [];
    this.merito = {};
    $('#crearMeritoModal').modal('show');
  }

  /**
   * Envía los datos de un mérito para guardarlos en la base de datos.
   * 
   * @param formulario 
   */
  guardarMerito(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();

    if(typeof this.merito.nombre != 'string'){
      let nombre = this.merito.nombre.nombre;
      let id = this.merito.nombre.id;
      delete this.merito.nombre;
      
      this.merito.nombre = nombre;
      this.merito.idMerito = id;
    }

    if(this.idGrupo != 0){
      this.merito.idGrupo = this.idGrupo;
    }
    
    if(this.idPersonaGrupo != 0){
      this.merito.idPersonaGrupo = this.idPersonaGrupo;
    }
    
    this._meritosService.guardarMerito(this.merito).subscribe(data => {
      if(data['success']){
        if(this.merito.id == null){
          this.listaMeritos.push(data['merito']);
        }else{
          for (let index = 0; index < this.listaMeritos.length; index++) {
            if (this.listaMeritos[index].id == this.merito.id) {
              this.listaMeritos[index] = data['merito'];
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
          $('#crearMeritoModal').modal('hide');
        }, 2000);

      }else{
        this.errores = data['errores'];
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
      this.spinner.hide();
    };
  }

  /**
   * Habilita o inhabilita el mérito que se haya seleccionado.
   * 
   * @param merito Contiene los datos de un merito.
   */
  cambiarEstado(merito){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        
        this._meritosService.cambiarEstado(merito).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.listaMeritos.length; index++) {
              if (this.listaMeritos[index].idMerito == merito.idMerito) {
                this.listaMeritos[index].estado = !this.listaMeritos[index].estado;
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
              text: 'El merito no se encuentra registrada en la base de datos',
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
    this.dtOptions.order = [[ 0, "asc" ]];
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }
}
