import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioCafeteriaService } from 'src/app/services/usuario-cafeteria.service';
import { Usuarios } from 'src/app/interfaces/usuarios.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-usuarios-cafeteria',
  templateUrl: './usuarios-cafeteria.component.html',
  styleUrls: ['./usuarios-cafeteria.component.css']
})
export class UsuariosCafeteriaComponent implements OnInit, OnDestroy {

  usuarios: Usuarios[] = [];
  rolesSelect:any[] = [];
  cafeterias:any[] = [];
  tipoIdentificaciones:any[] = [];
  errores:object[]=[];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;
  usuario:Usuarios = {
    id:null,
    nombres:null,
    identificacion:null,
    email:null,
    estado:null,
    sexo:null,
    roles:[],
    cafeteria_id:null,
    tipo:null,
    direccion:null,
    fecha:null
  };
  es: any;
  dateNow: Date; 

  constructor(private _usuarioService:UsuarioCafeteriaService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef, private funciones: FuncionesJSService) { }

  ngOnInit() {
    this.spinner.show();
    this._usuarioService.getDatos().subscribe(data => {
      let fecha:any[];    
      for(let i=0; i < data['usuarios'].length; i++){
        if (data['usuarios'][i].fecha != null) {
          fecha = data['usuarios'][i].fecha.split("-");
          data['usuarios'][i].fecha = new Date(fecha[0], fecha[1]-1, fecha[2]); 
        }            
      }

      this.usuarios = data["usuarios"];
      this.rolesSelect = data["roles"];
      this.cafeterias = data["cafeterias"];
      this.tipoIdentificaciones = data["tipoIdentificacion"];     

      this.initDtOptions();
      this.dtTrigger.next();

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.column(3).visible(false);
        dtInstance.column(4).visible(false);
      });

      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
      this.spinner.hide(); 
    });

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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  modalCrearUsuario(){
    this.errores = [];
    this.usuario = {
      id:null,
      nombres:null,
      identificacion:null,
      email:null,
      estado:null,
      sexo:null,
      roles:[],
      cafeteria_id:null,
      tipo:null,
      direccion:null,
      fecha:null
    };
    $('#crearUsuario').modal('show');
  }

  guardarUsuario(formulario:NgForm){   
    if(!formulario.valid || this.usuario.roles.length == 0){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    }
    this.spinner.show();
    this._usuarioService.guardarUsuario(this.usuario).subscribe(data => {
      if(data.json().success){

        let fecha:any[];
        fecha = data.json().usuario.fecha.split("-");
        data.json().usuario = new Date(fecha[0], fecha[1]-1, fecha[2]);     

        if(this.usuario.id == null){
          this.usuarios.push(data.json().usuario);
        }else{
          for (let index = 0; index < this.usuarios.length; index++) {
            if (this.usuarios[index].id == this.usuario.id) {
              this.usuarios[index] = data.json().usuario;
            }
          }
        }

        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });        
        setTimeout(() => {
          $('#crearUsuario').modal('hide');
          this.spinner.hide();
          this.errores = [];
          this.usuario = {};
          //this.router.navigate(['/unidades']);
        }, 2000);
      }else{
        this.errores = data.json().errores;
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        this.spinner.hide();
      }
      
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
  }
  
  modalEditarUsuario(usuario){
    let copy = Object.assign({}, usuario);
    this.errores = [];
    this.usuario = copy;
    $('#crearUsuario').modal('show');
  }

  cambiarEstado(usuario){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._usuarioService.cambiarEstado(usuario.id).subscribe(data => {
          if(data.json().success){
            for (let index = 0; index < this.usuarios.length; index++) {
              if (this.usuarios[index].id == usuario.id) {
                this.usuarios[index].estado = !this.usuarios[index].estado;
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
              text: 'El usuario no se encuentra registrada en la base de datos',
            });
          }
          this.spinner.hide();
        });
      }
    })
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 2, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3,  4, 5, 6, 7, 8]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3,  4, 5, 6, 7, 8]
        }
      }
    ];
  }

}
