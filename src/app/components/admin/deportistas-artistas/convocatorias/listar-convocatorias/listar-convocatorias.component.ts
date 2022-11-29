import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-convocatorias',
  templateUrl: './listar-convocatorias.component.html',
  styleUrls: ['./listar-convocatorias.component.css']
})
export class ListarConvocatoriasArtistasDeportistasComponent implements OnInit {

  /**
   * Contiene todas las convocatorias que se encuentran activas
   */
  listaConvocatorias : any[] = [];
   
  /**
   * Contiene los datos de una convocatoria que se haya seleccionado
   */
  convocatoria : any = {};
 
  errores:object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;

  constructor(private _convocatoriasService: ConvocatoriasArtistasDeportistasService, 
    private spinner: NgxSpinnerService, private elementRef: ElementRef) {
    }

    /**
     * Se cargan todas las convocatorias activas
     */
    ngOnInit() {
      this.spinner.show();

        this._convocatoriasService.getConvocatorias().subscribe(data => {
          
          this.listaConvocatorias = data['convocatorias'];
       
          this.initDtOptions();
          this.dtTrigger.next();
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
  
  /**
   * Permite habilitar o inhabilitar las convocatorias.
   * 
   * @param convocatoria Objeto que contiene los datos de la convocatoria que se desea habilitar
   * o inhabilitar.
   */
  cambiarEstado(convocatoria){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._convocatoriasService.cambiarEstado(convocatoria.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.listaConvocatorias.length; index++) {
              if (this.listaConvocatorias[index].id == convocatoria.id) {
                this.listaConvocatorias[index].estado = !this.listaConvocatorias[index].estado;
                break;
              }
            }
            this.rerender();
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
              text: 'La convocatoria no se encuentra registrada en la base de datos',
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
    })
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ],[ 1, "asc" ]];
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  
  viewDoc(convocatoria){
    this.convocatoria = convocatoria;
    $('#modelId').modal('show');
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}
