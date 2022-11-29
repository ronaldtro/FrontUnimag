import { Estudiante } from "./estudiantes.interface";

export interface EstudiantePlaza{
    convocatoria?:string;
    cupos?:number;
    convocatoria_id?:number;
    tipo_convocatoria_id?:number;
    plaza_id?:number;
    estado?:string;
    postulados?:Estudiante[];
    plaza?:string;
    estadoActualId?:number;

}

export interface EstudianteEval{
    convocatoria?:string;
    tipo_convocatoria?:number;
    cupos?:number;
    estado?:string;
    evaluados?:any[];
    etapa_id:number;
    nota_minima?:number;
    puntaje?:number;
}
