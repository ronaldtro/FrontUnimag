import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/services/supervisor.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { DataTableDirective } from 'angular-datatables';
import { Estudiantes } from 'src/app/interfaces/supervisor_ayudantia.interfase';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

declare var $: any;

@Component({
  selector: 'app-supervisor-ayudantia',
  templateUrl: './supervisor-ayudantia.component.html',
  styleUrls: ['./supervisor-ayudantia.component.css'],
  providers: [MessageService]
})
export class SupervisorAyudantiaComponent implements OnInit {

  convocatoria: any;
  estudiante: Estudiantes = {
    id : null,
    nombre: null,
    tipoAyudantia: null,
    ayudantia: null,
    solicitante: null,
    codigo: null,
    programa: null,
    facultad: null,
    supervisor: null,
    actividades: null
  }
  id_estudiante:Estudiantes = null;
  observacion:string = null;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = DTConfig.dtConf;

  userService:UserService;
  estudiantes: Estudiantes[] = [];

  constructor(private activatedroute: ActivatedRoute, private _supervisorService: SupervisorService , private spinner: NgxSpinnerService ,private _userService:UserService, private messageService: MessageService,) { 
    this.userService = _userService;
    activatedroute.params.subscribe(parametros => {
      if (parametros['id'] != undefined) {
        this.convocatoria = parametros['id'];
      }
    });
  }

  ngOnInit() {
    this.spinner.show()
    this._supervisorService.getEstudiantesAuditor(this.convocatoria).subscribe(data => {
      if(data['success']){  
        this.estudiantes = data['estudiantes'];
        this.dtOptions.order = [[ 0, "desc" ]];
        this.dtTrigger.next();
        this.spinner.hide();
      }
      this.spinner.hide();
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()
    });
  }

  loadEstu(estu: Estudiantes) {
    $("#detalleEstudiante").modal("show");
    this.estudiante = Object.assign({}, estu);
  }

  openModalObservacion( estu: Estudiantes){
    this.id_estudiante = Object.assign({}, estu);
    $('#observacionM').modal('show');
  }

  closeFormObserbacion(form:NgForm){
    $('#observacionM').modal('hide');
    form.resetForm();
  }

  enviarObservacion(form:NgForm){

    if(!form.valid){
      return;
    }
    this.spinner.show();
    let data:any={
      id:this.id_estudiante.id,
      observacion:this.observacion
    }

    this._supervisorService.agregarObservacion(data).subscribe(data=>{
        if(data['success']==true){
          swal(
            'Acción realizada',
            'Se ha guardado correctamente la observación',
            'success'
          )
          $('#observacionM').modal('hide');
          form.resetForm();

        }else{
          //this.messageService.add({severity:'error', summary: 'Error', detail:'Tiene errores en el formulario'});
          if (data['errores']) {
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                this.messageService.add({severity:'error', summary:'Error', detail:data['errores'][i].errores[0]['ErrorMessage']});
              }
            }
          }
          if (data['error']) {
            this.messageService.add({severity:'error', summary:'Error', detail:data['error']});
            console.log(data['error']);
          }
          
        }
        this.spinner.hide();
      }, err=>{

        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        }); 
      })
  }

}
