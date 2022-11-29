export interface Atencion {
    sexo?:any
}

export interface Antecedentes {

    id?:number,
    nombre?:string,
    observacion?:string,

}

export class Psicologia{
    id_paciente:number;
    id_cita:number;
    fecha_atencion: string;
    motivo_consulta : string;
    impresion_diagnostica : string;
    tipo_atencion:number;
    enfermedad_actual:string;
    tipo_paciente:number;
    atencion_id:number;
    antecedentes_psicologicos:string;
    datos_familia:string;
    bandera:boolean;
    datos_familiares:string;
    observacion:string;
    
}

export class Formulario{
    id:number;
    id_cita:number;
    fecha_atencion: string;
    motivo_consulta : string;
    impresion_diagnostica : string;
    tipo_atencion:number;
    enfermedad_actual:string;
    tipo_paciente:number;
    atencion_id:number;
    // antecedentes
    antecedentes:Antecedente[];
    // examen fisico
    ta:string;	
    temperatura:string;	
    fr:string;	
    glasgow:string;	
    fc:string;	
    peso:string;	
    talla:string;	
    observacion:string;	
    // examen fisico item
    examen_fisico_item:examen_fisico_item[];
    observacion_fisico:string; 
    // examen OBSTÉTRICOS
    examen_gineco:ExamenGineco = new ExamenGineco();
    observacion_gineco:string;
    // examenes clinicos
    examenesClinico:ExamenesClinico[];
    pt:string;
    ptt:string;
    glicemia:string;
    gravindex:string;
    amilsa:string;
    // conducta
    conducta:string;
    //cie10
    cie10:Cie10[];
    //medicamentos
    medicamentos:Medicamento[];

}


export class FormularioIncapacidad{
    id_paciente:number;
    tipo_paciente:number = null;
    fecha_atencion: string;
    motivo_consulta : string;
    resumen_clinico : string;
    entidad_remitente : string;
    tipo_entidad:number = null;
    contingencia : number = null;
    fecha_inicio:Date;
    fecha_fin:Date;
    dias:string;
    letras:string;
    profesional_incapacidad:string;
}

export class Medicamento{  
    nombre_medicamento:string;
    Observacion_medicamento:string;    
}

export class Antecedente{
    antecedente_id:number; 
    nombre:string;
    observacion:string;    
}

export class Cie10{
    id:number; 
    nombre:string;
    codigo:string;    
}

export class examen_fisico_item{
    id:number;
    nombre:string;
    estado:boolean;       
}

export class ExamenesClinico{
    id:number; 
    nombre:string;
    observacion:string; 
}

export class ExamenGineco{
    menarquia:number;
    sexarquia:Number;
    fum:Date;
    ciclos:string;
    gravidez:number;
    abortos:number;
    partos:number;
    vaginales:number;
    cesareas:number;
    ectopicos:number;
    gemelar:number;
    muertos:number;
    vivos:number;
    viven:number;
}

// sesion de enfermeria 

// formulario de enfermeria
export class enfermeria{
  
    motivo_consulta : string;
    impresion_diagnostica : string;
    id_paciente:number;
    id_cita:number;
    fecha_atencion: string;
    tipo_atencion:number;
    tipo_paciente:number;
    tipos_de_atencion_enfermeria:number; 
    atencion_id:number;    
    //cie10
    cie10:Cie10[];
    //medicamentos
    medicamentos:Medicamento2[];
    sexual:Sexual = new Sexual();
    metabolicos: Metabolicos = new Metabolicos();
    ObservacionAplicacion:string;
}

// medicacion en la atención de enfermeria
export class Medicamento2{  
    nombre_medicamento:string;
    Observacion_medicamento:string; 
    procedimientos:string;
    tipoMedicamento:number;
}

// salud sexual para enfermeria
export class Sexual{
    menarquia:number;
    sexarquia:Number;
    fum:Date;
    ciclos:string;  
    partos:number;  
    abortos:number;    
    cesareas:number;
    ultimaCitologia:Date;
    metodoPlanificacion:string;
    anticonceptivo:string;
    observacionSexual:string;  
}

export class Metabolicos{ 
    glicemia:string;
    presion:string;
    estatura:number;
    peso:Number;
    perimetroAbdominal:number;     
}

// medicina del deporte
export class medicinaDeportiva{  
    motivo_consulta : string;
    impresion_diagnostica : string;
    enfermedad_actual:string;
    id_paciente:number;
    id_cita:number;
    fecha_atencion: string;
    tipo_atencion:number;
    tipo_paciente:number;
    clasfRCV:number;
    classfRCV:number;
    atencion_id:number;    
    id:number;
  	
    signosVitales: SignosVitales = new SignosVitales();
    antropomericos: Antropomericos = new Antropomericos();
    antecedentesCV:AntecedenteCV[];
    antecedentes:Antecedente[];
    tipos_riesgoscv: TiposRiesgosCV[];

    test_wells:number;
    flexibilidades: Flexibilidad[];
    estabilidades: Estabilidad[];
    escala_caida: number;
    postura_morfologica:number;
    postura_funcional:number;

    pliegues_grasos: PliegueGraso = new PliegueGraso();
    diametros_oseos: DiametroOseo = new DiametroOseo();
    determinaciones_antropometricas: DeterminacionAntropometrica[];
    grasa_ideal:number;
    deficit_muscular:number;

    laboratorios:string;
    imagenes_diagnosticas:string;
    pruebas_especiales:string;
    ct:number;
    hdl:number;
    tg:number;
    glicemina:number;
    class_aha_acc:number;

    prueba_esfuerzo:string;

    max_velocidad_mill:number;
    pendiente:number;
    max_watts:number;
    max_distancia_recorrida:number;
    fc_max:number;
    pa_sistolica_max:number;
    pa_diastolica_max:number;
    umbral_anaerobico:number;
    fc_post:number;
    fc_min:number;
    interpretacion_test:string;

    diagnostico_medico_deportivo:string;
    tratamiento_medico:string; 
    ss_examenes:string;
    remision_medica:string;

    prescripcion:string;
    incapacidad:string;

    atencion_programada:boolean;

}

export class Flexibilidad{
    id:number;
    nombre:string;
    estado:number;
    nivel:number;
}

export class Estabilidad{
    id:number;
    nombre:string;
    estado:number;
    nivel:number;
}

export class PliegueGraso{
    pecho:number;
    axilar:number;
    triceps:number;
    subescapular:number;
    suprailiaco:number;
    abdominal:number;
    muslo:number;
    pierna:number;
}

export class DiametroOseo{
    muneca:number;
    femoral:number;
}

export class DeterminacionAntropometrica{
    id:number;
    nombre:string;
    estado:boolean;
}

export class TiposRiesgosCV{
    id:number;
    nombre:string;
    estado:number;
}

export class SignosVitales{ 
    pas:number;
    pad:number;
    fc:number;
    fr:number;
    temperatura:number;     
}

export class Antropomericos{ 
    peso:number;
    talla:number;
    cintura:number;
    carpo:number;
    cadera:number;
    tipoComplexion:number;     
}

export class AntecedenteCV{
    antecedente_id:number; 
    nombre:string;   
}