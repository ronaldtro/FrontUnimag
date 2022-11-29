import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';

declare var $;
declare var jQuery;

@Component({
  selector: 'app-lista-seleccionados-deportistas',
  templateUrl: './lista-seleccionados.component.html',
  styleUrls: ['./lista-seleccionados.component.css']
})
export class ListaSeleccionadosDeportistasComponent implements OnInit {

  /**
   * Contiene la lista de estudiantes que fueron seleccionados.
   */
  listaSeleccionados : any[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private _inscripcionService:InscripcionArtistasDeportistasService,
    private spinner: NgxSpinnerService, 
    private elementRef: ElementRef, 
    private route:ActivatedRoute) { }

  /**
   * Obtiene la lista de estudiantes que fueron seleccionados en la convocatoria.
   */  
  ngOnInit() {
    this.spinner.show();

    this.route.params.subscribe(params=>{
        this._inscripcionService.getEstudiantesSeleccionados(params.idDisciplinaConvocatoria).subscribe(data => {
          
          if(data['success']){
           this.listaSeleccionados = data['seleccionados'];
           this.initDtOptions();
           this.dtTrigger.next();
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'Aún no se encuentran los estudiantes seleccionados'
            });
          }
          this.spinner.hide();
        }, err =>{
          this.spinner.hide();
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
        });
    });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 1, "desc" ]];
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
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
