import { Actividades } from './actividades.interface';
export interface Estudiantes{
    id?:number;
    nombre?: string,
    tipoAyudantia?: string,
    ayudantia?: string,
    solicitante?: string,
    codigo?: string,
    programa?: string,
    facultad?:string,
    supervisor?:string,
    actividades?:string
}