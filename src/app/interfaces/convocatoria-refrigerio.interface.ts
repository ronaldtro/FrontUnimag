import { Etapas } from "./etapas.interfaces";
import { Beneficios, Condiciones } from "./beneficio-convocatoria-refrigerio.interface";

export interface ConvocatoriaRefrigerio{
    id?:number;
    bolsa_presupuestal_id?:number;
    soporte?:string;
    fecha_expedicion?:Date;
    estado?:boolean;
    file_soporte?:File;
    descripcion?:string;
    titulo?:string;
    restricciones?:number[];
    nombreRestricciones?:string[];
    modalidades?:number[];
    nombreModalidades?:string[];
    fallas?:number;
    cantidad_beneficios?:number;
    estrato?:number;
    idsBeneficios?:number[];
    etapas:Etapas[];
    beneficios:Beneficios[];
    condiciones:Condiciones[];
    estado_control?:number;   
    estado_control_id?:number;  
    resolucion?:string;
    file_soporte_resolucion?:File;
    tipo_id?:number;
}

export class Entrega{
    codigos:string[];
    observacion:string;
    fecha:string;
    idConvocatoria:number;
    idBeneficio:number;
    accion:boolean;
    codigosInvalidos:any;
}

export class Estudiante{
    codigo:string;
    nombre:string;
    dias:string[];
    estado:string;
    beneficio:string;
    idEstado:number;
    foto:string;
}