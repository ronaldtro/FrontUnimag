export interface Beneficios{
    id?:number;
    idDia?:number;
    dia?:string;
    idBeneficio?:number;
    beneficio?:string;
    valor?:number;
    aprobados?:number;
    idCafeterias?:number[];
    cafeterias?:string[];
    hora_inicio?:string;
    hora_fin?:string;
    listDias?:number[];
    listDiasNombre?:string[];
    nombre_inicio?:string;
    nombre_fin?:string;  
}

export interface Condiciones{
    id?:number;
    condicion_id?:number;
    condicion?:string;
    numero_fallas?:number;
    cantidad_beneficios?:number;
    validar_horario?:number;
    peso?:number;
    estrato?:number;
}