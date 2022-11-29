import { Entrevista } from "./entrevista";
import { EstudianteRefrigerios } from "./estudiante-refrigerio.interfase";

export interface Estudiante{
    codigo?:number;
    email?:string;
    identificacion?:string;
    nombre?:string;
    sexo?:boolean;
    id?:number;
    foto?:string;
    estado_plaza?:number;
    entrevista?:Entrevista;
    supervisor?:number;
    programa?:string;
    beneficios?:EstudianteRefrigerios[];
}