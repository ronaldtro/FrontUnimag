import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PlazaService } from 'src/app/services/plaza.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-ver-plaza',
  templateUrl: './ver-plaza.component.html',
  styleUrls: ['./ver-plaza.component.css']
})
export class VerPlazaComponent implements OnInit, AfterViewInit {
  

  plaza: any = {
    asignaturas: [],
    facultades: [],
    programas: [],
    actividades: []
  };
  facultades: object[] = [];
  programas: object[] = [];
  solicitudPlaza: any = {};
  messageService: any;

  userService:UserService;
  constructor(private _plazaService: PlazaService, private route: ActivatedRoute, private router: Router, private _userService: UserService, private _location: Location, private spinner: NgxSpinnerService) {
    this.userService = _userService;
    route.params.subscribe(parametros => {
      if (parametros['id'] !== undefined) {
        this.plaza.id = parametros['id'];
      }
    });
  }

  ngOnInit() {
    this.spinner.show();
    this._plazaService.getDetallePlazaSolicitada(this.plaza.id).subscribe(data => {
      if (data['success']) {
        this.plaza = data['retornado'];
        this.facultades = data['facultades'];
        this.programas = data['programas'];
      }
      this.plaza.perfil = this.sentenceCase(this.plaza.perfil.toLowerCase());
      this.plaza.competencias_requeridas = this.plaza.competencias_requeridas != null ? this.sentenceCase(this.plaza.competencias_requeridas.toLowerCase()) : null;
      this.plaza.convocatoria = this.sentenceCase(this.plaza.convocatoria.toLowerCase());
      for(let i = 0; i < this.plaza.asignaturas.length; i++){
        this.plaza.asignaturas[i].nombre = this.sentenceCase(this.plaza.asignaturas[i].nombre.toLowerCase());
      }
      for(let i = 0; i < this.plaza.actividades.length; i++){
        this.plaza.actividades[i].descripcion = this.sentenceCase(this.plaza.actividades[i].descripcion.toLowerCase());
      }
      this.spinner.hide();
    });
    
    
  }

  ngAfterViewInit(): void {
    // let arr = $('.form-control-plaintext');
    //   console.log(arr);
    //   for(var i = 0; i < arr.length; i++){
    //     arr[i].innerText = this.sentenceCase(arr[i].innerText.toLowerCase());
    //   }
  }

  sentenceCase(input) {
    input = ( input === undefined || input === null ) ? '' : input;
    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\.|\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
    return match.toUpperCase();
    });
   }

  backClicked() {
    this._location.back();
  }

  solicitudP(obj) {
    let copy = Object.assign({}, obj);
    console.log(copy);
    $('#solicitud').modal('show');
    this.solicitudPlaza = copy;
  }

  responderSolicitud(forma: NgForm) {
    if (!forma.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Complete los campos del formulario" });
    }
    else {
      swal({
        title: 'Responder solicitud',
        text: '¿Está seguro de realizar esta ación?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        reverseButtons:true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then((res) => {
        if (res.value) {
          this.spinner.show();
          this._plazaService.postAprobarPlaza(this.solicitudPlaza).subscribe(data => {
            forma.resetForm(this.solicitudPlaza);
            this.spinner.hide();
            $('#solicitud').modal('hide');
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha cambiado el estado de solicitud a " + data['objRetornado'].estadoNombre,
              timer: 2000,
              showConfirmButton: false
            });
            this._location.back();
          }, err =>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });
            this.spinner.hide()
          });
        } else if (res.dismiss === swal.DismissReason.cancel) {
          forma.resetForm(this.solicitudPlaza);
        }
      });
    }
  }

}
