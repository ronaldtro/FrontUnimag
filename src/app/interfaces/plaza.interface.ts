export interface PlazaCrear{
    id?:number,
    tipo_ayudantia?:number,
    tipo_plaza_id?:number,
    cupos_solicitados?:number,
    convocatoria_id?:number,
    tipo_convocatoria_id?:number,
    perfil?:string,
    competencias_requeridas?:string,
    porcentaja_creditos_requeridos?:number,
    promedio_minimo?:number,
    asignaturas?:Asignaturas[],
    facultades?:number[],
    programas?:number[],
    actividades?:Actividad[],
    unidad_id?:number,
    supervisor_id?:number;
}

export interface Actividad{
    descripcion?:string,
    id?:number
}

export interface Asignaturas{
    nombre?:string,
    codigo?:string,
    puntaje?:number
}

export interface requisitoInscripcion{
    tipo_requisito_id?:number,
    descripcion?:string,
    valor?:number
}



export interface tipoPlaza{
    id?:number,
    nombre?:string,
    tipoAyudantia?:number,
    codigo?:string,
    nombreTipoAyudantia?:string,
    estado?:boolean,
    idAsignatura?:number,
    programa?:string
}

export interface programas{
    id?:number,
    nombre?:string,
    codigo?:string,
}

export interface asignaturas{
    id?:number,
    nombre?:string,
    codigo?:string,
    dependencia?:string,
}

export interface tipoAyudantia{
    id?:number,
    nombre?:string
}

export class postulacion {
    plaza_id?:number;
    respuesta?:boolean;
    tipo_beneficio_id?:number;
    beneficio:string;
    propuesta_metodologica?:File;
    id_tipo_convocatoria?:number;
    es_autoria:boolean;
}


   