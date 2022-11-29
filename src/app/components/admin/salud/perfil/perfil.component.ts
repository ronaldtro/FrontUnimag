import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfilProfesionalService } from 'src/app/services/perfil-profesional.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgxSpinnerService } from 'ngx-spinner';
/* Importaciones para fullcalendar */
import { OptionsInput } from '@fullcalendar/core';
import { FullcalendarConfig } from 'src/app/class/fullcalendarConfig';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/components/common/api';


declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

 /* Inicializacion para fullcalendar */
 calendarOptions: OptionsInput = Object.assign({},FullcalendarConfig.options);
 // references the #calendar in the template
 @ViewChild('fullcalendar') fullcalendar:FullCalendarComponent;


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  errores:object[]=[];

  prof:any={
    id:null,
    nombres:null,
    email:null,
    identificacion:null,
    tipoProfesional:null
  };

  horarios:any[]=[];
  index: number = 0;
  profesional: any;
 

  constructor( 
    private _perfilService:PerfilProfesionalService,
    private spinner: NgxSpinnerService,
    private funcionesP: FuncionesJSService,  
    ) 
    {this.funciones = funcionesP;}


    
    ngOnInit() {
      this.spinner.show();
      this._perfilService.getProfesional().subscribe(data=>{  
        this.horarios=data['horarios'];

        this.profesional=JSON.parse(data['profesional']);
        this.prof= this.profesional.profesional;

        //  console.log("este es el profesional",this.prof);  
        //  console.log(this.horarios);          
        this.initDtOptions(); 
        this.dtTrigger.next();
        this.spinner.hide();
        // calendar
        this.horarios = this.processingData(this.horarios);
        this.calendarOptions.editable = false;
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });    
      })
  
    }


    rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {      
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  
    initDtOptions(){    
      this.dtOptions.dom = "Bfrtip";
      this.dtOptions.buttons = [
        {
          extend: 'copy',
          text: 'Copiar'
        },
        {
          extend: 'print',
          text: 'Imprimir',
          exportOptions: {
            columns: [0,1,2,3]
          }
        },
        {
          extend: 'excel',
          text: 'Excel',
          exportOptions: {
            columns: [0,1,2,3]
          }
        }
      ];
  
      // this.dtOptions.stateSave = false;
      // this.dtOptions.initComplete = () => {
      //     this.funciones.addFilter(this, 0, "#filter-Codigo"); 
      //    // this.funciones.addFilterLista(this, 2, "#filter-condiciones");   
      // }; 
  
    }
  
    // ngAfterViewChecked(): void {
    //   this.funciones.reemplazarBotonesDatatable();
    //   $('[data-toggle="tooltip"]').tooltip();
    // }


// obj.lugar_consultorio + "\n" +
/*Funciones para fullcalendar*/
processingData(data:any[],isBackground:boolean = false):any[]{
  
  let result:any[] = [];
  for(let i = 0; i < data.length; i++){
    let obj:any = data[i];
    obj.title =  obj.nombre_consultorio;   
    obj.start = this.getDateToCalendar(obj.id_dia_atencion - 1, obj.hora_inicio);
    obj.end = this.getDateToCalendar(obj.id_dia_atencion - 1, obj.hora_fin);
    if(isBackground) obj.rendering = "background";
    result.push(obj);
  
  }
 
  return result;

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



}
