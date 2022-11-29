
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { DisciplinasService } from 'src/app/services/disciplina.service';
import { Disciplina } from 'src/app/interfaces/disciplina.interface';
import { Modalidad } from 'src/app/interfaces/modalidad.interface';
import { DatePipe } from '@angular/common';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-disciplina',
  templateUrl: './disciplina.component.html',
  styleUrls: ['./disciplina.component.css'],
  providers: [obtenerFechaPipe, DatePipe]
})

export class DisciplinaComponent implements OnInit,OnDestroy {
  
  /**
   * Contiene todas las disciplinas existentes en la base de datos.
   */
  disciplinas: Disciplina[] = [];

  tiposIdentificacion : any[] = [];

  encargado : any = {tipoIdentificacion:null,
    sexo:true};
  
  appliedFilters:any[] = [];

  funciones:FuncionesJSService; 

  es : any;

  mostrar:boolean;

  /**
   * Se usa para guardar los datos que se ingresan en la vista de creación 
   * y edición de disciplinas
   */
  disciplina: any = {
     nombre:null,
     modalidad_id:null,
     encargado : {}
     };
     
  /**
   * Se guardan todas las modalidades que vienen del Backend
   */
  modalidades: Modalidad[] = [];
  
  camposPersonaDeshabilitados : boolean = true;
  camposEncargadoDeshabilitados : boolean = true;

  /**
   * Se guarda la información de los errores
   */
  errores:object[]=[];
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;

  constructor(private funcionesP:FuncionesJSService,
    private datePipe : DatePipe,
    private pipe: obtenerFechaPipe,
    private _disciplinaService: DisciplinasService, 
    private router:Router,
    private route:ActivatedRoute, 
    private spinner: NgxSpinnerService, 
    private elementRef: ElementRef) {
      this.funciones = funcionesP; 
    }

  /**
   * Se cargan todas las disciplinas y modalidades que han sido creadas anteriormente
   */
  ngOnInit() {
    this.spinner.show();

    this._disciplinaService.getDisciplinas().subscribe(data => {
      
      this.disciplinas = data['disciplinas'];

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

    this._disciplinaService.getModalidades().subscribe(data => {
      this.modalidades = data['modalidades'];
    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });
    
    this._disciplinaService.getTiposIdentificacion().subscribe(data => {
      this.tiposIdentificacion = data['tiposIdentificacion'];
    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
      dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  /**
   * Se abre el modal para crear la disciplina 
   */
  modalCrearDisciplina(){
    this.errores = [];
    this.disciplina = {nombre:null,modalidad_id:null,
      encargado:{tipoIdentificacion : null}}

    $('#crearDisciplinaModal').modal('show');
  }

  modalAsignarEncargado(disciplina : any){
    this.errores = [];
    this.camposPersonaDeshabilitados = true;
    
    this.encargado = {tipoIdentificacion:null,
      sexo:true};
    this.disciplina = disciplina;

    if(this.disciplina.encargado != null){
      let fechaNacimiento = this.disciplina.encargado.fecha_nacimiento;
      fechaNacimiento = this.pipe.transform(fechaNacimiento);
      this.disciplina.encargado.fecha_nacimiento = this.datePipe.transform(fechaNacimiento,"dd/MM/yyyy");
      this.encargado = this.disciplina.encargado;
    }

    $('#agregarEncargadoModal').modal('show');
  }


 /**
   * Se abre el modal para editar la disciplina 
   * 
   * @param disciplina es el objeto que contiene los datos de la disciplina que se va a
   * editar
   */
  modalEditarDisciplina(disciplina){
    
    let copy = Object.assign({}, disciplina);
    this.errores = [];
    
    this.disciplina = copy;
    $('#crearDisciplinaModal').modal('show');
  }

  buscarEncargado(e){
    e.stopPropagation();
    this._disciplinaService.buscarEncargado(this.encargado.identificacion).subscribe(data=>{
      if(data['success']){
        this.camposEncargadoDeshabilitados = true;
        this.camposPersonaDeshabilitados = true;
        this.encargado.nombre = data["datosEncargado"].nombre;
        this.encargado.sexo = data["datosEncargado"].sexo;
        this.encargado.direccion = data["datosEncargado"].direccion;
        this.encargado.email = data["datosEncargado"].email;
        this.encargado.celular = data["datosEncargado"].celular;
        this.encargado.fecha_nacimiento = this.pipe.transform(data["datosEncargado"].fecha_nacimiento);
        this.encargado.fecha_nacimiento = this.datePipe.transform(this.encargado.fecha_nacimiento,"dd/MM/yyyy");
      
        if(data["datosEncargado"].email == null || data["datosEncargado"].celular == null){
          this.camposEncargadoDeshabilitados = false;
        }

      }else{
        this.camposPersonaDeshabilitados = false;
        this.camposEncargadoDeshabilitados = false;
        this.encargado.nombre = "";
        this.encargado.sexo = true;
        this.encargado.direccion = "";
        this.encargado.fecha_nacimiento = "";
        this.encargado.email = "";
        this.encargado.celular = "";
      }
    });
    return false;
  }

 /**
   * Se guarda la disciplina, se llama el método 'guardarDisciplina()' del servicio 
   * 'DisciplinasService' al cual se le envía por parametro el objeto que contiene 
   * los datos de la disciplina que se va a guardar. 
   * 
   * 
   * @param {NgForm} formulario se usa para validar si los campos del formulario han sido
   * diligenciados
   * 
   */
  guardarDisciplina(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();

    this._disciplinaService.guardarDisciplina(this.disciplina).subscribe(data => {
      
      if(data['success']){
        if(this.disciplina.id == null){
          
          this.disciplinas.push(data['disciplina']);
          
        }else{
          for (let index = 0; index < this.disciplinas.length; index++) {
            if (this.disciplinas[index].id == this.disciplina.id) {
              this.disciplinas[index] = data['disciplina'];
            }
          }
        }
        this.spinner.hide();
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
          $('#crearDisciplinaModal').modal('hide');
       
        }, 2000);
      }else{
        this.spinner.hide();
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }), err =>{
      this.spinner.hide();
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    };
  }
 
  /**
   * Se usa para habilitar o deshabilitar una disciplina 
   * 
   * @param disciplina es el objeto que contiene los datos de la disciplina
   */
  cambiarEstado(disciplina){
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
        this.spinner.show()
        this._disciplinaService.cambiarEstado(disciplina.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.disciplinas.length; index++) {
              if (this.disciplinas[index].id == disciplina.id) {
                this.disciplinas[index].estado = !this.disciplinas[index].estado;
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
              text: 'La disciplina no se encuentra registrada en la base de datos',
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
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 1, "#filter-modalidad");      
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  clearModal(){

  }

  agregarEncargado(form:NgForm){

  }

}