export interface ConvocatoriaInscripcionBeneficio{
    id?:number;
    nombre?:string;
    beneficios?:InscripcionBeneficio[] 
}

export interface InscripcionBeneficio{
    id?:number;
    nombre?:string;
    dias?:{
        id?:number,
        dia?:string,
        estado?:boolean
    }[];
    diaSelect:number[] ;
    codigo?:string;
    idConvocatoria?:number;
    datosComplementarios?:{
        sisben:string,
        incapacidadTotal: Boolean,
        fallecimientoDepende:Boolean,
        enfermedadGrave:Boolean,
        madreGestante:Boolean,
        eps:number
    };
}