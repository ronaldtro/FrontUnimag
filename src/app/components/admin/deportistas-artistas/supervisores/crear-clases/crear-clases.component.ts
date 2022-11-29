import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common'
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgForm, FormControl } from '@angular/forms';
import { ClasesArtistasDeportistasService } from 'src/app/services/clases-artistas-deportistas.service';
import { DisciplinasService } from 'src/app/services/disciplina.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-crear-clases',
  templateUrl: './crear-clases.component.html',
  styleUrls: ['./crear-clases.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})

export class CrearClasesComponent implements OnInit, OnDestroy {

  /**
   * Contiene las clases que el supervisor ha creado
   */
  listaClases : any [] = [];

  listaDisciplinas : any [] = [];

  listaGrupos : any[] = [];

  userService : UserService;

  /**
   * Contiene los datos de una clase que se va a crear o editar
   */
  clase : any = {idGrupo:null};

  idSupervisor : number;

  dateNow: Date;

  errores : any [];

  isValid:string="";
  es : any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  
  constructor(private datepipe: DatePipe, private _userService:UserService,private _disciplinasService : DisciplinasService, private _clasesService: ClasesArtistasDeportistasService,
    private spinner: NgxSpinnerService, private elementRef: ElementRef,  private route:ActivatedRoute) {
      this.userService = _userService;
     }
  
  /**
   * Se cargan todas las clases que el supervisor ha creado
   */
  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();

    this._disciplinasService.getDisciplinas().subscribe(data => {
      this.listaDisciplinas = data['disciplinas'];
    });

    this._clasesService.getGrupos().subscribe(data => {
      this.listaGrupos = data['grupos'];
 
    });

    this.route.params.subscribe(params=>{
    
    if(!params.id){
      this.idSupervisor = 0;
    }else{
      this.idSupervisor = params.id;
    }
    
    this._clasesService.getClases(this.idSupervisor).subscribe(data => {
     
      this.listaClases = data['clases'];

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
   * Permite al supervisor guardar una clase 
   * 
   * @param formulario 
   */
  guardarClase(formulario:NgForm){
    // if(!formulario.valid){
    //   return
    // }

    this.clase.idSupervisor = this.idSupervisor;

    this.spinner.show();

    this._clasesService.guardarClase(this.clase).subscribe(data => {
      
      if(data['success']){
        if(this.clase.id == null){
          data['clase'].fecha = data['fecha'];
          this.listaClases.push(data['clase']);

        }else{
          for (let index = 0; index < this.listaClases.length; index++) {
            if (this.listaClases[index].id == this.clase.id) {
              data['clase'].fecha = data['fecha'];
              this.listaClases[index] = data['clase'];
            }
          }
        }
        this.rerender();
        formulario.resetForm();
        
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#crearClaseModal').modal('hide');
       
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

  
  /**
   * Se habilita o deshabilita una clase
   * 
   * @param clase Contiene los datos de una clase
   */
  cambiarEstado(clase){
    
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
        this._clasesService.cambiarEstado(clase.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.listaClases.length; index++) {
              if (this.listaClases[index].id == clase.id) {
                this.listaClases[index].estado = !this.listaClases[index].estado;
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
              text: 'La clase no se encuentra registrada en la base de datos',
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

  /**
   * Se abre el modal para crear la clase 
   */
  modalCrearClase(){
    this.errores = [];
    this.clase = {idGrupo : null}
    $('#crearClaseModal').modal('show');
  }

  modalEditarClase(clase:any){
    this.errores = [];

    let copy = Object.assign({}, clase);
    this.clase = copy;
    this.clase.fecha = this.datepipe.transform(this.clase.fecha, 'dd/MM/yyyy hh:mm a');
 
    $('#crearClaseModal').modal('show');
  }

  validation(control:FormControl){
    if(control.valid==false){
      this.isValid="is-invalid";
    }else{
      this.isValid="";
    }
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