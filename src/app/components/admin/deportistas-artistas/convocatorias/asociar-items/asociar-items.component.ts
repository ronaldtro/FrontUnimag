import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Api } from 'src/app/class/api';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemService } from 'src/app/services/item.service';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-asociar-items',
  templateUrl: './asociar-items.component.html',
  styleUrls: ['./asociar-items.component.css']
})

export class AsociarItemsComponent implements OnInit {

  @ViewChild('auto') auto;
  
  /**
   * Contiene todos los ítems que se han registrado y que se pueden elegir para
   * asignarlos a una disciplina de una convocatoria.
   */
  listaItems : any[] = [];
  
  /**
   * Contiene los ítems que ya han sido asignados a una disciplina de una convocatoria.
   */
  listaItemsConvocatorias : any[] = [];
  
  /**
   * Contiene los datos de un ítem para asignarlo a la lista de ítems que se guardarán y
   * asignarán a una disciplina.
   */
  item : any = {};
  
  /**
   * Se requiere el id de la disciplina de una convocatoria para asignar los ítems. 
   */
  idConvocatoriaDisciplina : number;
  
  /**
   * Contiene los ítems que se desean eliminar de una disciplina.
   */
  listaItemsDisciplinasEliminar : any[] = [];
  
  /**
   * Contiene los errores encontrados que vienen del back-end
   */
  errores : object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;

  constructor(private _itemService:ItemService, private _convocatoriasService: ConvocatoriasArtistasDeportistasService,
     private spinner: NgxSpinnerService, private elementRef: ElementRef, private route:ActivatedRoute, private _location: Location) {}
  
  /**
   * Se obtienen los items que han sido asignados a una disciplina de una determinada
   * convocatoria. También se obtienen todos los items existentes con el fin de asignarlos
   * a la disciplina que el usuario necesite.
   */
  ngOnInit() {

   this.spinner.show();

   this.route.params.subscribe(params=>{
    this.idConvocatoriaDisciplina = params.id;
   
      this._convocatoriasService.getItemsConvocatoria(this.idConvocatoriaDisciplina).subscribe(data => {
        
        this.listaItemsConvocatorias = data['items'];
      
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

    this._itemService.getItems().subscribe(data => {
      this.listaItems = data['items'];
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
   * Se usa para agregar otra fila en la que se pueda escribir los datos de un item
   */
  incrementarCantidadItems(){
    this.listaItemsConvocatorias.push({nombre:""});
  }

  /**
   * Permite asignar los items a una disciplina de una convocatoria
   */
  asignarItemsAConvocatoria(){

    let sumaPorcentaje = 0;
    
    for(let i = 0; i < this.listaItemsConvocatorias.length;i++){
      sumaPorcentaje+= this.listaItemsConvocatorias[i].porcentaje;
    }
    
   if(sumaPorcentaje == 100){
      for(let i = 0; i < this.listaItemsConvocatorias.length;i++){
        if(typeof this.listaItemsConvocatorias[i].nombre != 'string'){
              let nombre = this.listaItemsConvocatorias[i].nombre.nombre;
              
              delete this.listaItemsConvocatorias[i].nombre;
              if(this.listaItemsConvocatorias[i].id != undefined){
                this.listaItemsDisciplinasEliminar.push(this.listaItemsConvocatorias[i].id);
                delete this.listaItemsConvocatorias[i].id;
              }
              this.listaItemsConvocatorias[i].nombre = nombre;
        }
      }
      
      let items = { disciplina_convocatoria_id : this.idConvocatoriaDisciplina,
                    listaItemsConvocatoria: this.listaItemsConvocatorias,
                    listaItemsDisciplinasEliminar: this.listaItemsDisciplinasEliminar};

      this._itemService.asignarItemsAConvocatoria(items)
          .subscribe(data => {
            
            if(data["success"]){
              this.errores = [];
              this.listaItemsDisciplinasEliminar.splice(0,this.listaItemsDisciplinasEliminar.length)
              this.listaItemsConvocatorias.splice(0,this.listaItemsConvocatorias.length);
              this.listaItemsConvocatorias = data["itemsDisciplina"];
               
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
                text: 'No se pueden guardar los items'
              });
            }
          });
    }else{
      swal({
        type: 'error',
        title: 'Error',
        text: 'La suma de los porcentajes de los items debe dar el 100%',
      });
    }
  }
  /**
   * Se usa para desvincular un item de una disciplina
   * 
   * @param itemDisciplina Es el objeto que contiene los datos de un item asignado
   * a una disciplina
   * 
   * @param index Es la posición del item que el usuario seleccionó en la tabla
   */
  quitarItemDisciplina(itemDisciplina, index){
   
    swal({
      title: 'Quitar item',
      text: "¿Está seguro de quitar el item?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        
        this._itemService.existeItem(itemDisciplina.nombre).subscribe(data => {
             
             if(data["success"] || itemDisciplina.id != undefined){
              this.listaItemsDisciplinasEliminar.push(itemDisciplina.id);
             }

             this.listaItemsConvocatorias.splice(index, 1);
             this.spinner.hide();
        });
       
      }
    });
  }

  goBack():void{
    this._location.back();
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
