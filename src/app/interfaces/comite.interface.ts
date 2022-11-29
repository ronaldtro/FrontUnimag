import { MiembroComite } from './miembro-comite.interface';

export interface Comite {
    
    id?:number;
    nombre?:string;
    facultad_id?:number;
    facultad_cod?:string;
    facultad?:string;
    miembros?:MiembroComite[];
    estado?:boolean;
    fecha_creacion?:Date;
}
