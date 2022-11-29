export interface BolsaPresupuestal{
    denominacion?:string;
    id?:number;
    valor?:any;
    soporte?:string;
    periodo_id?:number;
    tipo_fondo_id?:number;
    tipo_fuente_id?:number;
    fecha_expedicion?:Date;
    estado?:boolean;
    ejecutor?:string;
    responsable?:string;
}