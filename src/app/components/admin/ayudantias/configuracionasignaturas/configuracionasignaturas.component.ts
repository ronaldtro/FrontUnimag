import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { ConfiguracionAsignaturasService } from 'src/app/services/configuracion-asignaturas.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $:any; 
declare var jQuery:any;
@Component({
  selector: 'app-configuracionasignaturas',
  templateUrl: './configuracionasignaturas.component.html',
  styleUrls: ['./configuracionasignaturas.component.css']
})
export class ConfiguracionasignaturasComponent implements OnInit {
  errores: any[] = [];
  busqueda:any = {
    asignatura:undefined,
    equivalente:undefined
  }
  /*asignaturasPadres:any[] = [{'nombre':"Español",'codigo':"d-2",'id':1,'hijas':[]},
                       {'nombre':"Español",'codigo':"d-1",'id':2,'hijas':[]},
                       {'nombre':"Naturales",'codigo':"d-3",'id':3,'hijas':[]},
                       {'nombre':"Física",'codigo':"d-4",'id':4,'hijas':[]},
                       {'nombre':"Ecuaciones",'codigo':"d-5",'id':5,'hijas':[]},
                       {'nombre':"Algoritmos",'codigo':"d-6",'id':6,'hijas':[]},
                       {'nombre':"Discretas",'codigo':"d-7",'id':7,'hijas':[]}
                      ];
  
  asignaturasHijas:any[] = [{'nombre':"INGLES II: RECEPCION, HABITACIONES Y SERVICIOS",'codigo':"7-3480",'id':8,'hijas':[]},
    {'nombre':"Estadísticas",'codigo':"d-8",'id':9,'hijas':[]},
    {'nombre':"Calor",'codigo':"d-9",'id':10,'hijas':[]},
    {'nombre':"Electricidad",'codigo':"d-10",'id':11,'hijas':[]},
    {'nombre':"Estructura de datos",'codigo':"d-11",'id':12,'hijas':[]},
    {'nombre':"Cálculo",'codigo':"d-12",'id':13,'hijas':[]},
    {'nombre':"Razonamiento",'codigo':"d-13",'id':14,'hijas':[]}
  ];*/
  asignaturasPadres:any[] = [];
  asignaturasHijas:any[] = [];
  asigPadre:any=null;
  asigHijas:any[] = [];
  detalleAsignatura:any={'hijas':[]};
  constructor(private _configuracionAsignaturasService:ConfiguracionAsignaturasService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService) {  
      this.spinner.show();
      this._configuracionAsignaturasService.getAsignaturas().subscribe(data => {
        this.asignaturasPadres = data['asignaturasPadres'];
        this.asignaturasHijas = data['asignaturasHijas'];
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

  ngOnInit() {
  }
  agregarAsignaturas(){
    this.spinner.show();
    if (this.asigPadre == null || this.asigHijas == null || this.asigHijas.length == 0) {
      swal({
        type: "error",
        title: "Error",
        text: "Debe seleccionar la asignatura padre y las que hacen referencia a la misma.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    }
    this._configuracionAsignaturasService.guardarAsignaturas(this.asigPadre,this.asigHijas).subscribe(data => {
      if(data['success']){
        for(let i=0;i<this.asignaturasPadres.length;i++){
          if(this.asignaturasPadres[i].id == this.asigPadre){
            for(let j=0;j<this.asigHijas.length;j++){
              this.asignaturasPadres[i].hijas.push(this.asigHijas[j]);
              for(let k=0;k<this.asignaturasHijas.length;k++){
                if(this.asigHijas[j].id == this.asignaturasHijas[k].id){
                  this.asignaturasHijas.splice(k, 1);
                  this.busqueda.equivalente = "";
                  this.busqueda.asignatura = "";
                  break;
                }
              }
              
            }
            this.asigHijas = [];
            break;
          }
        }
        this.spinner.hide();
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
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
  verAsignaturas(asignatura){
    this.errores = [];
    this.detalleAsignatura = asignatura;
    $('#verDetalleAsignatura').modal('show');
  }
  eliminarRelacion(asignatura){
    this.errores = [];
    this.spinner.show();
    this._configuracionAsignaturasService.quitarAsignatura(asignatura.id).subscribe(data => {
      if(data['success']){
        for(let i=0;i<this.detalleAsignatura.hijas.length;i++){
          if(this.detalleAsignatura.hijas[i].id == asignatura.id){
            this.asignaturasHijas.push(asignatura);
            this.detalleAsignatura.hijas.splice(i, 1);
            this.busqueda.equivalente = "";
            this.busqueda.asignatura = "";
            break;
          }
        }
        this.spinner.hide();
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
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
  actualizar(){
    this.errores = [];
    this.spinner.show();
    this._configuracionAsignaturasService.actualizarAsignaturas().subscribe(data => {
      if(data['success']){
        this.asignaturasPadres = data['asignaturasPadres'];
        this.asignaturasHijas = data['asignaturasHijas'];
        this.busqueda.equivalente = "";
        this.busqueda.asignatura = "";
        this.spinner.hide();
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
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

  buscar(){
    this.asignaturasPadres = this.asignaturasPadres.filter((item:any) => {return item.nombre.indexOf(this.busqueda.asignatura) != -1});
    this.asignaturasHijas = this.asignaturasHijas.filter((item:any) => {return item.nombre.indexOf(this.busqueda.equivalente) != -1});
  }
}
