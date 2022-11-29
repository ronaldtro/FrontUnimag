import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexPlotOptions, 
} from "ng-apexcharts";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { IndicadoresServie } from '../../../services/indicadores.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions?: ApexPlotOptions;
  labels?: string[];
};

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit {

  @ViewChild("chartStratum") chartStratum: ChartComponent;
  public chartStratumOptions: ChartOptions;
  public chartSexOptions: ChartOptions;

  // @ViewChild(DataTableDirective)
  // dtElement: DataTableDirective;
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  dtTrigger: Subject<string> = new Subject();

  estratos:any[];
  sexos:any[];
  convocatorias:any[];
  municipios:any[];
  condiciones:any[];
  informacion:any;

  constructor(private _indicadoresService: IndicadoresServie,) {
    this.sexos = [];
    this.estratos = [];
    this.municipios = [];
    this.informacion = {};
    this.initDataTest();
  }

  ngOnInit() {
    this.chartStratumOptions = this.loadStratumData(this.estratos,"Estrato","estrato","beneficiarios");
    this.chartSexOptions = this.loadSexData(this.sexos,"sexo","valor");
    
    //this.dtTrigger.next();
  }

  /**
   * Método para cargar las opciones de la grafica del indicadores de no. de estudiantes por estrato
   * @param data datos de indicador
   * @param seriesName Nombre de la serie de la grafica
   * @param categoryName Nombre el atributo en los datos correspondiente a la categoria en la grafica
   * @param valueName Nombre el atributo en los datos correspondiente a los valores de la serie en la grafica
   */
  loadStratumData(data:any[], seriesName:string, categoryName:string, valueName:string):ChartOptions{
    let categories:string[] = data.map(elem => {return elem[categoryName].toString()})
    let values:any[] = data.map(elem => {return elem[valueName]});
    console.log(values);
    return {
      series: [
        {
          name: seriesName,
          data: values
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "No. de estudiantes beneficiarios por estrato",
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  'Intro',
          color:  '#003A6B'
        },
      },
      xaxis: {
        categories: categories
      }
    };
  }

  /**
   * Método para cargar las opciones de la grafica del indicadores de no. de estudiantes por sexo
   * @param data datos de indicador
   * @param categoryName Nombre el atributo en los datos correspondiente a la categoria en la grafica
   * @param valueName Nombre el atributo en los datos correspondiente a los valores de la serie en la grafica
   */
  loadSexData(data:any[], categoryName:string, valueName:string):ChartOptions{
    console.log(data, categoryName, valueName);
    let labels:string[] = data.map(elem => {return elem[categoryName].toString()})
    let values:any[] = data.map(elem => {return elem[valueName]});
    console.log(values);
    return {
      chart: {
        height: 350,
        type: 'donut'
      },
      plotOptions: {
        pie: {
          expandOnClick: false
        }
      },
      series: values,
      labels: labels,
      title: {
        text: "No. de estudiantes beneficiarios por sexo",
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  'Intro',
          color:  '#003A6B'
        },
      }
    };
  }

  /**
   * Metodo para cargar datos de prueba a las variables
   */
  initDataTest():void{
    this._indicadoresService.getDatos().subscribe(data => {
      this.informacion = data;
      this.sexos = data.sexo;
      this.chartSexOptions = this.loadSexData(this.sexos,"sexo","valor");
      this.estratos = data.estratos;
      this.chartStratumOptions = this.loadStratumData(this.estratos,"Estrato","estrato","beneficiarios");
      this.municipios = data.municipios;
      this.dtTrigger.next();
    }), err =>{
      console.log(err);
    };
    //this.estratos = [{estrato: 0, beneficiarios: 165},{estrato: 1, beneficiarios: 160},{estrato: 2, beneficiarios: 100},{estrato: 3, beneficiarios: 65},{estrato: 4, beneficiarios: 20},{estrato: 5, beneficiarios: 25},{estrato: 6, beneficiarios: 5}];
    //this.sexos = [{sexo: "Hombre", valor: 250},{sexo: "Mujer", valor: 200}]
    this.convocatorias = [
      {nombre: "Convocatorias de ayudantías administrativas y de extensión", creada: 0, en_ejecucion: 0, cerrada: 0},
      {nombre: "Convocatorias de almuerzos y refrigerios", creada: 0, en_ejecucion: 0, cerrada: 0},
      {nombre: "Convocatorias de monitorías académicas", creada: 0, en_ejecucion: 0, cerrada: 0}
    ]
    // this.municipios = [
    //   {municipio: 'SANTA MARTA', departamento: 'MAGDALENA', beneficios: {ayudantias: 0, refrigerios: 0, monitorias: 0}},
    //   {municipio: 'CIENAGA', departamento: 'MAGDALENA', beneficios: {ayudantias: 0, refrigerios: 0, monitorias: 0}},
    //   {municipio: 'FUNDACIÓN', departamento: 'MAGDALENA', beneficios: {ayudantias: 0, refrigerios: 0, monitorias: 0}},
    // ];
    this.condiciones = [
      {condicion: 'TALENTO MAGDALENA', beneficios: {ayudantias: 0, almuerzos_refrigerios: 0, monitorias: 0}},
      {condicion: 'DESPLAZADO', beneficios: {ayudantias: 0, almuerzos_refrigerios: 0, monitorias: 0}},
      {condicion: 'MADRE CABEZA DE FAMILIA', beneficios: {ayudantias: 0, almuerzos_refrigerios: 0, monitorias: 0}},
    ];
  }
}

