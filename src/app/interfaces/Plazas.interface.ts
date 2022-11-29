import { requisitosInscripcion, requisitosEvaluacion } from "./requisitos.interface";
import { Asignaturas } from "./asignaturas.interface";
import { Objeto } from "./objeto.interfaces";

export class Plazas{
    id?:number;
    nombre?:string;
    tipo_ayudantia?:number;
    tipoAyudantiaId: number;
    tipo_plaza_id?:number;
    tipo_plaza?:string;
    cupos_solicitados?:number;
    convocatoria_id?:number;
    tipo_convocatoria?:number;
    perfil?:string;
    requisitosInscripcion?:requisitosInscripcion[];
    requisitosEvaluacion?:requisitosEvaluacion[];
    convocatoriaNombre?:string;
    competenciasRequeridas?:string;
    actividades?:string[];
    cupos_aprobados?:number;
    porcentaja_creditos_requeridos?:number;
    asignaturasAprobadas?:Asignaturas[];
    facultades?:Objeto[];
    programas?:Objeto[];
    pesoEtapaActual?:number;
    promedio_minimo?:number;
    convocatoria_titulo?:string;
    
    constructor(){
        this.requisitosEvaluacion = [];
    }
}