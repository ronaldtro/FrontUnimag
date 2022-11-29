import { Time } from "@angular/common";
import { Timestamp } from "rxjs/Rx";

export interface Horario {
    id?:number;
    id_consultorio?:number;
    id_profesional?:number;
    id_dia_atencion?:number;
    cedula_profesional?:number;
    nombre_tipo_profesional?:string;
    nombre_profesional?:string;
    nombre_consultorio?:string;
    lugar_consultorio?:string;
    dia_atencion?:string;
    hora_inicio?:any;
    hora_fin?:any;
}
