import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Disciplina } from 'src/app/interfaces/disciplina.interface';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DisciplinasService } from 'src/app/services/disciplina.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-asociar-disciplinas',
  templateUrl: './asociar-disciplinas.component.html',
  styleUrls: ['./asociar-disciplinas.component.css']
})

export class AsociarDisciplinasComponent implements OnInit {
  
  /**
   * Contiene las disciplinas que han sido asignadas a una convocatoria
   */
  listaDisciplinas : Disciplina[] = [];
  
  /**
   * Contiene todas las disciplinas existentes que se pueden usar para asignarlas a las
   * convocatorias
   */
  listaDisciplinasParaAsignar: any [] = [];
  
  /**
   * Se usa para guardar los datos de una disciplina que se va a asignar a una convocatoria
   */
  disciplina : any = {idDisciplina:null};
  
  /**
   * El id de la convocatoria permite listar las disciplinas que tiene asignadas y
   * también se usa para asignar las disciplinas que el usuario requiera.
   *  
   */
  idConvocatoria : number;

  /**
   * Contiene todos los errores que vienen del Backend
   */
  errores:object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;

  constructor(private _disciplinaService: DisciplinasService,private _convocatoriasService: ConvocatoriasArtistasDeportistasService, 
    private spinner: NgxSpinnerService, private elementRef: ElementRef, private route:ActivatedRoute) {
    }

    /**
     * Se obtienen las disciplinas que han sido asignadas a determinada convocatoria.
     * También se obtienen todas las disciplinas existentes para ser asignadas a 
     * las convocatorias.
     * 
     */
    ngOnInit() {
      this.spinner.show();
      this.route.params.subscribe(params=>{
        this.idConvocatoria = params.id;
        this._convocatoriasService.getDisciplinasPorConvocatoria(this.idConvocatoria).subscribe(data => {
          this.listaDisciplinas = data['disciplinas'];
          
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

      this._disciplinaService.getDisciplinas().subscribe(data => {
        this.listaDisciplinasParaAsignar = data['disciplinas'];

      });
    }

  /**
   * Se abre el modal para asignar las disciplinas a la convocatoria seleccionada
   */
  abrirModalAsignarDisciplinas(){
    this.disciplina = {idDisciplina:null}
    $('#asignarDisciplinaModal').modal('show');
  }

  abrirModalEditarDisciplina(disciplina){
    let copy = Object.assign({}, disciplina);
    this.errores = [];
    
    this.disciplina = copy;
  
    $('#asignarDisciplinaModal').modal('show');
  }

  /**
   * Se envía al Backend la disciplina que será asignada en la convocatoria seleccionada
   * 
   * @param formulario Se usa para validar que los campos del formulario no estén vacíos
   */
  asignarDisciplinaAConvocatoria(formulario:NgForm){
     if(!formulario.valid){
      return
     }
    this.spinner.show();
    
    this.disciplina.idConvocatoria = this.idConvocatoria;

    this._convocatoriasService.asignarDisciplinaAConvocatoria(this.disciplina).subscribe(data => {
       
      if(data['success']){

        if(this.disciplina.id == null){
          this.listaDisciplinas.push(data['disciplina']);
        }else{
          for (let index = 0; index < this.listaDisciplinas.length; index++) {
            if (this.listaDisciplinas[index].id == this.disciplina.id) {
              this.listaDisciplinas[index] = data['disciplina'];
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
          $('#asignarDisciplinaModal').modal('hide');
        }, 2000);

      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'Esta disciplina ya ha sido agregada anteriormente'
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
   * Este método sirve para desvincular una disciplina de una convocatoria
   * 
   * @param disciplina Es un objeto que contiene los datos de una disciplina
   * @param index Es el índice de la disciplina seleccionada en la tabla
   */
  eliminarDisciplina(disciplina, index){

    swal({
      title: 'Eliminar disciplina',
      text: "¿Está seguro de eliminar la disciplina?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {

      if (result.value) {
        this._convocatoriasService.eliminarDisciplinaConvocatoria(disciplina.id).subscribe(data => {
          if(data["success"]){
            this.listaDisciplinas.splice(index, 1);
            swal({
              title: "Realizado",
              text: "Acción realizada satisfactoriamente.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
          });
            this.rerender();
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: data['error'],
            });
          }
        });
      }
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
