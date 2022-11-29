import { programas } from './plaza.interface';

export interface Actividades{

    id?:number;
    fecha_inicio?:Date;
    fecha_fin?:Date;
    descripcion?:string;
    actividad?:string;
    plaza_estudiante_id?:number;
    estado_id?:number;
    estado_nombre?:string;
    estado_actividad_id?:number;
    soporte?:string;
    soporte_url?:string;
    estado?:boolean;
    estudiantes_atendidos?:any[];
    historial?:any[],
    actividad_realizar_id?: number;
    tiempo?:number;
    accion?:boolean;
}

export interface estudiantesActividades{

    id?:number;
    codigo?:number;
    nombre?:string;
    programa?:string;
    
}