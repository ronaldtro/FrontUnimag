import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PlazaService } from 'src/app/services/plaza.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { DataTableDirective } from 'angular-datatables';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { ActivatedRoute } from '@angular/router';
import {saveAs as importedSaveAs} from "file-saver";
import { Convocatoria } from 'src/app/class/api';

declare var $:any;
declare var Tutorial:any;

@Component({
  selector: 'app-plazas-aprobadas',
  templateUrl: './plazas-aprobadas.component.html',
  styleUrls: ['./plazas-aprobadas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[MessageService]
})
export class PlazasAprobadasComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  id:any = null;
  
  agregarEstudiante:any={
    id_plaza:null,
    codigo:null,
    solicitante:null,
    observacion:null,
    soporte:null,
    propuesta_metodologica:null,
    validacion:null
  }
  convocatoria:Convocatoria;
  plazasAprobadas:any[] = [];

  //datos de filtro
  convocatorias:any[] = [];
  tiposAyudantia:any[] = [];
  plazas:any[] = [];
  unidades:any[] = [];
  estados:any[] = [];

  //Filtros aplicados
  appliedFilters:any[] = [];

  tutorial:any = null;

  solicitudPlaza:any = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  errores:Message[]=[];
  cantTotalPostulados:number = 0;
  userService:UserService;
  funciones:FuncionesJSService;
  tipoConvocatoria:number;

  constructor(private _plazaService:PlazaService, private messageService: MessageService, private _userService:UserService, private spinner: NgxSpinnerService,
    private funcionesP: FuncionesJSService ,   private route:ActivatedRoute,
    private cdr: ChangeDetectorRef ) { 
      this.userService = _userService; 
      this.funciones = funcionesP; 
      this.convocatoria = new Convocatoria();
    }

  ngOnInit() {
    this.spinner.show();

    this.route.params.subscribe(parametros =>{
      this.id = parametros['id'];
      this.tipoConvocatoria = parametros['tipoConvocatoria'];
      this._plazaService.getPlazasAprobadas(this.id, this.tipoConvocatoria).subscribe(data => {
      if(data['plazaAprobada'] != null) this.plazasAprobadas = [...data['plazaAprobada']];
      if(data['convocatoria'] != null) this.convocatoria = Object.assign(this.convocatoria, data['convocatoria']);
      if(data['error']){
        swal({
          type: 'error',
          title: 'Error',
          text: "La convocatoria indicada no existe",
        });
      }

      //datos de filtro
      //this.convocatorias = data['convocatorias'];
      //this.tiposAyudantia = data['tiposAyudantia'];
      //this.plazas = data['plazas'];
      //this.unidades = data['unidades'];
      //this.estados = data['estados'];

      for(let i = 0; i < this.plazasAprobadas.length; i++){
        this.cantTotalPostulados += this.plazasAprobadas[i].cantidadPostulados;
        //this.plazasAprobadas[i].tipoPlazaNombre = this.sentenceCase(this.plazasAprobadas[i].tipoPlazaNombre.toLowerCase());
        //this.plazasAprobadas[i].perfil = this.sentenceCase(this.plazasAprobadas[i].perfil.toLowerCase());
        //this.plazasAprobadas[i].competenciasRequeridas = this.plazasAprobadas[i].competenciasRequeridas != null ? this.sentenceCase(this.plazasAprobadas[i].competenciasRequeridas.toLowerCase()) : '';
      }
      this.initDtOptions();
      this.dtTrigger.next();

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        if(this.convocatoria.id != null){
          dtInstance.column(0).visible(false);
        }
        if(!this._userService.roleMatch(['Admin', 'AdminMonitorias', 'ComiteMonitorias'])){
          dtInstance.column(1).visible(false);
        }
        if(!this._userService.roleMatch(['Unidad', 'UnidadMonitorias'])){
          dtInstance.column(3).visible(false);
        }
        // if(!this._userService.roleMatch(['Admin']) && !this._userService.roleMatch(['Unidad'])){
        //   dtInstance.column(5).visible(false);
        // }
        dtInstance.column(5).visible(false);
        dtInstance.column(7).visible(false);
        dtInstance.column(8).visible(false);
        dtInstance.column(9).visible(false);
      }); 

      this.spinner.hide();
      this.cdr.detectChanges();
    }, err => {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
      this.cdr.detectChanges();
    });
    });

    
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
    $('[data-toggle="tooltip"]').tooltip();
  }

  initDtOptions(){
    // if(this._userService.roleMatch(['Admin'])){
    //   this.dtOptions.order = [[ 6, "asc" ]];
    // }else{
    //   this.dtOptions.order =  [[ 5, "asc" ], [ 4, "desc" ]];
    // }
      this.dtOptions.order =  [[ 10, "asc" ], [ 6, "desc" ], [ 11, "desc"]];
    this.dtOptions.dom = "Bfrtip";
    // this.dtOptions.retrieve = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      }
    ];
    //Filtros personalizados
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
        //let idx = 0;
        this.funciones.addFilter(this, 0, "#filter-convocatoria");
        this.funciones.addFilter(this, 1, "#filter-solicitante");
        this.funciones.addFilter(this, 2, "#filter-plaza");
        this.funciones.addFilter(this, 3, "#filter-tipoPlaza");
        this.funciones.addFilter(this, 10, "#filter-estado");
        
    }
  }

  sentenceCase(input) {
    input = ( input === undefined || input === null ) ? '' : input;
    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
    return match.toUpperCase();
    });
   }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();

    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.agregarEstudiante.soporte=file;
    }
    this.cdr.detectChanges();
  }

  onClearFile(){
    this.agregarEstudiante.soporte=null;
    this.cdr.detectChanges();
  }

  onUploadFileFormato(event){
    for(let file of event.files) {
      this.agregarEstudiante.propuesta_metodologica=file;
    }
    this.cdr.detectChanges();
  }

  onClearFileFormato(){
    this.agregarEstudiante.propuesta_metodologica=null;
    this.cdr.detectChanges();
  }

  openModal(id:number){
    
    this.agregarEstudiante.id_plaza=id;
    this.agregarEstudiante.estado_convocatoria_estudiante_id= 1;
    console.log ("Soporte: ",this.agregarEstudiante.soporte);
    this.agregarEstudiante.soporte="null";
    $('#modalEstudiante').modal({backdrop: "static"});
    this.cdr.detectChanges();
  }

  postular(form:NgForm){
    
    if(!form.valid){
      return;
    }

    if(this.agregarEstudiante.propuesta_metodologica == null && this.tipoConvocatoria == 3){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe subir un archivo PDF con la propuesta metodológica',
      });
      this.cdr.detectChanges();
      return;
    }

    this.spinner.show();

    let formData = new FormData();
      formData.append('plaza_id', this.agregarEstudiante.id_plaza);
      formData.append('codigo', ""+this.agregarEstudiante.codigo)
      formData.append('solicitante',""+this.agregarEstudiante.solicitante);
      formData.append('observacion',""+this.agregarEstudiante.observacion);
      formData.append('soporte',this.agregarEstudiante.soporte);
      formData.append('propuesta_metodologica',this.agregarEstudiante.propuesta_metodologica);
      formData.append('validacion',this.agregarEstudiante.validacion);
      formData.append('estado_convocatoria_estudiante_id',this.agregarEstudiante.estado_convocatoria_estudiante_id);

    this._plazaService.estudianteConvocatoria(formData).subscribe(data=>{
      if(data['success']){
        this.resetForm(form);
        $('#modalEstudiante').modal('hide');

        swal({
          type: 'success',
          title: 'OK',
          text: 'Se inscribió correctamente el estudiante',
        });
        
      }else{
        for(let i=0; i<data['errores'].length; i++){
          if(data['errores'][i].errores.length>0){
            swal({
              type: 'warning',
              title: 'Alerta',
              text: data['errores'][i].errores[0]['ErrorMessage'],
            });
          }
        }
      }
      this.spinner.hide();  
      this.cdr.detectChanges();
    }, err =>{

      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      }); 
      this.cdr.detectChanges();
    })
  }


  obtenerPropuestas(solicitud:any){
    this.spinner.show();
    this._plazaService.getPropuestasPlaza(solicitud.id).subscribe( blob=>{ importedSaveAs ( blob, "Propuestas Metodológicas plaza " + solicitud.tipoPlazaNombre); this.spinner.hide(); });
  }

  resetForm(form:NgForm){
    $('#modalEstudiante').modal('hide');
    form.resetForm();
    //soporte.clear();
  }

  limpiar(soporte){
    soporte.resetForm();
  }

  rerender(): void {
    if(this.dtElement){
      if(this.dtElement.dtInstance){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.initDtOptions();
          this.dtTrigger.next();
          
        });
      }
      
    }
    this.cdr.detectChanges();
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de plazas revisadas por Bienestar</p><p class="container">El sistema permite visualizar las plazas solicitadas que han sido revisadas por Bienestar. A continuación, podrá conocer los elementos que contiene este módulo y las diferentes acciones y funcionalidades a las cuales puede acceder.</p>'},
        elements:[
          {id:'#btn-filtros',text:'El botón "<span class="fa fa-filter"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podrá realizar una búsqueda entre los registros listados en la tabla.'},
          {id: '#table_plazasRevisadas', text: 'Esta tabla muestra todas las solicitudes de plazas que han sido revisadas por Bienestar. Desde la columna "Acciones" puede acceder a las diferentes opciones para cada registro de la tabla tales como visualizar el detalle de la plaza, asignación de criterios de evaluación y administrar la información correspondiente a los estudiantes inscritos en dicha plaza. Las opciones varian según el estado en el que se encuentre la plaza.'},
          {id: '.btn-detalle', text: 'El botón "<span class="fas fa-info-circle"></span>" permite ver el detalle completo de la plaza.', count: 1},
          {id: '.btn-criterios', text: 'El botón "<span class="fas fa-clipboard-list"></span>" permite asignar criterios de evaluación que serán utilizados para calificar al estudiante en la etapa de entrevista.', count: 1},
          {id: '.btn-addEstudiante', text: 'El botón "<span class="fas fa-user-plus"></span>" permite agregar estudiantes a la plaza si este presenta problema con la inscripción a la misma.', count: 1},
          {id: '.btn-verEstudiante', text: 'El botón "<span class="fas fa-user"></span>" permite visualizar a los estudiantes inscritos en la plaza. En este botón se muestra el número de estudiantes.', count: 1},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
          {id: '#table_plazasRevisadas_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo la convocatoria, el solicitante, el nombre de la plaza, la fecha de solicitud, el estado o cualquier otra palabra que este relacionada con la plaza que desea encontrar.'},
        ]
      });
      this.tutorial.start();
  }

}
