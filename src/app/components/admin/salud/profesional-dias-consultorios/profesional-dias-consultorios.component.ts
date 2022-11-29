import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ProfesionalSaludService } from 'src/app/services/profesionalSalud.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Horario } from 'src/app/interfaces/horario';
import { Tiempo } from 'src/app/class/tiempo';
import { Location } from '@angular/common';
/* Importaciones para fullcalendar */
import { OptionsInput } from '@fullcalendar/core';
import { FullcalendarConfig } from 'src/app/class/fullcalendarConfig';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/components/common/api';


declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-profesional-dias-consultorios',
  templateUrl: './profesional-dias-consultorios.component.html',
  styleUrls: ['./profesional-dias-consultorios.component.css'],
  providers: [MessageService]
})
export class ProfesionalDiasConsultoriosComponent implements OnInit {
  [x: string]: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  appliedFilters:any[] = [];
  tiempo:any[] = Tiempo.tiempo;
  //errores:object[]=[];
  profesional_dias_salud:any[]=[];  
  index: number = 0;
  id: number = 0;
  profesional_dias_salud_general:any[]=[];
  errores:Message[]=[];

  /* Inicializacion para fullcalendar */
  calendarOptions: OptionsInput = Object.assign({},FullcalendarConfig.options);
  // references the #calendar in the template
  @ViewChild('fullcalendar') fullcalendar:FullCalendarComponent;
  
  horario:Horario={
    id_profesional:null,
    id_dia_atencion:null,
    id_consultorio:null,
    cedula_profesional:null,
    nombre_tipo_profesional:null,
    nombre_profesional: null,
    nombre_consultorio:null,
    lugar_consultorio:null,
    dia_atencion:null,
    hora_inicio:null,
    hora_fin:null,
    id:null
  };

  profesionales:any={
    id:null,
    nombre:null,
    cedula_profesional:null,
    nombre_tipo_profesional:null,
  }

  error: any[] = [];
  consultorios:any []=[];
  dia:any []=[];

  constructor( 
    private _profesional_dias_salud: ProfesionalSaludService, 
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private _location: Location, 
    private messageService: MessageService,
    ) 
    {}

  ngOnInit() {

    
    
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._profesional_dias_salud.getProfesionales_dias_consultorios(this.id).subscribe(data=>{        
        this.profesional_dias_salud=data['horarios']; 
        this.profesional_dias_salud_general=data['horarios_Diferente']; 
        this.dia=data['dia'];
        this.consultorios=data['consultorio'];
        this.profesionales=data['profesional'];
             
        this.dtTrigger.next();
        

        
        if(Object.assign([],this.dia).filter((item)=>{item.id == 7}).shift() == null){
          this.calendarOptions.hiddenDays = [0];
        }

        this.profesional_dias_salud = this.processingData(this.profesional_dias_salud);
        this.profesional_dias_salud_general = this.processingData(this.profesional_dias_salud_general, true);
        this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });    
      });

    })   
  }

  crearHorario() {
    this.horario={
      id_profesional:this.profesionales.id,
      id_dia_atencion:null,
      id_consultorio:null,
      cedula_profesional:null,
      nombre_tipo_profesional:null,
      nombre_consultorio:null,
      lugar_consultorio:null,
      dia_atencion:null,
      hora_inicio:null,
      hora_fin:null,
      id:null
    };
    //console.log(this.profesionales);
    //$('#crearHorario').modal('show');
  }

  

  crearHorarioP(forma: NgForm) {
    this.spinner.show();
    console.log(forma);
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this._profesional_dias_salud.crearProfesionales_dias_consultorios(this.horario)
        .subscribe(data => {
          if (data['success']) {
            this.profesional_dias_salud.push(data['objRetornado']);
           //this.rerender();        
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });   

            let objRetornado = data['objRetornado'];
            let calendar = this.fullcalendar.getApi();
            calendar.addEvent(this.processingDataByEvent(objRetornado));

            forma.resetForm(this.horario);
            this.horario = {
              id_profesional:null,
              id_dia_atencion:null, 
              id_consultorio:null, 
              cedula_profesional:null, 
              nombre_tipo_profesional:null,
              nombre_consultorio:null,
              lugar_consultorio:null,
              dia_atencion:null,
              hora_inicio:null,
              hora_fin:null,
              id:null
            };
            this.error = [];
            this.spinner.hide(); 
            forma.resetForm();         
            $('#crearHorario').modal('hide');
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
    }
  }


  editarHorario(obj:any, abrirModal:boolean = true) {  
     this.index = this.profesional_dias_salud.indexOf(obj);
     let copy = Object.assign({}, obj);
     if(abrirModal) $('#editarHorario').modal('show');
     this.horario = copy;
     console.log(this.horario);
   }

  editarHorarioP(forma: NgForm = null, horario:any = null) {
    this.spinner.show();
    let valid = forma != null ? forma.valid : true;
    console.log(forma);
    if (!valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this.horario.id_profesional = this.profesionales.id; 
      this._profesional_dias_salud.editarProfesionales_dias_consultorios(this.horario)
        .subscribe(data => {
          if (data['success']) {
            this.profesional_dias_salud[this.index] = data['objRetornado'];  
            let event_to_update:any = this.fullcalendar.getApi().getEventById(this.profesional_dias_salud[this.index].id);
            let newData = this.processingDataByEvent(data['objRetornado']);
            event_to_update.setExtendedProp('id_consultorio', newData.id_consultorio);
            event_to_update.setExtendedProp('nombre_consultorio',newData.nombre_consultorio);
            event_to_update.setExtendedProp('hora_inicio',newData.hora_inicio);
            event_to_update.setExtendedProp('hora_fin',newData.hora_fin);
            event_to_update.setExtendedProp('id_dia_atencion',newData.id_dia_atencion);
            event_to_update.setProp('start', newData.start);
            event_to_update.setProp('end',newData.end);
            event_to_update.setProp('title',newData.nombre_consultorio);
            //this.rerender();         
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });       

            if(forma != null) forma.resetForm(this.horario);
            this.horario = {
              id_profesional:null,
              id_dia_atencion:null,
              id_consultorio:null,
              cedula_profesional:null,
              nombre_tipo_profesional:null,
              nombre_consultorio:null,
              lugar_consultorio:null,
              dia_atencion:null,
              hora_inicio:null,
              hora_fin:null,
              id:null
            };
            this.error = [];
            this.spinner.hide(); 
            $('#editarHorario').modal('hide');          
          } else {
            // this.error = data['errores'];
            // swal({
            //   type: "error",
            //   title: "Error",
            //   text: "Corrige los errores",
            //   timer: 2000,
            //   showConfirmButton: false
            // });
           // this.messageService.add({severity:'error', summary: 'Error', detail:'No es posible hacer esta acción.'});
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                this.errores.push({severity:'error', summary:'Error: ', detail:  data['errores'][i].errores[0]['ErrorMessage']});
              }
            }
            console.log(this.errores);
            if(horario != null) horario.revert();
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          if(horario != null) horario.revert();
          this.spinner.hide()
        });
    }
  }

  editarHorarioP2(forma: NgForm = null, horario:any = null){

    this.spinner.show(); 
    let valid = forma != null ? forma.valid : true;
    console.log(this.horario);
    if (!valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
      return
    }
    swal({
      title: 'Editar horario',
      text: "¿Estás seguro de este cambio?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
    }).then((res) => {
     
      if (res.value) {
        this.horario.id_profesional = this.profesionales.id; 
        this._profesional_dias_salud.editarProfesionales_dias_consultorios(this.horario)
      .subscribe( data => {       
        if(data['success']){  
          
          this.profesional_dias_salud[this.index] = data['objRetornado'];  
            let event_to_update:any = this.fullcalendar.getApi().getEventById(this.profesional_dias_salud[this.index].id);
            console.log(data['objRetornado']);
            let newData = this.processingDataByEvent(data['objRetornado']);
            event_to_update.setExtendedProp('id_consultorio', newData.id_consultorio);
            event_to_update.setExtendedProp('nombre_consultorio',newData.nombre_consultorio);
            event_to_update.setExtendedProp('hora_inicio',newData.hora_inicio);
            event_to_update.setExtendedProp('hora_fin',newData.hora_fin);
            event_to_update.setExtendedProp('id_dia_atencion',newData.id_dia_atencion);
            event_to_update.setProp('start', newData.start);
            event_to_update.setProp('end',newData.end);
            event_to_update.setProp('title',newData.nombre_consultorio);

          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha editado satisfactoriamente el item.",
            timer: 2000,
            showConfirmButton: false
          });   
          if(forma != null) forma.resetForm(this.horario);
          this.horario = {
            id_profesional:null,
            id_dia_atencion:null,
            id_consultorio:null,
            cedula_profesional:null,
            nombre_tipo_profesional:null,
            nombre_consultorio:null,
            lugar_consultorio:null,
            dia_atencion:null,
            hora_inicio:null,
            hora_fin:null,
            id:null
          };
          this.error = [];
          this.spinner.hide(); 
          $('#editarHorario').modal('hide');             
          }else{
            // this.error = data['errores'];
            // swal({
            //   type: "error",
            //   title: "Error",
            //   text: "Corrige los errores",
            //   timer: 2000,
            //   showConfirmButton: false
            // });
            //this.messageService.add({severity:'error', summary: 'Error', detail:'No es posible hacer esta acción.'});
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                this.errores.push({severity:'error', summary:'', detail:data['errores'][i].errores[0]['ErrorMessage']});
              }
            }


            if(horario != null) horario.revert();           
          }       
          this.spinner.hide();
        }, err=>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });
            this.spinner.hide();
        }) 
    } else if (res.dismiss === swal.DismissReason.cancel) {
      if(horario != null) horario.revert();  
    }
  });
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
 
  getNombre(id) {
    var resp = '';
    for (var i = 0; i < this.tiempo.length; i++) {
        if (this.tiempo[i].id === id) {
            resp = this.tiempo[i].nombre;            
        }
    }
    return resp;
};

/*Funciones para fullcalendar*/
processingData(data:any[],isBackground:boolean = false):any[]{
  let result:any[] = [];
  for(let i = 0; i < data.length; i++){
    let obj:any = data[i];
    obj.title = obj.nombre_consultorio;
    obj.start = this.getDateToCalendar(obj.id_dia_atencion - 1, obj.hora_inicio);
    obj.end = this.getDateToCalendar(obj.id_dia_atencion - 1, obj.hora_fin);
    if(isBackground) obj.rendering = "background";
    result.push(obj);
  }
  return result;
}

processingDataByEvent(event:any){
  
    let obj:any = event;
    obj.title = obj.nombre_consultorio;
    obj.start = this.getDateToCalendar(obj.id_dia_atencion - 1, obj.hora_inicio);
    obj.end = this.getDateToCalendar(obj.id_dia_atencion - 1, obj.hora_fin);    
    return obj;
}

handleDateClick(arg):void { // handler method
  //alert(arg.dateStr);
  this.crearHorario();
  this.horario.id_dia_atencion = arg.date.getDay();
  this.horario.hora_inicio = this.getHoursAndMinutes(arg.date);
  let endDate:Date = new Date(arg.date.getTime());
  endDate.setHours(arg.date.getHours() + 1);
  this.horario.hora_fin = this.getHoursAndMinutes(endDate);  
  //console.log(this.horario);
  $('#crearHorario').modal("show");
}

handleEventClick(arg):void{ 
  let event:any = Object.assign({},this.fullcalendar.getApi().getEventById(arg.event.id).extendedProps);
  event.id = arg.event.id;
  this.editarHorario(event, true);
  this.selectedDate = {
    id: event.id,
    id_dia_atencion: event.id_dia_atencion,
    id_consultorio: event.id_consultorio,
    hora_inicio: event.hora_inicio,
    hora_fin:  event.hora_fin,
  }  
}

handleEventDrop(info:any){  
  let event:any = Object.assign({},this.fullcalendar.getApi().getEventById(info.event.id).extendedProps);
  event.id = +info.event.id;
  this.editarHorario(event, false);
  this.horario.id_dia_atencion = info.event.start.getDay();
  this.horario.hora_inicio = this.getHoursAndMinutes(info.event.start);
  this.horario.hora_fin = this.getHoursAndMinutes(info.event.end);


  
  swal({
    title: 'Editar horario',
    text: "¿Estás seguro de este cambio?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'green',
    confirmButtonText: 'Aceptar',
    reverseButtons: true,
    cancelButtonText: 'Cancelar',
    confirmButtonClass: 'btn btn-success m-1',
    cancelButtonClass: 'btn m-1',
  }).then((res) => {
    if (res.value){
     this.editarHorarioP(null, info);      
    } else  {
      info.revert();
    }
  });
}

handleEventResize(info:any){
  let event:any = Object.assign({},this.fullcalendar.getApi().getEventById(info.event.id).extendedProps);
  event.id = +info.event.id;
  this.editarHorario(event, false);
  this.horario.hora_fin = this.getHoursAndMinutes(info.event.end); 
  if ((info.event.end.getDay() != info.prevEvent.end.getDay())) {
    info.revert();
  }else{
    swal({
      title: 'Editar horario',
      text: "¿Estás seguro de este cambio?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
    }).then((res) => {
      if (res.value){
       this.editarHorarioP(null, info);      
      } else  {
        info.revert();
      }
    });
  }
  
}

handleEventDragStart(info:any):void{
  this.toggleHorarios(info, "add");
}

handleEventDragStop(info:any):void{
  this.toggleHorarios(info, "remove");
}
handleEventResizeStart(info:any):void{
  this.toggleHorarios(info, "add");
}

handleEventResizeStop(info:any):void{
  this.toggleHorarios(info, "remove");
}

toggleHorarios(info:any, action:string){
  let event:any = info.event;
  let event_with_consultorio:any[] = this.profesional_dias_salud_general.filter((item)=>{return item.id_consultorio == event.extendedProps.id_consultorio});
  event_with_consultorio.forEach((item)=>{
    switch(action){
      case "add":
          this.fullcalendar.getApi().addEvent(item);
        break;
      case "remove":
          let event_to_remove:any = this.fullcalendar.getApi().getEventById(item.id);
          event_to_remove.remove();
        break;
    }
  });
}

getHoursAndMinutes(date:Date):string{
  return (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());

}

/*Obtiene la semana de la fecha pasada por parametro*/
getWeek(current:Date = new Date()):Date[] {
  var week= new Array();
  // Starting Monday not Sunday
  current.setDate((current.getDate() - current.getDay() +1));
  for (var i = 0; i < 7; i++) {
      week.push(
          new Date(current)
      ); 
      current.setDate(current.getDate() +1);
  }
  return week; 
}

getDateToCalendar(dayOfWeek:number, hour:string):string{
  
  let dateOfWeek: Date = this.getWeek(this.fullcalendar.getApi().view.currentStart)[dayOfWeek];
  let stringDate: string = ""+dateOfWeek.getFullYear() + "-" + (dateOfWeek.getMonth() + 1 < 10 ? "0" + (dateOfWeek.getMonth() + 1) : ""+ (dateOfWeek.getMonth() + 1)) + "-" + (dateOfWeek.getDate() < 10 ? "0" + dateOfWeek.getDate() : ""+ dateOfWeek.getDate());
  return stringDate + "T" + hour;
}

backClicked() {
  this._location.back();
}
}
