
export class Api {

  public static prod: string = '';
  //public static dev:string='http://localhost:60041';
  // public static dev:string='http://testcids.unimagdalena.edu.co:8000';
  public static dev: string = 'http://ayudantias.unimagdalena.edu.co:8000';
  //public static dev:string='http://hablemosdepaz.unimagdalena.edu.co';
  public static external: string = '';

}

export class Convocatoria {
  id: number;
  nombre: string;
  titulo: string;
  tipo_convocatoria: TipoConvocatoria;
  etapa_actual: Etapa[];
  etapas: Etapa[];
  fecha_actual: Date;
  resolucion: string;

  constructor() {
    this.tipo_convocatoria = new TipoConvocatoria();
    this.etapa_actual = [];
    this.etapas = [];
  }
}

export class Etapa {
  id?: number;
  convocatoria_id?: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado?: boolean;
  estado_id: number;
  peso_etapa?: number;
  nombre?: string
}


export class TipoConvocatoria {
  id: number;
  nombre: string;
}

export class EnviarCorreoEncuestas {
  plaza_convocatoria_estudiante_id: number;
  estudiantes: string[];


  constructor(plaza_convocatoria_estudiante_id: number, estudiantes: string[]) {
    this.plaza_convocatoria_estudiante_id = plaza_convocatoria_estudiante_id;
    this.estudiantes = estudiantes;
  }
}


export class EstudianteAtendido {
  plaza_convocatoria_estudiante: number;
  codigo: string;
}


export class Estudiante {
  codigo: string;
  nombre: string;
  programa: string;
  facultad: string;
  email: string;
  existe: boolean;
  promedio_acum: number;
  porcentaje_cred: number;
}

export class DatosEstudiante extends Estudiante {
  id: number;
  identificacion: string;
  tipo_identificacion: string;
  estrato: number;
  sexo: string;
  direccion: string;
  sisben: number;
  departamento: string;
  municipio: string;
  telefono: string;
  celular: string;
  colegio: string;
  activo: boolean;
  beneficios: Beneficio[];
  condiciones_estudiantes: any[];
  tiene_beneficio_alimenticio: any[];
  tiene_ayudantia: any[];
  cargando: boolean;
  estudianteBeneficio: EstudianteBeneficio;
  registrado: boolean;

  constructor() {

    super();
    this.cargando = true;
    this.registrado = false;
    this.beneficios = [];
    this.condiciones_estudiantes = [];
    this.tiene_beneficio_alimenticio = [];
    this.tiene_ayudantia = [];
    this.estudianteBeneficio = new EstudianteBeneficio();
  }

}

export class Beneficio {

  id: number;
  nombre: string;
  created_at: string;
  created_user: string;

}

export class CambiosAsignacionAyuda {

  id: number;
  estudiante_beneficio_id: number;
  codigo: string;
  codigos: string[];
  observacion: string;
  fecha: string | Date;
  id_entrega_beneficio: number;
  estado: boolean;
  seleccion: boolean;

  constructor() {
    this.codigos = [];
  }

}

export class DatosEmergencia {

  user_id: number;
  telefono_alterno: string;
  es_telefono_propio: boolean;
  direccion_alterna: string;
  acudiente: string;
  situacion_actual: string;
  eps_id: number;
  apoyo_id: number;
  destino_diferente: boolean;
  departamento: any;
  municipio: any;
  tiene_condicion_medica: boolean;
  condicion_medica: string;

}

export class EstudianteBeneficio {

  id: number;
  estudiante_id: number;
  beneficio_id: number;
  almacen_id: number;
  sisben: number;
  valor: number;
  observacion: string;
  estado: boolean;

}

export enum PROFILE_BY {

  ID_Cita = 1,
  ID_Paciente,
  Session,

}
export enum TiposConvocatorias {

  AYUDANTIA = 1,
  REFRIGERIOS = 2,
  MONITORIA = 3,

}

export enum EtapasAyudantias {

  SOLICITUD_PLAZAS = 1,
  REVISION_PLAZAS,
  INSCRIPCIONES,
  ENTREVISTAS,
  PUBLICACION_DEFINITIVA,
  INICIO_ACTIVIDADES,
  REPORTE_DEPENDENCIA,
  FECHA_PAGO,
  PUBLICACION_PRELIMINAR,
  REUNION_SELECCIONADOS

}

export enum EtapasRefrigerios {

  INSCRIPCIONES = 11,
  PUBLICACION_PRESELECCIONADOS,
  PUBLICACION_OBSERVACIONES,
  PUBLICACION_SELECCIONADOS,
  ENTREGA,
  REUNION_COMITE

}

export enum EtapasMonitorias {

  SOLICITUD_PLAZAS = 17,
  PREAPROBACION_PLAZAS,
  REVISION_PLAZAS,
  INSCRIPCIONES,
  VERIFICACION_REQUISITOS,
  PRUEBA_SELECCION,
  PUBLICACION_PRELIMINAR,
  PUBLICACION_DEFINITIVA,
  REUNION_SELECCIONADOS,
  INICIO_ACTIVIDADES,
  REPORTE_DEPENDENCIA,
  FECHA_PAGO,
  INICIO_ACTIVIDADES_RATIFICADOS,
  ENCUESTA_MONITORES,
  ENCUESTA_MONITORES_TUTOR

}

export enum TiposSolicitud {

  SOLICITADO = 1,
  APROBADO,
  RECHAZADO
  
}
