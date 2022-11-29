import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

import { MessageService } from 'primeng/api';
import { ProgramaService } from 'src/app/services/programas.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any


@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css'],
  providers: [MessageService]
})
export class ProgramasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;


  programa: any = {
    id: null,
    nombre: null,
    facultadId: null,
    estado: null,
    codigo: null
  }

  programas: any = [];
  facultades: any = [];

  index: number = 0;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = DTConfig.dtConf;
  errores: Message[] = [];



  constructor(private _programasService: ProgramaService, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this._programasService.getDatosProgramas().subscribe(data => {
      this.programas = data['datosProgramas'];
      this.facultades = data['datosFacultades'];
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  crear() {
    this.errores = [];
    this.programa = { nombre: null, estado: true, facultadId: null };
    $('#crearPrograma').modal('show');
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
      this.spinner.show();
      this._programasService.postCrearPrograma(this.programa)
        .subscribe(data => {
          if (data['success']) {
            this.programas.push(data['objRetornado']);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#crearPrograma').modal('hide');
            forma.resetForm(this.programa);
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
          this.spinner.hide();
        });
    }
  }


  editar(obj) {
    this.errores = [];
    this.index = this.programas.indexOf(obj);
    let copy = Object.assign({}, obj);
    $('#editarPrograma').modal('show');
    this.programa = copy;
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
      this.spinner.show();
      this._programasService.postEditarPrograma(this.programa)
        .subscribe(data => {
          if (data['success']) {
            this.programas[this.index] = data['objRetornado'];
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#editarPrograma').modal('hide');
            forma.resetForm(this.programa);
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
          this.spinner.hide();
        });
    }
  }

  estadoDato(obj) {
    swal({
      title: 'Cambiar estado',
      text: '¿Está seguro de realizar esta acción?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        this._programasService.postEstadoPrograma(obj).subscribe(data => {
          let index = this.programas.indexOf(obj);
          this.programas[index] = data['objRetornado'];
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha cambiado el estado satisfactoriamente.",
            timer: 2000,
            showConfirmButton: false
          });
          this.spinner.hide();
        });

      } else if (res.dismiss === swal.DismissReason.cancel) {
        // swal({
        //   type: "error",
        //   title: "Cancelado",
        //   text: "Se ha cancelado la acción.",
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
    });
  }
}
