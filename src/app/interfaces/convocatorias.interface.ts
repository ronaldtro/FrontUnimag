import { Etapas } from "./etapas.interfaces";

export interface Convocatoria{
    id?:number;
    bolsa_presupuestal_id?:number;
    sporte?:string;
    fecha_expedicion?:Date;
    estado?:boolean;
    file_soporte?:File;
    etapas:Etapas[];
    estado_control_id?:number;
    titulo?:string;
    descripcion?:string;
    resolucion?:string;
    file_soporte_resolucion?:File;
    nota_minima?:number;
    maximo_horas?:number;
    tipo?:string;
    tipo_id?:number;
    file_formato?:File;


}