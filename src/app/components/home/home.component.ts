import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Api, Convocatoria, EtapasAyudantias, EtapasMonitorias, EtapasRefrigerios } from 'src/app/class/api';
import { TiposConvocatorias } from "src/app/class/api";
import { HttpErrorResponse } from '@angular/common/http';
declare var jQuery: any;
declare var $: any;

//Servicios
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import { PlazasPService } from 'src/app/services/plazas-p.service';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-home',
  //encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any = {
    codigo: null,
    codigo_monitorias: null
  };
  convocatoria: any = {};
  convocatoriaMonitoria: any = {};
  mostrarEntrevistas: Boolean = false;
  finInscripcion: Date;
  finEntrevista: Date;
  fechaTemporal: Date = new Date();
  etapaTemporal: any = null;
  api = Api.dev;
  urlDoc: string;
  convocatoriasRefrigerio: any[] = [];
  tiposConvocatorias = TiposConvocatorias;
  etapasAyudantias = EtapasAyudantias;
  etapasMonitorias = EtapasMonitorias;
  etapasRefrigerios = EtapasRefrigerios;
  userService: UserService;
  convocatoriasAyudantias: Convocatoria[];
  convocatoriasMonitorias: Convocatoria[];
  convocatoriasRefrigerios: Convocatoria[];

  constructor(private spinner: NgxSpinnerService,
    private _convocatoriaP: ConvocatoriaPService,
    private convocatoriaRefrigerios: ConvocatoriaRefrigerioService,
    private _plazaP: PlazasPService, private router: Router, private _userService: UserService) {

    this.userService = _userService;

  }

  ngOnInit() {
    this.spinner.show();

    this.getConvocatoria(TiposConvocatorias.AYUDANTIA).then((data: Convocatoria[]) => {
      this.convocatoriasAyudantias = data;
    });
    this.getConvocatoria(TiposConvocatorias.MONITORIA).then((data: Convocatoria[]) => {
      this.convocatoriasMonitorias = data;
    });
    this.getConvocatoria(TiposConvocatorias.REFRIGERIOS).then((data: Convocatoria[]) => {
      this.convocatoriasRefrigerios = data;
    });

    this._convocatoriaP.getConvocatoriaActiva().subscribe(data => {
      this.convocatoria = data['convocatoria'];
      this.convocatoriaMonitoria = data['convocatoriaMonitoria'];
      // let today = Date.now();
      let today = new Date(data['fechaActual'] + "T00:00:00Z");

      this.procesarConvocatoria(this.convocatoria, 1, today);
      this.procesarConvocatoria(this.convocatoriaMonitoria, 3, today);

      this.spinner.hide();
    }, err => {
      console.log(err)
      this.spinner.hide();
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    });

    this.convocatoriaRefrigerios.getConvocatoriasInscripcion().subscribe((data: any) => {
      this.convocatoriasRefrigerio = data;
      this.spinner.hide();
    });

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
  /**
   * Permite mostrar correctamente la etapa de una convocatoria para que siempre muestre una etapa a pesar que no tenga etapa activa
   * 
   * @param convocatoria convocatoria a procesar
   */
  procesarConvocatoria(convocatoria: any, tipo_convocatoria: number, todayServer: Date): void {
    if (convocatoria != null) {
      if (convocatoria.etapaActual == null) {
        let etapa_min: number = (tipo_convocatoria == 1) ? 3 : 4;
        convocatoria.etapas = convocatoria.etapas.filter(function (a) {
          return a.id > etapa_min;
        });

        // let testDates = [{fechaFin:"2019-02-07"}, {fechaFin:"2019-02-13"}, {fechaFin:"2019-02-14"},{fechaFin:"2019-02-18"},{fechaFin:"2019-02-19"}, {fechaFin:"2019-06-07"}, {fechaFin:"2019-06-10"}, {fechaFin:"2019-06-17"}]

        convocatoria.etapas.sort(function (a, b) {
          return new Date(b.fechaFin + "T00:00:00Z").getTime() - new Date(a.fechaFin + "T00:00:00Z").getTime();
        });

        convocatoria.etapaActual = convocatoria.etapas.filter(function (a) {
          return (todayServer.getTime() - new Date(a.fechaFin + "T00:00:00Z").getTime()) > 0;
        })[0];

      }

    }

    // if(todayServer <= this.finEntrevista && todayServer > this.finInscripcion){
    //   this.mostrarEntrevistas = true;
    // }
  }

  /**
   * Permite enviar el formulario para consultar plazas disponibles según el código ingresado
   * @param forma formulario
   * @param tipoConvocatoria tipo de convocatoria
   * @param convocatoria convocatoria a consultar
   */
  submitAction(forma: NgForm, tipoConvocatoria: number, convocatoria: Convocatoria) {
    if (!forma.valid) {
      return;
    }
    if (tipoConvocatoria == 1) {
      this.router.navigate(['/plazasConvocatorias', convocatoria.id, this.user.codigo]);
    } else {
      this.router.navigate(['/plazasConvocatorias', convocatoria.id, this.user.codigo_monitorias]);
    }


  }

  viewDoc(doc: string) {
    this.urlDoc = doc;
    $('#modelId').modal('show');
  }

  /**
   * Permite obtener el listado de convocatorias según el tipo de convocatoria indicado y lo asigna en el array de convocatoria dado.
   * @param arrConvocatoria Array de convocatoria
   * @param tipo_convocatoria tipo de convocatoria
   */
  getConvocatoria(tipo_convocatoria: number): Promise<Convocatoria[]> {
    return new Promise((resolve, reject) => {
      this.spinner.show();
      this._convocatoriaP.getConvocatoriasPorTipo(tipo_convocatoria).subscribe((data: Convocatoria[]) => {

        this.spinner.hide();
        resolve(data);
      }, (err: HttpErrorResponse) => {
        swal({
          type: 'error',
          title: 'Error',
          text: err.error,
        });
        console.error(err.error);
        reject(err.error);
        this.spinner.hide();
      })
    })

  }


}
