import { Component, OnInit } from '@angular/core';
import { FacultadesService } from 'src/app/services/facultades.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Periodo } from 'src/app/interfaces/periodo.interface';
import { Message } from 'primeng/components/common/api';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-facultades',
  templateUrl: './facultades.component.html',
  styleUrls: ['./facultades.component.css'],
  providers: [MessageService]
})
export class FacultadesComponent implements OnInit {

  facultad: any = {
    nombre: null,
    estado: null
  }

  facultades: any = []

  index: number = 0;
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = DTConfig.dtConf;
  periodos: Periodo[] = [];
  errores:Message[]=[];



  constructor(private _facultadesService: FacultadesService, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this._facultadesService.getDatosFacultades().subscribe(data => {
      this.facultades = data['datosFacultades'];
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  crear() {
    this.errores = [];
    this.facultad = { nombre: null, estado: true };
    $('#crearFacultad').modal('show');
  }

  guardar(forma: NgForm) {
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this._facultadesService.postCrearFacultad(this.facultad)
        .subscribe(data => {
          if (data['success']) {
            this.facultades.push(data['objRetornado']);
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 1500,
              showConfirmButton: false
            });
            $('#crearFacultad').modal('hide');
            forma.resetForm(this.facultad);
          } else {
            for (let i = 0; i < data['errores'].length; i++) {
              if (data['errores'][i].errores.length > 0) {
                swal({
                  type: "error",
                  title: "Error",
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                  timer: 2000,
                  showConfirmButton: false
                });
              }
            }
          }
        });
    }
  }
  editar(obj) {
    this.errores = [];
    this.index = this.facultades.indexOf(obj);
    let copy = Object.assign({}, obj);
    $('#editarFacultad').modal('show');
    this.facultad = copy;
  }
  
  editarGuardar(forma: NgForm) {
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this._facultadesService.postEditarFacultad(this.facultad)
        .subscribe(data => {
          if (data['success']) {
            this.facultades[this.index] = data['objRetornado'];
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#editarFacultad').modal('hide');
            forma.resetForm(this.facultad);
          } else {
            for (let i = 0; i < data['errores'].length; i++) {
              if (data['errores'][i].errores.length > 0) {
                swal({
                  type: "error",
                  title: "Error",
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                  timer: 2000,
                  showConfirmButton: false
                });
              }
            }
          }
        });
    }
  }

  estadoDato(obj) {
    swal({
      title: 'Cambiar estado',
      text: '¿Está seguro de cambiar el estado?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    }).then((res) => {
      if (res.value) {
        this._facultadesService.postEstadoFacultad(obj).subscribe(data => {
          let index = this.facultades.indexOf(obj);
          this.facultades[index] = data['objRetornado'];;
        });
        swal({
          type: "success",
          title: "Realizado",
          text: "Se ha cambiado el estado satisfactoriamente.",
          timer: 2000,
          showConfirmButton: false
        });
      } else if (res.dismiss === swal.DismissReason.cancel) {
        swal({
          type: "error",
          title: "Cancelado",
          text: "Se ha cancelado la acción.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }




}
