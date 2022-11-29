import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecepcionService } from 'src/app/services/recepcion.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Estudiante } from '../../../../interfaces/convocatoria-refrigerio.interface';
import { EstudiantesService } from 'src/app/services/estudiantes.service';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit, AfterViewChecked {

  @ViewChild("codigoInput") input: ElementRef;
  estudiante:Estudiante = new Estudiante();
  id:number;
  beneficio:any={};
  errores2:Message[]=[];
  errores:Message[]=[];
  consult:any={};
  codigo:string;
  cantidadEntregas:number = 0;
  today:Date = new Date();

  constructor(private _recepcionServices:RecepcionService,
    private _estudianteService: EstudiantesService,
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._recepcionServices.getBeneficio(this.id).subscribe(data=>{
        if(data['success']){
          this.beneficio = data['beneficio'];
          this.cantidadEntregas = data['cantidadEntregas'];
          //prueba debounceTime
          fromEvent(this.input.nativeElement, 'keyup').pipe(
            // get value
            map((event: any) => {
              return event.target.value;
            })
            // if character length greater then 2
            ,filter(res => res.length >= 10)
            // Time in milliseconds between key events
            ,debounceTime(1000)        
            // If previous query is diffent from current   
            // ,distinctUntilChanged()
            // subscription for response
            ).subscribe((text: string) => {
              // console.log(text);
              let codigo:string = this.codigo.replace("#","");
              this.consult.codigo = codigo.replace("*","");
              this.limpiar();
              this.consulta();
            });
        }else{
          if(data['errores']){
            this.errores2.push(data['errores']);
          }
        }
        this.input.nativeElement.focus();
        this.spinner.hide();    
        },      
        err=>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            this.spinner.hide();  
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            }); 
          })
      });



  }

  ngAfterViewChecked():void{
    
    this.input.nativeElement.focus();
  }

  consulta(){
    if (this.consult.codigo == null) {
      swal(
        "Error",
        "Debe ingresar un código del estudiante",
        "error",
      );
      return
    }

    this.spinner.show();

    this.consult.beneficio = this.beneficio.id;

    this._recepcionServices.consulta(this.consult).subscribe(data=>{
      if(data['success']==true){
        this.estudiante = data['estudiante'];
        this._estudianteService.getFotoEstudiante(this.estudiante.codigo + "").subscribe((data:string) => {
          this.estudiante.foto = data;
        });
        this.cantidadEntregas = data['cantidadEntregas'];       
        this.errores = [];
        this.input.nativeElement.value = ''; 
        this.input.nativeElement.focus();
      }else{
        this.input.nativeElement.value = '';
        this.input.nativeElement.focus();
        if (data['estudiante'] != null) {
          this.estudiante = data['estudiante'];
          this._estudianteService.getFotoEstudiante(this.estudiante.codigo + "").subscribe((data:string) => {
            this.estudiante.foto = data;
          });
          this.cantidadEntregas = data['cantidadEntregas'];
          for(let i=0; i<data['errores'].length; i++){          
            if(data['errores'][i].errores.length>0){
              this.errores.push(data['errores'][i].errores[0]['ErrorMessage']);
            }         
          }
        } else {
          for(let i=0; i<data['errores'].length; i++){          
            if(data['errores'][i].errores.length>0){
              this.errores.push(data['errores'][i].errores[0]['ErrorMessage']);
            }         
          }
        }
      }
      this.spinner.hide();
    }, err=> {
      this.spinner.hide();
      this.input.nativeElement.value = ''; 
      this.input.nativeElement.focus();
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      }); 
    })

  }

  foco(event) {
      this.input.nativeElement.focus();
    }

    limpiar(){
      this.estudiante = new Estudiante();
      this.codigo = null;     
      this.errores = [];
      this.input.nativeElement.value = ''; 
      this.input.nativeElement.focus();
    }
    
}
