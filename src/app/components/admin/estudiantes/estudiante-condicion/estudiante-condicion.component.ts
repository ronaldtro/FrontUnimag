import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { EstudianteCondicionService } from 'src/app/services/estudiante-condicion.service';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Condicion } from 'src/app/interfaces/condicion.interface';
import { NgForm } from '@angular/forms';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';



declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-estudiante-condicion',
  templateUrl: './estudiante-condicion.component.html',
  styleUrls: ['./estudiante-condicion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
 
})
export class EstudianteCondicionComponent implements OnInit, AfterViewChecked, OnDestroy {
 
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  

  codigoInvalidos:any[]=[];
  condiciones:Condicion[]=[];
  condEstudiante:any[]=[];
  errores:object[]=[];
  appliedFilters:any[] = [];
  ok: string = '';
  estudiante:any={
  codigo:null,
  };
  codigos:string=null;
  arrayCodigos:any[]=[];
  array:string[]=[];
  asignarCondicion2:any={     
    condicion_id:null, 
    codigosCondiciones:[]=[],
  };
  asignarCondicion:any={
    id:null,
    nombre:null,
    codigo:null, 
    sinCondicion:null,
    historialCondiciones:[]=[]
  };
  condicion:any = {
    id:null,
    historialCondiciones:[]=[]
  };
  index: number = 0;
  funciones:FuncionesJSService;
  aux: any;

  constructor( 
    private _EstudinateCondicion: EstudianteCondicionService, 
    private spinner: NgxSpinnerService,
    private elementRef: ElementRef, 
    private funcionesP: FuncionesJSService,
    private cdr: ChangeDetectorRef,
  
    ) 
    {this.funciones = funcionesP;}

   ngOnInit() {
    this.spinner.show();
    this._EstudinateCondicion.getCondicionEstudiante().subscribe(data=>{        
      this.condEstudiante = [...data['ListadoEstudiantesCondiciones']];
      this.condiciones = [...data['condiciones']];   
    
     
      this.initDtOptions(); 
      this.dtTrigger.next();
      this.spinner.hide();
      this.cdr.detectChanges();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });    
      this.cdr.detectChanges();
    })

  }
  
  verEstados(estudiante){      
    let copy = Object.assign({}, estudiante);  
    this.asignarCondicion = copy;  
    $('#estadosCondicionModal').modal('show');
    this.cdr.detectChanges();
  }

  asignarCondicionEstudiante(estudiante){
    this.errores = [];
    this.index = this.condEstudiante.indexOf(estudiante);
    let copy = Object.assign({}, estudiante);
    copy.historialCondiciones = [];
    estudiante.historialCondiciones.forEach(element => {
      if(element.estado){
        copy.historialCondiciones.push(element.id);
      }     
    });
    this.errores = [];
    this.asignarCondicion = copy; 
    $('#asignarCondicionModal').modal('show');
  }

  asignarCondicionGuardar(form:NgForm){
    this.spinner.show();
    this.condicion.id=this.asignarCondicion.id;
    this.condicion.historialCondiciones=this.asignarCondicion.historialCondiciones; 
    this._EstudinateCondicion.asignarCondicion(this.condicion).subscribe(data => {
      if(data['success']){
        this.condEstudiante[this.index] = Object.assign({},data['objRetornado']);
        this.rerender();
        this.spinner.hide();
        $('#asignarCondicionModal').modal('hide');
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
        });
      }else{
        this.errores = [...data['errores']];
        this.spinner.hide();
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }      
      this.cdr.detectChanges();
    },err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);     
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });  
      this.spinner.hide(); 
      this.cdr.detectChanges();
    }
 
    );
  }

  asignarCondicion2Guardar(form:NgForm){
    this.spinner.show();
    if(!form.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Revise el formulario y vuelva a intentarlo.',
      });
      return
    }  
    this.spinner.hide();
    // debugger;
    this.array = this.codigos.split(",");
    for (let i = 0; i < this.array.length; i++) {
      this.arrayCodigos.push(this.array[i].trim())   
    }  
    for (let i = 0; i < this.arrayCodigos.length; i++) {
      if (this.arrayCodigos[i].length == 0) {
        this.arrayCodigos.splice(i,1);
      }
    } 
    this.asignarCondicion2.codigosCondiciones = this.arrayCodigos;
    this.spinner.show();
    this._EstudinateCondicion.asignarCondicion2(this.asignarCondicion2).subscribe(data => {
      if(data['success']){        
        this.aux = JSON.parse(data['obj']);
        this.condEstudiante = this.aux.ListadoEstudiantesCondiciones;
        this.codigoInvalidos = data['codigosInvalidos'];
        console.log(this.codigoInvalidos);
        // this.condEstudiante[this.index] = data['objRetornado'];
        this.rerender();
        this.spinner.hide();
        form.resetForm(this.asignarCondicion2);
        this.arrayCodigos = [];
        $('#asignarCondicionModal2').modal('hide');
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
        });
        this.cdr.detectChanges();
        
      }else{
        this.errores = [...data['errores']];
        this.spinner.hide();
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }      
    }
    ,err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });    
      form.resetForm(this.asignarCondicion2);
      this.arrayCodigos = [];
      this.spinner.hide();  
      this.cdr.detectChanges();
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    this.cdr.detectChanges();
  }

  initDtOptions(){    
    this.dtOptions.order =[[1,"asc"]]
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.deferRender = true;
    this.dtOptions.scroller = {
        loadingIndicator: true
    }
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar'
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [1,2,3]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [1,2,3]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
        // this.funciones.addFilter(this, 1, "#filter-Codigo"); 
        this.funciones.addFilter(this, 3, "#filter-condicion");    
        $("#filter-condicion").on('change',() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {            
              //dtInstance.columns().search("").draw();
              var val = $.fn.dataTable.util.escapeRegex(
                  $("#filter-condicion").val()
              );                    
              this.funciones.showFilter(this,{idx: 3, idElement: '#filter-condicion', name: ($("#filter-condicion").val() != "") ? dtInstance.column(3).header().textContent + " : " + $("#filter-condicion").val() : ""});
              
              dtInstance.column(3).search( $("#filter-condicion").val() )
                  .draw();
             
          });
        });  
    }; 

  }


  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
    $('[data-toggle="tooltip"]').tooltip();
  }

  Invalidos() {  
    $('#codigosInvalidos').modal({backdrop:"static"});
  }
  
  crear() {
    this.estudiante = {
      id: null,
    };
    $('#insertarEstudiante').modal({backdrop:"static"});
  }

  crear2() {
    this.arrayCodigos = [];     
    if (this.arrayCodigos.length > 0) { this.codigos = this.arrayCodigos.join(", ")};
    $('#asignarCondicionModal2').modal({backdrop:"static"});
    this.cdr.detectChanges();
  }
 
  estudienteGuardar(forma: NgForm){
    this.spinner.show();
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {

      this._EstudinateCondicion.postEstudianteNuevo(this.estudiante)
      .subscribe(data => {
        //debugger;
        if (data['success']) {            
          this.condEstudiante.unshift(data['objRetornado']);
          this.rerender();
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha guardado satisfactoriamente el item.",
            timer: 2000,
            showConfirmButton: false
          });  
          forma.resetForm(this.estudiante);    
          this.estudiante = {
            id: null,
          }; 
          this.spinner.hide();
          $('#insertarEstudiante').modal('hide');
          this.cdr.detectChanges();
        } else { 
          // this.ok = data['error'];           
          swal({
            type: "error",
            title: "Error",
            text: data['error'],           
            showConfirmButton: true
          });
        //$('#insertarEstudiante').modal('hide');
          this.spinner.hide();
          this.cdr.detectChanges();
        }
      }, err =>{
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()
        this.cdr.detectChanges();
      });

    }
  }
 
  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
    
  }
  
}
