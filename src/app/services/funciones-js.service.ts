import { Injectable } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
declare var $:any;

@Injectable({
  providedIn: 'root'
})

export class FuncionesJSService {

  constructor() { }

  reemplazarBotonesDatatable(){
    $('.dt-button.buttons-copy').html('<span class="far fa-copy"></span><span class="sr-only">Copiar</span>');
    $('.dt-button.buttons-copy').attr('title','Copiar todos los registros de la tabla');
    $('.dt-button.buttons-print').html('<span class="fas fa-print"></span><span class="sr-only">Imprimir</span>');
    $('.dt-button.buttons-print').attr('title','Imprimir');
    $('.dt-button.buttons-excel').html('<span class="far fa-file-excel"></span><span class="sr-only">Excel</span>');
    $('.dt-button.buttons-excel').attr('title','Exportar como archivo Excel');
  }

  addFilter(parent:any, idx:number, idElement:string){
    if(parent.dtElement != undefined){
      parent.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        let parentTable = this;
        let select = $('<select class="form-control input-sm"><option value="">- Mostrar todos -</option></select>')
            .appendTo( $(idElement) )
            .on( 'change', function () {
                //dtInstance.columns().search("").draw();
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );
                
                parentTable.showFilter(parent,{idx: idx, idElement: idElement, name: ($(this).val() != "") ? dtInstance.column(idx).header().textContent + " : " + $(this).val() : ""});
                
                dtInstance.column(idx).search( val ? '^'+val+'$' : '', true, false )
                    .draw();
                  if(parent.cdr){
                    parent.cdr.detectChanges();
                  }
                    
            } );
            
        dtInstance.column(idx).data().unique().sort().each( function ( d, j ) {
         // console.log(d)
        select.append( '<option value="'+d+'">'+d+'</option>' )
        } );
      });
    }
  }

  addFilterSpecific(parent:any, dtElement:any, idx:number, idElement:string){
    if(dtElement != undefined){
      dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        let parentTable = this;
        let select = $('<select class="form-control input-sm"><option value="">- Mostrar todos -</option></select>')
            .appendTo( $(idElement) )
            .on( 'change', function () {
                //dtInstance.columns().search("").draw();
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );
                
                parentTable.showFilter(parent,{idx: idx, idElement: idElement, name: ($(this).val() != "") ? dtInstance.column(idx).header().textContent + " : " + $(this).val() : ""});
                
                dtInstance.column(idx).search( val ? '^'+val+'$' : '', true, false )
                    .draw();
                  if(parent.cdr){
                    parent.cdr.detectChanges();
                  }
                    
            } );
            
        dtInstance.column(idx).data().unique().sort().each( function ( d, j ) {
         // console.log(d)
        select.append( '<option value="'+d+'">'+d+'</option>' )
        } );
      });
    }
  }

  showFilter(parent:any, obj:any){
    let isInArr = -1;
    
    for(let i = 0; i < parent.appliedFilters.length; i++){
      if(parent.appliedFilters[i].idx == obj.idx){
        isInArr = i;
        break;
      }
    }
    if(isInArr > -1){
      if(obj.name == ""){
        this.removeFilter(parent, obj);
      }else{
        parent.appliedFilters[isInArr].name = obj.name;
      }
      
    }else{
      parent.appliedFilters.push(obj);
    }
    
  }

  removeFilter(parent:any, obj:any){
    parent.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(obj.idx).search("")
      .draw();
    });

    for(let i = 0; i < parent.appliedFilters.length; i++){
      if(parent.appliedFilters[i].idx == obj.idx){
        parent.appliedFilters.splice(i, 1);
        break;
      }
    }
    $(obj.idElement + ' option[value=""]').attr("selected", true);
  }

  sentenceCase(input) {
    input = ( input === undefined || input === null ) ? '' : input;
    input = input.toLowerCase();
    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
    return match.toUpperCase();
    });
   }

  // dtInstance.columns().every(function(this){
        //   let column = this;
        //   if(idx == 1 || idx == 5){
        //     console.log(column);
        //     var select = $('<select style="max-width: 120px;" class="form-control input-sm"><option value="">Seleccione</option></select>')
        //         .appendTo( $(column.footer()).empty() )
        //         .on( 'change', function () {
        //             var val = $.fn.dataTable.util.escapeRegex(
        //                 $(this).val()
        //             );

        //             column
        //                 .search( val ? '^'+val+'$' : '', true, false )
        //                 .draw();
        //         } );

        //     column.data().unique().sort().each( function ( d, j ) {
        //         select.append( '<option value="'+d+'">'+d+'</option>' )
        //     } );
        //   }
          
        //   idx++;
          
        // });
}
