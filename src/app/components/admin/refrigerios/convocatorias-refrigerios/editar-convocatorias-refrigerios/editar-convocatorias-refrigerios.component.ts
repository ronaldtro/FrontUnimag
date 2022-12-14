import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
import { ConvocatoriaRefrigerio } from '../../../../../interfaces/convocatoria-refrigerio.interface';
import { Objeto } from '../../../../../interfaces/objeto.interfaces';
import swal from 'sweetalert2';
import {MessageService} from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { NgForm, FormControl } from '@angular/forms';
import { Etapas } from '../../../../../interfaces/etapas.interfaces';
import { Api } from '../../../../../class/api';
import { Beneficios, Condiciones } from '../../../../../interfaces/beneficio-convocatoria-refrigerio.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Tiempo } from 'src/app/class/tiempo';
import { Subject } from 'rxjs';

declare var $:any;

@Component({
  selector: 'app-editar-convocatorias-refrigerios',
  templateUrl: './editar-convocatorias-refrigerios.component.html',
  styleUrls: ['./editar-convocatorias-refrigerios.component.css'],
  providers: [MessageService]
})
export class EditarConvocatoriasRefrigeriosComponent implements OnInit {
  id:number;
  bolsas:Objeto[]=[];
  estados:Objeto[]=[];
  cafeterias:Objeto[]=[];
  modalidades:Objeto[]=[];
  condicions:Condiciones[]=[];
  condicionesRespaldo:Objeto[]=[];
  errores:Message[]=[];
  dateNow: Date;
  isValid:string="";
  send:boolean=false;
  mostrar:boolean=false;
  condiciones:Objeto[]=[];
  beneficios:Objeto[]=[];
  dias:Objeto[]=[];
  tipo:number[]=[];
  tiempo:any[] = Tiempo.tiempo;
  
  etapa:Etapas={
    id:null,
    fecha_fin:null,
    fecha_inicio:null,
    estado_id:null,
    peso_etapa:null
  };

  api:string = Api.dev;
  editar:boolean=false;
  guardar:boolean=false;
  doc:number;
  idx:number;
  
  es: any;

  index:number=0;
  editarBenefi:boolean=false;

  benefi:Beneficios={
    idDia:null,
    dia:null,
    idBeneficio:null,
    beneficio:null,
    valor:null,
    idCafeterias:[],
    cafeterias:[]  
  } 
  
  convocatoria: ConvocatoriaRefrigerio={
    etapas:[],
    beneficios:[],
    condiciones:[],
    idsBeneficios:[],
    bolsa_presupuestal_id : null
  };

  condicion:Condiciones={
    id:null,
    condicion_id:null,
    condicion:null,
    numero_fallas:null,
    cantidad_beneficios:null,
    validar_horario:null,
    peso:null,
    estrato:null 
  }

  dtTrigger: Subject<string> = new Subject();
  
  constructor( private router:Router,
               private route:ActivatedRoute,
               private _convocatoriaService:ConvocatoriaRefrigerioService, 
               private messageService: MessageService,           
               private spinner: NgxSpinnerService,
               private elementRef: ElementRef,) {

  }

  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id = params.id;
      this._convocatoriaService.getConvocatoria(this.id).subscribe(data=>{
        let fecha:any[];
        fecha = data['convocatoria'][0].fecha_expedicion.split("-")

        data['convocatoria'][0].fecha_expedicion = new Date(fecha[0], fecha[1]-1, fecha[2]);

        this.bolsas = data['bolsas'];
        this.estados = data['estados'];
        this.condiciones = data['condiciones'];
        this.beneficios = data['beneficios'];
        this.cafeterias = data['cafeterias'];
        this.modalidades = data['modalidades'];
        this.dias = data['dias'];
        this.convocatoria = data['convocatoria'][0];
        for(let i = 0; i < this.convocatoria.etapas.length; i++){
          for(let j = 0; j < data['estados'].length; j++){
            if(this.convocatoria.etapas[i].estado_id == data['estados'][j].id){
              this.convocatoria.etapas[i].peso_etapa = data['estados'][j].peso;
            }
          }
        }

        if (this.convocatoria.idsBeneficios.length != 0) {
          this.tipo = this.convocatoria.idsBeneficios;
        }

        for (let j = 0; j < this.convocatoria.beneficios.length; j++) {
          for (let i = 0; i < this.tiempo.length; i++) {
            if (this.tiempo[i].id == this.convocatoria.beneficios[j].hora_inicio) {
              this.convocatoria.beneficios[j].nombre_inicio = this.tiempo[i].nombre;
              break;
            }    
          }
      
          for (let i = 0; i < this.tiempo.length; i++) {
            if (this.tiempo[i].id == this.convocatoria.beneficios[j].hora_fin) {
              this.convocatoria.beneficios[j].nombre_fin = this.tiempo[i].nombre;
              break;
            }    
          }
        }

        this.convocatoria.file_soporte = null;

        this.crearCondicion();

        this.spinner.hide();    

        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Oops...',
            text: respuesta.msg,
          });
          this.spinner.hide(); 
        })
      })

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

  modalBeneficio() {
    this.editarBenefi = false;
    this.benefi = {
      idDia:null,
      dia:null,
      idBeneficio:null,
      beneficio:null,
      valor:null,
      idCafeterias:[],
      cafeterias:[],
      hora_inicio:null,
      hora_fin:null,
      listDias:[],
      listDiasNombre:[],
      nombre_inicio:null,
      nombre_fin:null   
    };
    $('#modalBeneficio').modal('show');
  }

  modalEditarBeneficio(bene) {
    this.editarBenefi = true;
    this.index = this.convocatoria.beneficios.indexOf(bene);
    let copy = Object.assign({}, bene);
    $('#modalBeneficio').modal('show');
    this.benefi = copy;
  }
  
  agregarBeneficio(forma:NgForm){
    if(!forma.valid){
      swal(
        "Error",
        "Revise los campos y vualva a intentarlo",
        "error",
      );
      return
    }

    if (this.benefi.hora_inicio > this.benefi.hora_fin || this.benefi.hora_inicio === this.benefi.hora_fin) {
      swal(
        "Error",
        "La hora inicial no puede ser mayor o igual a la hora final",
        "error",
      );
      return
    }
    
    for (let i = 0; i < this.beneficios.length; i++) {
      if (this.beneficios[i].id == this.benefi.idBeneficio) {
        this.benefi.beneficio = this.beneficios[i].nombre;
        break;
      }    
    }

    for (let i = 0; i < this.tiempo.length; i++) {
      if (this.tiempo[i].id == this.benefi.hora_inicio) {
        this.benefi.nombre_inicio = this.tiempo[i].nombre;
        break;
      }    
    }

    for (let i = 0; i < this.tiempo.length; i++) {
      if (this.tiempo[i].id == this.benefi.hora_fin) {
        this.benefi.nombre_fin = this.tiempo[i].nombre;
        break;
      }    
    }

    if (this.tipo.length == 0) {
      this.tipo.push(this.benefi.idBeneficio);
    } else {
      for (let i = 0; i < this.tipo.length; i++) {
        if (this.tipo[i] != this.benefi.idBeneficio) {
          this.tipo.push(this.benefi.idBeneficio);
        }
      }
    }

    for (let i = 0; i < this.dias.length; i++) {
      if (this.dias[i].id == this.benefi.idDia) {
        this.benefi.dia = this.dias[i].nombre;
        break;
      }    
    }

    if(this.benefi.cafeterias.length > 0 ){
      this.benefi.cafeterias = [];
    }

    for (let i = 0; i < this.cafeterias.length; i++) {
      for (let j = 0; j < this.benefi.idCafeterias.length; j++) {
        if (this.cafeterias[i].id == this.benefi.idCafeterias[j]) {
          this.benefi.cafeterias.push(this.cafeterias[i].nombre);
        }          
      }        
  }

    if (this.convocatoria.beneficios.length > 0) {
      if (!this.editarBenefi) {
        //crear
        for (let i = 0; i < this.convocatoria.beneficios.length; i++) {
          if (this.convocatoria.beneficios[i].idBeneficio == this.benefi.idBeneficio && this.convocatoria.beneficios[i].idDia == this.benefi.idDia) {
            swal(
              "Error",
              "Esta configuraci??n de beneficio y dia ya se encuentra seleccionada",
              "error",
            );
            return
          }          
        }
        this.convocatoria.beneficios.push(this.benefi);
            this.benefi = {
              idDia:null,
              dia:null,
              idBeneficio:null,
              beneficio:null,
              valor:null,
              idCafeterias:[],
              cafeterias:[],
              hora_inicio:null,
              hora_fin:null,
              listDias:[],
              listDiasNombre:[],
              nombre_inicio:null,
              nombre_fin:null   
            };
            forma.resetForm();
            $('#modalBeneficio').modal('hide');
            swal(
              "Realizado",
              "Acci??n realizada satisfactoriamente.",
              "success",
            );
            return     
      } else {
        //editar
        for (let i = 0; i < this.convocatoria.beneficios.length; i++) {
            if (this.convocatoria.beneficios[i].idBeneficio == this.benefi.idBeneficio && this.convocatoria.beneficios[i].idDia == this.benefi.idDia && this.index != i) {
              swal(
                "Error",
                "Esta configuraci??n de beneficio y dia ya se encuentra seleccionada",
                "error",
              );
              return
            }                   
        }
        this.convocatoria.beneficios[this.index] = this.benefi;       
        this.benefi = {
          idDia:null,
          dia:null,
          idBeneficio:null,
          beneficio:null,
          valor:null,
          idCafeterias:[],
          cafeterias:[],
          hora_inicio:null,
          hora_fin:null,
          listDias:[],
          listDiasNombre:[],
          nombre_inicio:null,
          nombre_fin:null   
        };
        forma.resetForm();
        $('#modalBeneficio').modal('hide');
        swal(
          "Realizado",
          "Acci??n realizada satisfactoriamente.",
          "success",
        );
        return 
      }

    } else {
      this.convocatoria.beneficios.push(this.benefi);
      this.benefi = {
        idDia:null,
        dia:null,
        idBeneficio:null,
        beneficio:null,
        valor:null,
        idCafeterias:[],
        cafeterias:[],
        hora_inicio:null,
        hora_fin:null,
        listDias:[],
        listDiasNombre:[],
        nombre_inicio:null,
        nombre_fin:null   
      };
      forma.resetForm();
      $('#modalBeneficio').modal('hide');
      swal(
        "Realizado",
        "Acci??n realizada satisfactoriamente.",
        "success",
      );
      return
    }   
  }

  pasarFecha(fechaInicio: Date, fechaFin: Date){
    fechaFin = fechaInicio;
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.convocatoria.file_soporte=file;
    }
  }

  onClearFile(){
    this.convocatoria.file_soporte=null;
  }

  onUploadFileR(event){
    for(let file of event.files) {
      this.convocatoria.file_soporte_resolucion=file;
    }
  }

  onClearFileR(){
    this.convocatoria.file_soporte_resolucion=null;
  }

  validation(control:FormControl){
    if(control.valid==false){
      this.isValid="is-invalid";
    }else{
      this.isValid="";
    }
  }

  isFechaValid(fecha:Date, touch:boolean):string{
    if(!fecha && (this.send || touch)){
      return "is-invalid"
    }
    return "";
  }

  addEtapas(fecha_inicio:Date, fecha_fin:Date, estado_id:number, peso:number){
    this.send=true;
    if(!fecha_inicio || !fecha_fin || !estado_id  ){
      swal(
        'Error',
        'Faltan datos en el formulario',
        'error'
      )
      return
    }

    if(fecha_fin<fecha_inicio){
      swal(
        'Error',
        'la fecha final no puede ser menor o igual a la inicial',
        'error'
      )
      this.errores = [];
      return;
    }

    for(let i=0; i<this.convocatoria.etapas.length; i++){

      let inicio = new Date(fecha_inicio.getFullYear(), fecha_inicio.getMonth(), fecha_inicio.getDate(), fecha_inicio.getHours(), fecha_inicio.getMinutes());
      let final = new Date(fecha_fin.getFullYear(), fecha_fin.getMonth(), fecha_fin.getDate(), fecha_fin.getHours(), fecha_fin.getMinutes());
      let inicio2 = new Date(this.convocatoria.etapas[i].fecha_inicio.getFullYear(), this.convocatoria.etapas[i].fecha_inicio.getMonth(), this.convocatoria.etapas[i].fecha_inicio.getDate(), this.convocatoria.etapas[i].fecha_inicio.getHours(), this.convocatoria.etapas[i].fecha_inicio.getMinutes());
      let final2 = new Date(this.convocatoria.etapas[i].fecha_fin.getFullYear(), this.convocatoria.etapas[i].fecha_fin.getMonth(), this.convocatoria.etapas[i].fecha_fin.getDate(), this.convocatoria.etapas[i].fecha_fin.getHours(), this.convocatoria.etapas[i].fecha_fin.getMinutes());

      if(this.convocatoria.etapas[i].estado_id==estado_id && peso != 0){
        swal(
          'Error',
          'Ya registr?? esa etapa, Por favor registre otra',
          'error'
        )
        this.errores = [];
        return;
      }

      if(peso == 0 ){

        if(this.convocatoria.etapas[i].peso_etapa == 0){
          if(  inicio.getTime() ===  inicio2.getTime() 
          || inicio.getTime() === final2.getTime()
          || final.getTime() === final2.getTime() 
          || final.getTime() === inicio2.getTime()
          || (final.getTime() < final2.getTime() && final.getTime() > inicio2.getTime())
          || (inicio.getTime() < final2.getTime() && inicio.getTime() > inicio2.getTime())
          || (final2.getTime() < final.getTime() && inicio2.getTime() > final.getTime())
          || (final2.getTime() < inicio.getTime() && inicio2.getTime() > inicio.getTime())){
          swal(
            'Error',
            'Verifique las fechas, Hay cruce en algunas fechas',
            'error'
          )
          this.errores = [];
          return; 
        }
        }          
      }else{
        if((this.convocatoria.etapas[i].fecha_inicio!=null || this.convocatoria.etapas[i].fecha_fin !=null) && this.convocatoria.etapas[i].peso_etapa != 0){
 
          if(  inicio.getTime() ===  inicio2.getTime() 
            || inicio.getTime() === final2.getTime()
            || final.getTime() === final2.getTime() 
            || final.getTime() === inicio2.getTime()
            || (final.getTime() < final2.getTime() && final.getTime() > inicio2.getTime())
            || (inicio.getTime() < final2.getTime() && inicio.getTime() > inicio2.getTime())
            || (final2.getTime() < final.getTime() && inicio2.getTime() > final.getTime())
            || (final2.getTime() < inicio.getTime() && inicio2.getTime() > inicio.getTime())){
            swal(
              'Error',
              'Verifique las fechas, Hay cruce en algunas fechas',
              'error'
            )
            this.errores = [];
            return; 
          }
  
          if(peso > this.convocatoria.etapas[i].peso_etapa && (peso != 0 || this.convocatoria.etapas[i].peso_etapa != 0)){
            if(inicio.getTime() < inicio2.getTime()
            ||inicio.getTime() == final2.getTime()
            ||final.getTime() < inicio2.getTime()
            ||final.getTime() == final2.getTime()){
            swal(
              'Error',
              'Las fechas de esta etapa deben ser mayores a las ya ingresadas',
              'error'
            )
            this.errores = [];
            return; 
            }
          }
  
          if(peso < this.convocatoria.etapas[i].peso_etapa && (peso != 0 || this.convocatoria.etapas[i].peso_etapa != 0)){
            if(inicio.getTime() > inicio2.getTime()
            ||inicio.getTime() == final2.getTime()
            ||final.getTime() > inicio2.getTime()
            ||final.getTime() == final2.getTime()){
            swal(
              'Error',
              'Las fechas de esta etapa deben ser menores a las ya ingresadas',
              'error'
            )
            this.errores = [];
            return; 
            }
          }
      }      
    }
  }
    
    let et:Etapas={
      fecha_inicio,
      fecha_fin,
      estado_id,
      peso_etapa:peso
    };
   
    this.convocatoria.etapas.push(et);
    this.etapa.fecha_fin=null;
    this.etapa.fecha_inicio=null;
    this.etapa.estado_id=null;
    this.mostrar=false;
    $('#exampleModal').modal('hide')
    swal(
      "Realizado",
      "Acci??n realizada satisfactoriamente.",
      "success",
    );
    this.send=false;
  }

  deleteEtapas(idx){    
    swal({
      title: 'Eliminar registro',
      text: "??Esta seguro de eleminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal(
          'Registro eliminado',
          'Acci??n realizada satisfactoriamente. Presione el bot??n Guardar para efectuar los cambios realizados.',
          'success'
        )
        let index = this.convocatoria.etapas.indexOf(idx);
        this.convocatoria.etapas.splice(index,1);
      }
    })
  }

  editEtapa(idx:number){
    this.etapa.id=this.convocatoria.etapas[idx].id;
    this.etapa.estado_id=this.convocatoria.etapas[idx].estado_id;
    this.etapa.fecha_inicio=this.convocatoria.etapas[idx].fecha_inicio;
    this.etapa.fecha_fin=this.convocatoria.etapas[idx].fecha_fin;
    this.etapa.peso_etapa=this.convocatoria.etapas[idx].peso_etapa;
  }

  saveEdit(idx:number, fecha_inicio:Date, fecha_fin:Date, estado_id:number, peso:number, id:number){

    this.send=true;
    if(!fecha_inicio || !fecha_fin || !estado_id  ){
      swal(
        'Error',
        'Faltan datos en el formulario',
        'error'
      )
      return
    }

    if(fecha_fin<fecha_inicio){
      swal(
        'Error',
        'la fecha final no puede ser menor o igual a la inicial',
        'error'
      )
      this.errores = [];
      return;
    }

    for(let i=0; i<this.convocatoria.etapas.length; i++){
        let inicio = new Date(fecha_inicio.getFullYear(), fecha_inicio.getMonth(), fecha_inicio.getDate(), fecha_inicio.getHours(), fecha_inicio.getMinutes());
        let final = new Date(fecha_fin.getFullYear(), fecha_fin.getMonth(), fecha_fin.getDate(), fecha_fin.getHours(), fecha_fin.getMinutes());
        let inicio2 = new Date(this.convocatoria.etapas[i].fecha_inicio.getFullYear(), this.convocatoria.etapas[i].fecha_inicio.getMonth(), this.convocatoria.etapas[i].fecha_inicio.getDate(), this.convocatoria.etapas[i].fecha_inicio.getHours(), this.convocatoria.etapas[i].fecha_inicio.getMinutes());
        let final2 = new Date(this.convocatoria.etapas[i].fecha_fin.getFullYear(), this.convocatoria.etapas[i].fecha_fin.getMonth(), this.convocatoria.etapas[i].fecha_fin.getDate(), this.convocatoria.etapas[i].fecha_fin.getHours(), this.convocatoria.etapas[i].fecha_fin.getMinutes());
      if(i!=idx){
        if(this.convocatoria.etapas[i].estado_id==estado_id && peso != 0){
          swal(
            'Error',
            'Ya registr?? esa etapa, Por favor registre otra',
            'error'
          )
          this.errores = [];
          return;
        }

        if(peso == 0 ){
  
          if(this.convocatoria.etapas[i].peso_etapa == 0 && i != idx){
            if(  inicio.getTime() ===  inicio2.getTime() 
            || inicio.getTime() === final2.getTime()
            || final.getTime() === final2.getTime() 
            || final.getTime() === inicio2.getTime()
            || (final.getTime() < final2.getTime() && final.getTime() > inicio2.getTime())
            || (inicio.getTime() < final2.getTime() && inicio.getTime() > inicio2.getTime())
            || (final2.getTime() < final.getTime() && inicio2.getTime() > final.getTime())
            || (final2.getTime() < inicio.getTime() && inicio2.getTime() > inicio.getTime())){
            swal(
              'Error',
              'Verifique las fechas, Hay cruce en algunas fechas',
              'error'
            )
            this.errores = [];
            return; 
          }
          }          
        }else{
          if((this.convocatoria.etapas[i].fecha_inicio!=null || this.convocatoria.etapas[i].fecha_fin !=null) && this.convocatoria.etapas[i].peso_etapa != 0){
   
            if(  inicio.getTime() ===  inicio2.getTime() 
              || inicio.getTime() === final2.getTime()
              || final.getTime() === final2.getTime() 
              || final.getTime() === inicio2.getTime()
              || (final.getTime() < final2.getTime() && final.getTime() > inicio2.getTime())
              || (inicio.getTime() < final2.getTime() && inicio.getTime() > inicio2.getTime())
              || (final2.getTime() < final.getTime() && inicio2.getTime() > final.getTime())
              || (final2.getTime() < inicio.getTime() && inicio2.getTime() > inicio.getTime())){
              swal(
                'Error',
                'Verifique las fechas, Hay cruce en algunas fechas',
                'error'
              )
              this.errores = [];
              return; 
            }
    
            if(peso > this.convocatoria.etapas[i].peso_etapa && (peso != 0 || this.convocatoria.etapas[i].peso_etapa != 0)){
              if(inicio.getTime() < inicio2.getTime()
              ||inicio.getTime() == final2.getTime()
              ||final.getTime() < inicio2.getTime()
              ||final.getTime() == final2.getTime()){
              swal(
                'Error',
                'Las fechas de esta etapa deben ser mayores a las ya ingresadas',
                'error'
              )
              this.errores = [];
              return; 
              }
            }
    
            if(peso < this.convocatoria.etapas[i].peso_etapa && (peso != 0 || this.convocatoria.etapas[i].peso_etapa != 0)){
              if(inicio.getTime() > inicio2.getTime()
              ||inicio.getTime() == final2.getTime()
              ||final.getTime() > inicio2.getTime()
              ||final.getTime() == final2.getTime()){
              swal(
                'Error',
                'Las fechas de esta etapa deben ser menores a las ya ingresadas',
                'error'
              )
              this.errores = [];
              return; 
              }
            }
          }
        }      
      }
    }

    let et:Etapas={
      fecha_inicio,
      fecha_fin,
      estado_id,
      peso_etapa:peso,
      id
    };

    this.convocatoria.etapas[idx]=et; 
    this.etapa.fecha_fin=null;
    this.etapa.fecha_inicio=null;
    this.etapa.estado_id=null;
    this.etapa.id=null;
    this.mostrar=false;
    $('#exampleModal').modal('hide');
    swal(
      "Realizado",
      "Acci??n realizada satisfactoriamente.",
      "success",
    );
    this.send=false;
  }

  clearModal(){
    this.send=false;
    this.mostrar=false;
    this.etapa.estado_id=null;
    this.etapa.fecha_inicio=null;
    this.etapa.fecha_fin=null;
  }

  viewDoc(doc:number){
    this.doc=doc;
    $('#modelId').modal('show');
  }

  save(formulario:NgForm){
    if(!formulario.valid){
      swal(
        "Error",
        "Complete todos los campos del formulario",
        "error",
      );
      this.errores = [];
      if(!formulario.controls.fecha_expedicion.valid){
        this.isValid="is-invalid";
      }else{
        this.isValid="";
      }
      return
    }

    if(this.convocatoria.etapas.length==0){
      swal(
        "Error",
        "Debe registrar una etapa al menos",
        "error",
      );
      this.errores = [];
      return
    }

    if(this.convocatoria.modalidades.length==0){
      swal(
        "Error",
        "Debe registrar una modalidad estudiantil al menos",
        "error",
      );
      this.errores = [];
      return
    }

    if(this.convocatoria.condiciones.length==0){
      swal(
        "Error",
        "Debe registrar una condici??n al menos",
        "error",
      );
      this.errores = [];
      return
    }
 
    if (this.tipo.length < this.convocatoria.cantidad_beneficios) {
      swal(
        "Error",
        "La cantidad m??xima de beneficios no puede superar los beneficios de la convocatoria",
        "error",
      );
      this.errores = [];
      return
    }

    for(let i=0; i<this.convocatoria.etapas.length; i++){
      if(this.convocatoria.etapas[i].fecha_inicio==null && this.convocatoria.etapas[i].fecha_fin==null){
        swal(
          "Error",
          "Las fechas de las etapas no pueden quedar vac??as",
          "error",
        );
        this.errores = [];
        return;
      }
    }

    if(this.convocatoria.beneficios.length==0){
      swal(
        "Error",
        "Debe registrar un beneficio al menos",
        "error",
      );
      this.errores = [];
      return
    } 
    this.spinner.show();
    //creacion formData
    let formData = new FormData();
    formData.append("id", ""+this.convocatoria.id);
    formData.append("estado", ""+this.convocatoria.estado);
    formData.append('tipo_id', ""+this.convocatoria.tipo_id);
    formData.append('bolsa_presupuestal_id', ""+this.convocatoria.bolsa_presupuestal_id);
    formData.append('fecha_expedicion', this.convocatoria.fecha_expedicion.toDateString());
    if(this.convocatoria.file_soporte!=null){
      formData.append('file_soporte', this.convocatoria.file_soporte);
    }
    if(this.convocatoria.file_soporte_resolucion!=null){
      formData.append('file_soporte_resolucion', this.convocatoria.file_soporte_resolucion);
    }
    if(this.convocatoria.descripcion){
      formData.append('descripcion', this.convocatoria.descripcion);
    }
    formData.append('titulo', this.convocatoria.titulo);
    if(this.convocatoria.restricciones.length != 0){
      for (let index = 0; index < this.convocatoria.restricciones.length; index++) {
        formData.append('restricciones[]', ""+this.convocatoria.restricciones[index]);   
      }
    }
    for (let index = 0; index < this.convocatoria.modalidades.length; index++) {
      formData.append('modalidades[]', ""+this.convocatoria.modalidades[index]);   
    }
    formData.append('fallas', ""+this.convocatoria.fallas);
    formData.append('estrato', ""+this.convocatoria.estrato);
    formData.append('cantidad_beneficios', ""+this.convocatoria.cantidad_beneficios);
    formData.append('etapasString', JSON.stringify(this.convocatoria.etapas));
    formData.append('beneficiosString', JSON.stringify(this.convocatoria.beneficios));
    formData.append('condicionesString', JSON.stringify(this.convocatoria.condiciones));

    this._convocatoriaService.editarConvocatoria(formData).subscribe(data=>{
      if(data['success']==true){
        swal({
          title: "Realizado",
          text: "Acci??n realizada satisfactoriamente.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });        
        this.errores = [];
        setTimeout(() => {
          this.router.navigate(['/convocatoriasRefrigerio']);
        }, 1500);
      }else{
        for(let i=0; i<data['errores'].length; i++){
          if(data['errores'][i].errores.length>0){
            swal({
              type: 'error',
              title: 'Error',
              text: data['errores'][i].errores[0]['ErrorMessage'],
            });
          }
        }
      }
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
      this.spinner.hide();  
    })
  } 

  deleteBeneficio(idx){    
    swal({
      title: 'Eliminar registro',
      text: "??Esta seguro de eleminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal(
          'Registro eliminado',
          'Acci??n realizada satisfactoriamente. Presione el bot??n Guardar para efectuar los cambios realizados.',
          'success'
        )
        let index = this.convocatoria.beneficios.indexOf(idx);
        this.convocatoria.beneficios.splice(index,1);
      }
    })
  }

  changePeso(estado_id){
    debugger;
    for (let i = 0; i < this.estados.length; i++) {
      if(this.estados[i].id== estado_id){
        this.etapa.peso_etapa = this.estados[i].peso;
        this.etapa.id = 0;
      }
    }
  }

  changeTitulo(id:number){

    let result = this.bolsas.find(obj => obj.id==id);

    this.convocatoria.titulo ='';

    if(this.convocatoria.titulo =='' || !this.convocatoria.titulo){
      this.convocatoria.titulo = "Convocatoria " + result['periodo']+" - " 
    }
    // }else{
    //   let titulo = this.convocatoria.titulo.split(" - ");
    //   if(titulo[1]){
    //     this.convocatoria.titulo = "Convocatoria " + result['periodo']+ " - " + titulo[1] 
    //   }else{
    //     this.convocatoria.titulo = "Convocatoria " + result['periodo']+ " - " + titulo[0] 
    //   }
    // }
  }

  modalCondiciones() {
    this.condicion = {
      id:null,
      condicion_id:null,
      condicion:null,
      numero_fallas:null,
      cantidad_beneficios:null,
      validar_horario:null,
      peso:null,
      estrato:null 
    };
    
    this.crearCondicion();

    let copy = Object.assign([], this.convocatoria.condiciones);
    this.condicions = copy;
    $('#collapseNuevaCondicion').collapse('hide');
    $('#agregarCondicion').modal('show');
    $('[rel="tooltip"]').tooltip();
  }

  modalEditarCondicion(condi) {
    this.crearCondicion();
    this.index = this.convocatoria.condiciones.indexOf(condi);
    let copy = Object.assign({}, condi);
    $('#editarCondicion').modal('show');
    this.condicion = copy;
  }

  deleteCondicion(idx){    
    swal({
      title: 'Eliminar registro',
      text: "??Esta seguro de eleminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal(
          'Registro eliminado',
          'Acci??n realizada satisfactoriamente. Presione el bot??n Guardar para efectuar los cambios realizados.',
          'success'
        )
        let index = this.convocatoria.condiciones.indexOf(idx);
        this.convocatoria.condiciones.splice(index,1);
      }
    })
  }

  agregarCondicion(formulario:NgForm){
    if(!formulario.valid){
      swal(
        "Error",
        "Complete los campos obligatorios",
        "error",
      );
      this.errores = [];
      return
    }

    for (let i = 0; i < this.condicions.length; i++) {
      if (this.condicions[i].condicion_id == this.condicion.condicion_id) {
        swal(
          "Error",
          "Este beneficio ya se encuentra agregado",
          "error",
        );
        this.errores = [];
        return
      }    
    }

    for (let i = 0; i < this.condiciones.length; i++) {
      if (this.condiciones[i].id == this.condicion.condicion_id) {
        this.condicion.condicion = this.condiciones[i].nombre;
        break;
      }
    }

    if (this.tipo.length < this.condicion.cantidad_beneficios) {
      swal(
        "Error",
        "La cantidad de beneficios no puede superar los beneficios de la convocatoria",
        "error",
      );
      this.errores = [];
      return
    }

    this.condicions.push(this.condicion);

    this.condicion = {
      id:null,
      condicion_id:null,
      condicion:null,
      numero_fallas:null,
      cantidad_beneficios:null,
      validar_horario:null,
      peso:null,
      estrato:null 
    };
    formulario.resetForm();
  }

  eliminarCondicion(id:number){
    for (let i = 0; i < this.condicions.length; i++) {
      if (this.condicions[i].condicion_id == id) {
        this.condicions.splice(i,1);
      }
    }
  }

  anadirCondiciones(){
    let copy = Object.assign([], this.condicions);
    this.convocatoria.condiciones = copy;
    $('#agregarCondicion').modal('hide');
    swal(
      "Realizado",
      "Acci??n realizada satisfactoriamente.",
      "success",
    );
  }

  editarCondicion(formulario:NgForm){
    if(!formulario.valid){
      swal(
        "Error",
        "Complete los campos obligatorios",
        "error",
      );
      this.errores = [];
      return
    }

    for (let i = 0; i < this.convocatoria.condiciones.length; i++) {
      if (this.convocatoria.condiciones[i].condicion_id == this.condicion.condicion_id && this.index != i) {
        swal(
          "Error",
          "Este beneficio ya se encuentra agregado",
          "error",
        );
        this.errores = [];
        return
      }    
    }

    if (this.tipo.length < this.condicion.cantidad_beneficios) {
      swal(
        "Error",
        "La cantidad de beneficios no puede superar los beneficios de la convocatoria",
        "error",
      );
      this.errores = [];
      return
    }

    for (let i = 0; i < this.condiciones.length; i++) {
      if (this.condiciones[i].id == this.condicion.condicion_id) {
        this.condicion.condicion = this.condiciones[i].nombre;
        break;
      }
    }

    for (let i = 0; i < this.convocatoria.condiciones.length; i++) {
      if (this.convocatoria.condiciones[i].condicion_id == this.condicion.condicion_id) {
        this.convocatoria.condiciones[i] = this.condicion;
      }     
    }

    this.condicion = {
      id:null,
      condicion_id:null,
      condicion:null,
      numero_fallas:null,
      cantidad_beneficios:null,
      validar_horario:null,
      peso:null,
      estrato:null 
    };
    formulario.resetForm();
    $('#editarCondicion').modal('hide');
    swal(
      "Realizado",
      "Acci??n realizada satisfactoriamente.",
      "success",
    );
  }

  crearCondicion(){
    if (this.convocatoria.restricciones.length > 0) {
      let condiciones:Condiciones[] = [];
      for (let i = 0; i < this.condiciones.length; i++) {
        for (let j = 0; j < this.convocatoria.restricciones.length; j++) {
          if (this.condiciones[i].id == this.convocatoria.restricciones[j]) {
            condiciones.push(this.condiciones[i]);
          }     
        }    
      }
      this.condicionesRespaldo = condiciones; 
    }else{
      this.condicionesRespaldo = this.condiciones;
    }
  }

}
