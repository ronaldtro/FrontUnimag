import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Actividades, estudiantesActividades } from 'src/app/interfaces/actividades.interface';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { timeout } from 'q';
import { Api } from 'src/app/class/api';
import { Actividad } from '../../../../interfaces/plaza.interface';

declare var $:any;
declare var jQuery:any;
declare var Tutorial:any;

@Component({
  selector: "app-actividades",
  templateUrl: "./actividades.component.html",
  styleUrls: ["./actividades.component.css"],
  providers: [MessageService]
})
export class ActividadesComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  api = Api.dev;
  actividad: Actividades;
  codigoAyudante:string;
  totalHoras: number;
  totalHorasRevisadas: number;
  horas_eliminadas: number;
  horas_rechazadas: number;
  isValidate: String = "";
  estudiantes_atendidos: estudiantesActividades[] = [];
  actividades: Actividades[] = [];
  id: number;
  estado:number;
  convocatoria: string;
  convocatoria_estado_control_id:number;
  tipo_convocatoria: any;
  horasMaximasConvocatorias: string;
  dateNow: Date;
  idx: number;
  nombre: string;
  supervisor: string;
  emailSupervisor : string;
  tipo: Objeto = {
    id: null,
    nombre: null
  };
  estudiante: estudiantesActividades = {
    codigo: null
  };
  id_actividad: number;
  idx_actividad: number;
  historial: Objeto[] = [];
  plazaActividades: Objeto[] = [];
  es = {
    firstDayOfWeek: 1,
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado"
    ],
    dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
    dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ],
    monthNamesShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ],
    today: "Hoy",
    clear: "Limpiar"
  };

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;

  tutorial:any = null;

  constructor(
    private _estudiantesService: EstudiantesService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private funciones: FuncionesJSService,
    private cdr: ChangeDetectorRef
  ) {
    this.dateNow = new Date();
    this.actividad = {
      descripcion: "",
      fecha_inicio: null,
      fecha_fin: null,
      actividad_realizar_id: null,
      soporte:null,
    };
    this.totalHoras = 0;
    this.totalHorasRevisadas = 0;
    this.horas_eliminadas = 0;
  }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._estudiantesService.getActividades(this.id).subscribe(
        data => {
          if(data['success']){
            this.nombre = data["plaza"]["Nombre"];
            this.tipo_convocatoria = data["plaza"]["tipo_convocatoria"];
            this.convocatoria = data["plaza"]["convocatoria"];
            this.convocatoria_estado_control_id = data["plaza"]["convocatoria_estado_control_id"];
            this.actividades = data["plaza"]["actividades"];
            this.tipo = data["plaza"]["tipo"];
            this.codigoAyudante = data["plaza"]["codigoAyudante"];
            this.plazaActividades = data["plaza"]["plazaActividades"];
            this.supervisor = data["plaza"]["supervisor"];
            this.emailSupervisor = data["plaza"]["emailSupervisor"];
            this.horasMaximasConvocatorias = data["plaza"]["minimoHorasConvocatoria"];
            this.estado = data["plaza"]["estadoEstudiante"];
            
            for (let i = 0; i < this.actividades.length; i++) {
              
              this.actividades[i].fecha_fin = new Date(
                this.actividades[i].fecha_fin
              );
              this.actividades[i].fecha_inicio = new Date(
                this.actividades[i].fecha_inicio
              );
              this.totalHoras += this.actividades[i].tiempo;
            }

            //console.log(Math.floor(this.totalHoras) + " - " + (this.totalHoras % 1)*60);
            this.initDtOptions();
            this.dtTrigger.next();
            this.spinner.hide();
            this.getTotalHorasRevisadas();
            this.getTotalHorasCanceladas();
            this.getTotalHorasRechazadas();

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.column(1).visible(false);
              dtInstance.column(4).visible(false);
            });  
          }else{
            this.spinner.hide();
            swal({
              type: "error",
              title: "Error",
              text: "Error al conectar en el servidor"
            });
          }
          
        },
        err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          this.spinner.hide();
          swal({
            type: "error",
            title: "Error",
            text: respuesta.msg
          });
        }
      );
    });
  }

  nuevaActividad(form: NgForm) {
    if (!form.valid) {
      this.messageService.add({
        severity: "warn",
        summary: "Error",
        detail: "Revise la información del formulario"
      });
      return;
    }
    if (
      this.actividad.fecha_fin.getTime() ==
      this.actividad.fecha_inicio.getTime()
    ) {
      this.messageService.add({
        severity: "warn",
        summary: "Error",
        detail: "Las fechas de inicio y fin no pueden ser iguales"
      });
      return;
    }
    if (
      this.actividad.fecha_fin.getTime() <=
      this.actividad.fecha_inicio.getTime()
    ) {
      this.messageService.add({
        severity: "warn",
        summary: "Error",
        detail: "la fecha final no puede ser menor o igual a la inicial"
      });
      return;
    }
    for (let i = 0; i < this.actividades.length; i++) {
      if(this.actividades[i].estado_actividad_id != 2 && this.actividades[i].estado_actividad_id != 4){
        if (this.hayCruceDeFechasEntreActividades(this.actividad, this.actividades[i])) {
          this.messageService.add({
            severity: "warn",
            summary: "Error",
            detail:
              "Hay cruce en algunas fechas. Ya existe una actividad registrada a en la misma hora y fecha seleccionada."
          });
  
          return;
        }
      }
      
    }
    this.spinner.show();
    
    let formData = new FormData();
      formData.append('idPlaza', ""+this.id);
      formData.append('fecha_inicio', ""+this.actividad.fecha_inicio.toISOString());
      formData.append('fecha_fin', ""+ this.actividad.fecha_fin.toISOString());
      formData.append('descripcion',""+this.actividad.descripcion);
      formData.append('actividad_realizar_id',""+this.actividad.actividad_realizar_id);
      formData.append('soporte', this.actividad.soporte);
    
    this._estudiantesService.agregarActividad(formData).subscribe(
      data => {
        if (data["success"] == true) {
          this.actividad.estado_actividad_id = 1;
          this.actividad.id = data["actividad"]["id"];
          this.actividad.estado_actividad_id = data["actividad"]["estado_actividad_id"];
          this.actividad.actividad = data["actividad"]["actividad"];
          this.actividad.actividad_realizar_id = data["actividad"]["actividad_realizar_id"];
          this.actividad.historial = data["actividad"]["historial"];
          this.actividad.soporte = data["actividad"]["soporte"];
          this.actividad.estudiantes_atendidos = [];
          this.actividades.push(Object.assign({},this.actividad));
          
          this.rerender();
          form.resetForm();
          $("#exampleModal").modal("hide");
          swal(
            "Actividad registrada",
            "Se ha realizado la acción exitosamente",
            "success"
          );
          this.getTotalHoras();
        } else {
          for (let i = 0; i < data["errores"].length; i++) {
            if (data["errores"][i]["errores"].length > 0) {
              for (let j = 0; j < data["errores"][i]["errores"].length; j++) {
                this.messageService.add({
                  severity: "warn",
                  summary: "Error",
                  detail: data["errores"][i]["errores"][j]["ErrorMessage"]
                });
              }
            }
          }
        }

        this.spinner.hide();
      },
      err => {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();
        swal({
          type: "error",
          title: "Error",
          text: respuesta.msg
        });
      }
    );
  }

  getTotalHoras() {
    this.totalHoras = 0;
    for (let i = 0; i < this.actividades.length; i++) {
      this.totalHoras += this.diferenciaHoras(
        this.actividades[i].fecha_inicio,
        this.actividades[i].fecha_fin
      );
    }
    this.getTotalHorasRevisadas();
  }
  getTotalHorasRevisadas() {
    this.totalHorasRevisadas = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estado_actividad_id'] == 3;
    });
    for (let i = 0; i < actividades.length; i++) {
      this.totalHorasRevisadas += this.diferenciaHoras(
        actividades[i].fecha_inicio,
        actividades[i].fecha_fin
      );
    }
  }
  getTotalHorasCanceladas() {
    this.horas_eliminadas = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estado_actividad_id'] == 2;
    });
    for (let i = 0; i < actividades.length; i++) {
      this.horas_eliminadas += this.diferenciaHoras(
        actividades[i].fecha_inicio,
        actividades[i].fecha_fin
      );
    }
  }

  getTotalHorasRechazadas() {
    this.horas_rechazadas = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estado_actividad_id'] == 4;
    });
    for (let i = 0; i < actividades.length; i++) {
      this.horas_rechazadas += this.diferenciaHoras(
        actividades[i].fecha_inicio,
        actividades[i].fecha_fin
      );
    }
  }

  isFechaValid(fecha: Date, touch: boolean, form: NgForm): string {
    if (!fecha && (form.submitted || touch)) {
      return "is-invalid";
    }
    return "";
  }

  resetForm(form: NgForm) {
    form.resetForm();
  }

  deleteActividad(id: number, idx: number) {
    swal({
      title: "Eliminar registro",
      text: "¿Está seguro de eliminar el registro?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonClass: "btn btn-danger m-1",
      cancelButtonClass: "btn m-1",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.spinner.show();
        this._estudiantesService.cambiarEstadoActividad(id).subscribe(
          data => {
            this.spinner.hide();
            this.actividades.splice(idx, 1);
            this.getTotalHoras();
            this.rerender();
            swal(
              "Registro eliminado",
              "Acción realizada satisfactoriamente.",
              "success"
            );
          },
          err => {
            let respuesta: RespuestaServidor = new RespuestaServidor(
              err.status
            );
            this.spinner.hide();
            swal({
              type: "error",
              title: "Error",
              text: respuesta.msg
            });
          }
        );
      }
    });
  }

  loadEdit(activ: Actividades, idx: number) {
    $("#editarModal").modal("show");
    this.actividad = Object.assign({}, activ);
    this.actividad.soporte_url = this.actividad.soporte;
    this.idx = idx;
  }

  editActividad(form: NgForm, idx: number) {
    if (!form.valid) {
      return;
    }
    if(this.actividad.fecha_fin.getTime()==this.actividad.fecha_inicio.getTime()){
      this.messageService.add({severity:'warn', summary: 'Error', detail:'Las fechas de inicio y fin no pueden ser iguales'});
      return;
    }
    if(this.actividad.fecha_fin.getTime()<=this.actividad.fecha_inicio.getTime()){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'la fecha final no puede ser menor o igual a la inicial'});
      return;
    }

    for (let i = 0; i < this.actividades.length; i++) {
      if(this.actividades[i].estado_actividad_id != 2 && this.actividades[i].estado_actividad_id != 4){
        if (this.actividad.id != this.actividades[i].id) {
          if (this.hayCruceDeFechasEntreActividades(this.actividad, this.actividades[i])) {
            this.messageService.add({
              severity: "warn",
              summary: "Alerta",
              detail: "Hay cruce en algunas fechas"
            });
  
            return;
          }
        }
      }
      
    }
    this.spinner.show();
    
    let formData = new FormData();
      formData.append('idPlaza', ""+this.id);
      formData.append('id',""+this.actividad.id);
      formData.append('fecha_inicio', ""+this.actividad.fecha_inicio.toISOString());
      formData.append('fecha_fin', ""+ this.actividad.fecha_fin.toISOString())
      formData.append('descripcion',""+this.actividad.descripcion);
      formData.append('actividad_realizar_id',""+this.actividad.actividad_realizar_id);
      formData.append('soporte', this.actividad.soporte);

    this._estudiantesService.editarActividad(formData).subscribe(data => {
      if(data['success']==true){
        this.actividades[idx].fecha_fin=this.actividad.fecha_fin;
        this.actividades[idx].fecha_inicio=this.actividad.fecha_inicio;
        this.actividades[idx].descripcion=this.actividad.descripcion;
        this.actividades[idx].actividad=data["actividad"]["actividad"];
        //this.actividades[idx].id=this.actividad.id;
        this.actividades[idx].actividad_realizar_id=this.actividad.actividad_realizar_id;
        this.actividades[idx].soporte= data["actividad"]["soporte"];
        this.rerender();
        swal(
          'Actividad modificada',
          'Se ha realizado la acción exitosamente',
          'success'
        )
        this.getTotalHoras();
        $("#editarModal").modal("hide");
        this.spinner.hide();
      }else{
        for(let i=0;i<data['errores'].length;i++){
          if(data['errores'][i]['errores'].length>0){
            for(let j=0; j<data['errores'][i]['errores'].length; j++){
              this.messageService.add({severity:'warn', summary: 'Error', detail:data['errores'][i]['errores'][j]['ErrorMessage']});
            }
          }
        }
        this.spinner.hide();
        form.resetForm();
        $("#editarModal").modal("hide");
      }
      },
      err => {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: "error",
          title: "Error",
          text: respuesta.msg
        });
        this.spinner.hide();
      }
    );
  }

  openNuevaActividad(form: NgForm) {
    form.resetForm();
    let fecha = new Date();
    fecha.setMinutes(0,0);
    fecha.setHours(fecha.getHours()-1);
    this.actividad.fecha_inicio = fecha;
    let fechaFin = new Date(fecha.getTime());
    fechaFin.setMinutes(0,0);
    fechaFin.setHours(fechaFin.getHours());
    this.actividad.fecha_fin = fechaFin;
  }
  /**
   * Se valida si hay cruce de fechas entre dos actividades
   * @param actividad1 source
   * @param actividad2 target
   * @returns bool true si hay cruce de fechas
   */
  hayCruceDeFechasEntreActividades(actividad1:Actividades, actividad2:Actividades){
    let fi1 = actividad1.fecha_inicio.getTime(), ff1 = actividad1.fecha_fin.getTime(), fi2 = actividad2.fecha_inicio.getTime(), ff2 = actividad2.fecha_fin.getTime();
    return (fi1 > fi2 && fi1 < ff2) || (ff1 > fi2 && ff1 < ff2) || (fi1 <= fi2 && ff1 >= ff2)
  }

  asignarFecha(fechaInicio : Date, fechaFin : Date){
    
    if(this.actividad.fecha_fin == null || this.actividad.fecha_inicio == null) return;
    
    this.actividad.fecha_fin = new Date(this.actividad.fecha_inicio.getTime());
    this.actividad.fecha_fin.setHours(this.actividad.fecha_fin.getHours()+1, 0, 0);
  }

  esFechaIgual(fecha_inicio: Date, fecha_fin: Date){
    if(fecha_inicio == null || fecha_fin == null) return false;
    let fInicio = new Date(fecha_inicio.getTime()), fFin = new Date(fecha_fin.getTime());
    fInicio.setHours(0,0,0);
    fFin.setHours(0,0,0);
    return fInicio.getTime() == fFin.getTime();
  }

  esFechaMayor(fecha_inicio: Date, fecha_fin: Date){
    if(fecha_inicio == null || fecha_fin == null) return false;
    return fecha_inicio.getTime() > fecha_fin.getTime();
  }

  validarFechaInicial(fecha_inicio: Date, fecha_fin: Date){
    
    if(fecha_inicio.getTime() > fecha_fin.getTime()){
      setTimeout(() => {
        fecha_inicio = new Date(fecha_fin.getTime());
        fecha_inicio.setMinutes(0,0);
      }, 50);
      
    }
  }

  diferenciaHoras(fecha_inicio: Date, fecha_fin: Date){
    if(fecha_inicio == null || fecha_fin == null){
      return 0;
    }
    let diference = fecha_fin.getTime() - fecha_inicio.getTime();

    if (diference === 0) {
      return 0;
    }
    let mins = diference / 60000;
    let hrs = mins / 60;
    // console.log((Math.round(hrs * 100) / 100) % 1);
    return Math.round(hrs * 100) / 100;
  }
  
  getInteger(number : number){

    return Math.floor(number);
  }

  getDecimals(number: number) {
    return (Math.round(number * 100) / 100) % 1;
  }

  loadEstudiantes(activ: Actividades) {
    this.estudiantes_atendidos = Object.assign([], activ.estudiantes_atendidos);
    this.id_actividad = activ.id;
    this.idx_actividad = this.actividades.indexOf(activ);
    $("#estudiantesModal").modal({
      show: true,
      keyboard: false,
      backdrop: 'static'
    });
  }

  addEstudiante(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.estudiante.codigo.toString().trim() == this.codigoAyudante) {
      this.messageService.add({
        severity: "warn",
        summary: "Alerta",
        detail: "No se puede registrar el código del ayudante"
      });
      return;
    }
    for (
      let i = 0;
      i < this.estudiantes_atendidos.length;
      i++
    ) {
      if (
        this.estudiante.codigo ==
        this.estudiantes_atendidos[i].codigo
      ) {
        this.messageService.add({
          severity: "warn",
          summary: "Alerta",
          detail: "Ya hay registrado un estudiante con ese código"
        });
        return;
      }
    }
    this.spinner.show();
    this._estudiantesService.validarCodigo(this.estudiante.codigo).subscribe(
      data => {
        if (data["success"] === true) {
          this.estudiantes_atendidos.push(data["estudiant"]);
          form.resetForm();
          this.estudiante.codigo=null; 
        //  this.actividades[this.idx_actividad].estudiantes_atendidos.push(data["estudiant"]);
          //console.log("codigo válido");
        } else {
          //console.log(data["error"]);
          this.messageService.add({severity:'error', summary: 'Error', detail: data["error"]});
        }
        this.spinner.hide();
        return;
      },
      err => {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();
        swal({
          type: "error",
          title: "Error",
          text: respuesta.msg
        });
        
        return;
      }
    );
    //return;

    // if(!form.valid){
    //   return;
    // }
    // if(this.isValidate=='notValid'){
    //   this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Código no válido'});
    //   return;
    // }

    // if(this.isValidate=='isLoading'){
    //   this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Buscando, por favor espere'});
    //   return;
    // }
    // for(let i=0; i<this.actividades[this.idx_actividad].estudiantes_atendidos.length; i++){
    //   if(this.estudiante.codigo==this.actividades[this.idx_actividad].estudiantes_atendidos[i].codigo){
    //     this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Ya hay registrado un estudiante con ese código'});
    //     return;
    //   }
    // }

    // let est:any={
    //   codigo:null,
    //   observacion:null
    // };

    // est.codigo = this.estudiante.codigo;
    // this.actividades[this.idx_actividad].estudiantes_atendidos.push(est);
    // form.resetForm();
    // this.estudiante.codigo=null;
    // this.isValidate='';
  }

  validarCodigo(codigo: number) {
    this.isValidate = "isLoading";
    this._estudiantesService.validarCodigo(codigo).subscribe(
      data => {
        if (data["success"] == true) {
          console.log("codigo válido");
        } else {
          console.log(data["error"]);
        }
      },
      err => {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();
        swal({
          type: "error",
          title: "Error",
          text: respuesta.msg
        });
      }
    );

    if (!this.estudiante.codigo) {
      this.isValidate = "";
      return;
    }
    let random = Math.floor(Math.random() * (+2 - +0)) + +0;
    if (random === 1) {
      this.isValidate = "isValid";
    } else {
      this.isValidate = "notValid";
    }
  }

  saveEstudiantes() {
    /*if(this.actividades[this.idx_actividad].estudiantes_atendidos.length==0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'No se han añadido estudiantes'});
      return;
    }*/
    let data: any = {
      id: this.id_actividad,
      estudiantes: this.estudiantes_atendidos
    };
    this.spinner.show();
    
    this._estudiantesService.agregarEstudianteActividad(data).subscribe(
      res => {
        if (res["success"]) {          
          this.actividades[this.idx_actividad].estudiantes_atendidos =
            res["estudiantes"];
          $("#estudiantesModal").modal("hide");
          swal(
            "Realizado",
            "Se ha realizado la acción exitosamente",
            "success"
          );
        } else {
          //console.log(data["error"]);
          this.messageService.add({severity:'error', summary: 'Error', detail: data["error"]});
          
          return;
        }
        this.spinner.hide();
      },
      err => {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();
        swal({
          type: "error",
          title: "Error",
          text: respuesta.msg
        });
      }
    );
  }

  deleteEstudiante(idx) {
    swal({
      title: "Eliminar registro",
      text: "¿Está seguro de eliminar el registro?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonClass: "btn btn-danger m-1",
      cancelButtonClass: "btn m-1",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        swal(
          "Registro eliminado",
          "Acción realizada satisfactoriamente. Presione el botón Guardar para efectuar los cambios realizados.",
          "success"
        );
        this.estudiantes_atendidos.splice(
          this.estudiantes_atendidos.indexOf(idx),
          1
        );
      }
    });
  }

  loadHistory(idx: Actividades) {
    this.historial = [];
    this.historial = idx.historial;
    $("#historialModal").modal("show");
  }
  onUploadFile(event){
    for(let file of event.files) {
      this.actividad.soporte=file;
    }
    this.cdr.detectChanges();
  }

  onClearFile(){
    this.actividad.soporte=null;
    this.cdr.detectChanges();
  }

  onUploadFileFormato(event){
    for(let file of event.files) {
      this.actividad.soporte=file;
    }
    this.cdr.detectChanges();
  }

  onClearFileFormato(){
    this.actividad.soporte=null;
    this.cdr.detectChanges();
  }

  initDtOptions() {
    this.dtOptions.order = [[0, "desc"]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: "copy",
        text: "Copiar",
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
      {
        extend: "print",
        text: "Imprimir",
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      },
      {
        extend: "excel",
        text: "Excel",
        exportOptions: {
          columns: [0, 1, 2, 3, 4]
        }
      }
    ];
  }
  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    $('[data-toggle="popover"]').popover("hide");
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  ngAfterViewInit() {
    $('[data-toggle="popover"]').popover({
      trigger: "focus"
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      // dtInstance.column(1).visible(false);
      // dtInstance.column(4).visible(false);
    });
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de actividades del estudiante</p><p class="container">El sistema permite agregar, visualizar, editar o eliminar las actividades que registre el estudiante durante el periodo de la ayudantía. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar las actividades que registre el estudiante en el sistema.</p>'},
        elements:[
          {id: '#supervisor', text: 'En el lado izquierdo se encuentran los datos del supervisor asignado. En el lado derecho se pueden observar datos de interés como el nombre de la plaza, el tipo de ayudantía, el total de horas registradas y el total de horas revisadas por el supervisor.'},
          {id: '#addActividad', text: 'El botón "<span class="fas fa-plus"></span> Añadir actividad" permite al estudiante ingresar actividades al sistema, al hacer clic en el botón se desplegará un formulario con los campos necesarios para registrar la actividad. Todos los campos son obligatorios.'},
          {id: '#table_actividadesEst', text: 'Esta tabla muestra todas las actividades que han sido ingresadas al sistema por el estudiante. Desde la columna "Acciones" puede acceder a las diferentes opciones para cada registro de la tabla tales como editar, eliminar, agregar estudiantes y ver el historial de cambios de la actividad. Las opciones varian según el estado en el que se encuentre la actividad.'},
          {id: '.btn-editar', text: 'El botón "<span class="fas fa-pencil-alt"></span>" permite modificar la información ingresada en la actividad.', count: 1},
          {id: '.btn-eliminar', text: 'El botón "<span class="fas fa-trash-alt"></span>" permite eliminar la actividad ingresada por el estudiante, tenga en cuenta que esta acción es irreversible.', count: 1},
          {id: '.btn-agregarEst', text: 'El botón "<span class="fas fa-user-plus"></span>" permite agregar los estudiantes atendidos a la actividad ingresada por el estudiante. Al hacer clic en el botón se desplegará un formulario con los campos necesarios para añadir a los estudiantes a la actividad.', count: 1},
          {id: '.btn-historialCambios', text: 'El botón "<span class="fas fa-history"></span>" permite visualizar el histórico de la actividad, si ha sido revisada o rechazada por el supervisor o comité.', count: 1},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
          {id: '#table_actividadesEst_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo la fecha, duración, nombre o cualquier otra palabra que esté relacionada con la actividad que desea encontrar.'},
          {id: '#accordionExample', text: 'En la sección de preguntas frecuentes se encuentra una ayuda más detallada sobre algunas de las acciones que puede hacer el estudiante en esta ventana.'},
          {id: '#volver', text: 'El botón "Volver" permite regresar al perfil del estudiante.'},
        ]
      });
      this.tutorial.start();
  }
}
