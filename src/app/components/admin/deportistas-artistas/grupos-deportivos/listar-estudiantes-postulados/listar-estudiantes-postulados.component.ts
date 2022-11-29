import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';


declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-estudiantes-postulados',
  templateUrl: './listar-estudiantes-postulados.component.html',
  styleUrls: ['./listar-estudiantes-postulados.component.css']
})
export class ListarEstudiantesPostuladosGruposComponent implements OnInit, OnDestroy {
  
  /**
   * Contiene todos los estudiantes que se inscribieron en un grupo.
   */
  listaEstudiantesInscritos : any[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private _gruposService: GruposDeportivosService, private router:Router, 
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) { }
  
  /**
   * Obtiene los estudiantes inscritos en un grupo y en un periodo específico.
   */
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this._gruposService.getEstudiantesInscritos(params.idPeriodo, params.idGrupo).subscribe(data => {
      
          this.listaEstudiantesInscritos = data['estudiantesInscritos'];
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
    });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 1, "asc" ],[ 0, "asc" ]];
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
