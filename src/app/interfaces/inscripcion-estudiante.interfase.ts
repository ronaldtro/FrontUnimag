import { Convocatoria } from './convocatorias.interface';
export interface InscripcionRefrigerio{
    id?:number;
    nombre?:string;
    estudiantes?:{
        idEstudiante?:number,
        nombreEstudiante?:string,
        codigo?:string,
        dias?:string,
        beneficio?:string,
        beneficio_id?:number,
        sexo?:number,
        programa?:string,
        email?:string,
        estadoInscripcion?:number,
        estadoInscripcionId?:number
    }[];
}

export class Falla{
    id:number;
    estudiante:string;
    codigo:string;
    beneficio:string;
    dia:string;
    fecha:Date;
}

export class ConvocatoriaAsistente{
    id:number;
    nombre:string;
    etapa:number;
    beneficios:{
        id:number;
        nombre:string;
    }[];
}

export class CriteriosSeleccion{
    id:number;
    nombre:string;
    codigo:string;
    estudiante:string;
    beneficio:string;
    estado:string;
    condicion:string;
    programa:string;
}

export class TablaSeleccion{
    convocatoria:string;
    beneficio:string;
    programa:string;
    estrato:number;
    preseleccionados:number;
    total:number;
    porcentaje:number;
    cupos:number;
}