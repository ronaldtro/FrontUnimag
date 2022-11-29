import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClasesArtistasDeportistasService } from 'src/app/services/clases-artistas-deportistas.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-supervisores',
  templateUrl: './listar-supervisores.component.html',
  styleUrls: ['./listar-supervisores.component.css']
})
export class ListarSupervisoresComponent implements OnInit {

  listaSupervisores : any [] = [];
  supervisor : any = {};
  es : any;


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  
  constructor(private _clasesService: ClasesArtistasDeportistasService,
    private spinner: NgxSpinnerService, private elementRef: ElementRef) {
     }
  
     
  /**
   * Se cargan todas las clases que el supervisor ha creado
   */
  ngOnInit() {

    this.spinner.show();

    this._clasesService.getSupervisores().subscribe(data => {
     
      this.listaSupervisores = data['supervisores'];

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
