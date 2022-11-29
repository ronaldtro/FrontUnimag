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
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit, OnDestroy {

  /**
   * Contiene todos los grupos creados.
   */
  listaGrupos : any[] = [];

  /**
   * Contiene todos los periodos existentes en la base de datos.
   */
  listaPeriodosGrupos : any[] = [];

  /**
   * Contiene los datos de un grupo seleccionado.
   */
  grupo : any = {idDisciplina:null,
                 idNivelFormativo:null};

  errores:object[]=[];

  appliedFilters:any[] = [];

  funciones:FuncionesJSService; 

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private _gruposService: GruposDeportivosService, 
    private funcionesP:FuncionesJSService,
    private router:Router, 
    private route:ActivatedRoute, 
    private spinner: NgxSpinnerService, 
    private elementRef: ElementRef) {
      this.funciones = funcionesP;
    }
  
  /**
   * Obtiene todos los grupos y periodos que han sido creados.
   * 
   */
  ngOnInit() {
    this.spinner.show();
    
      this._gruposService.getGrupos().subscribe(data => {
              
        this.listaGrupos = data['grupos'];
        this.listaPeriodosGrupos = data['periodosGrupos'];
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
  
  /**
   * Redirige al componente que mostrará los estudiantes inscritos en un grupo y periodo específico.
   */
  verEstudiantesPostulados(){
    $('#modalPeriodosGrupos').modal('hide');
    this.router.navigate(['/estudiantes-postulados', this.grupo.idPeriodo, this.grupo.id]);
  }

  /**
   * Abre modal para seleccionar el periodo de grupo y poder ver los estudiantes inscritos 
   * en el mismo.
   * 
   * @param grupo Contiene los datos del grupo seleccionado en la tabla.
   */
  modalSeleccionarPeriodo(grupo){
    let copy = Object.assign({}, grupo);
    this.grupo = {idPeriodo : null}
    this.grupo.id = copy.id;
    $('#modalPeriodosGrupos').modal('show');
  }

  /**
   * Habilita o inhabilita un grupo.
   * 
   * @param grupo Contiene los datos de un grupo seleccionado de la tabla.
   */
  cambiarEstado(grupo){
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
        this._gruposService.cambiarEstado(grupo.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.listaGrupos.length; index++) {
              if (this.listaGrupos[index].id == grupo.id) {
                this.listaGrupos[index].estado = !this.listaGrupos[index].estado;
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
              text: 'El grupo no se encuentra registrado en la base de datos',
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
      this.funciones.addFilter(this, 1, "#filter-nivel-formativo");      
      this.funciones.addFilter(this, 2, "#filter-disciplina");      
      this.funciones.addFilter(this, 3, "#filter-estado");      
    }
  }
  
  rerender(): void {
    if(this.dtElement){
      if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
      }
    }
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
