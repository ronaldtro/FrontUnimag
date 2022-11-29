import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { LoginComponent } from '../../components/public/login/login.component';
import { PeriodosComponent } from "../../components/admin/ayudantias/periodos/periodos.component";
import { FacultadesComponent } from '../../components/admin/facultades/facultades.component';
import { ProgramasComponent } from '../../components/admin/programas/programas.component';
import { convocatorias_routes } from '../../components/admin/ayudantias/convocatorias/convocatorias.routes';
import { convocatorias_routes_artistas_deportistas } from '../../components/admin/deportistas-artistas/convocatorias/convocatorias.routes';
import { bolsasPresupuestales_routes } from '../../components/admin/bolsasPresupuestales/bolsasPresupuestales.routes';
import { plazas_routes } from '../../components/admin/ayudantias/plazas/plazas.routes';
import { unidades_routes } from '../../components/admin/ayudantias/unidades/unidades.routes';
import { estudiantes_routes } from '../../components/admin/estudiantes/estudiantes.routes';
import { DashboardComponent } from '../../components/admin/dashboard/dashboard.component';
import { usuarios_routes } from '../../components/admin/usuarios/usuarios.routes';
import { supervisor_routes } from '../../components/admin/ayudantias/supervisor/supervisor.routes';
import { AyudaComponent } from '../../components/admin/ayuda/ayuda.component';
import { CuantificacionPlazasComponent } from 'src/app/components/admin/ayudantias/consultas/cuantificacion-plazas/cuantificacion-plazas.component';
import { HorasActividadesComponent } from 'src/app/components/admin/ayudantias/consultas/horas-actividades/horas-actividades.component';
import { SupervisorAyudantiaComponent } from '../../components/admin/ayudantias/supervisor-ayudantia/supervisor-ayudantia.component';
import { GeneralesComponent } from 'src/app/components/admin/ayudantias/consultas/generales/generales.component';
import { BeneficiosComponent } from 'src/app/components/admin/beneficios/beneficios.component';
import { PeriodosRefrigeriosComponent } from 'src/app/components/admin/refrigerios/periodos-refrigerios/periodos-refrigerios.component';
import { CafeteriasComponent } from 'src/app/components/admin/refrigerios/cafeterias/cafeterias.component';
import { UsuariosCafeteriaComponent } from 'src/app/components/admin/refrigerios/usuarios-cafeteria/usuarios-cafeteria.component';
import { convocatorias_refrigerios_routes } from '../../components/admin/refrigerios/convocatorias-refrigerios/convocatorias-refrigerios.routes';
import { condiciones_routes } from '../../components/admin/condiciones/condiciones.routes';
import { CambiarContrasenaComponent } from 'src/app/components/public/cambiar-contrasena/cambiar-contrasena.component';
import { InscripcionEstudiantesComponent } from '../../components/admin/refrigerios/estudiantes/inscripcion-estudiantes/inscripcion-estudiantes.component';
import { profesionales_routes } from 'src/app/components/admin/salud/profesionalesSalud/profesionalesSalud.routes';
import { LugaresComponent } from 'src/app/components/admin/lugares/lugares.component';
import { PrincipalComponent } from "../../components/shared/private/principal/principal.component";
import { RecepcionComponent } from 'src/app/components/admin/refrigerios/recepcion/recepcion.component';
import { nivelesProfesionales_routes } from 'src/app/components/admin/salud/nivelesProfesionales/nivelesProfesionales.routes';
import { estudiosRealizados_routes } from 'src/app/components/admin/salud/estudiosRealizados/estudiosRealizados.routes';
import { tiposProfesionalesSalud_routes } from 'src/app/components/admin/salud/tiposProfesionalesSalud/tiposProfesionalesSalud.routes';
import { CitasComponent } from "src/app/components/admin/salud/citas/citas.component";
import { ProfesionalDiasConsultoriosComponent } from 'src/app/components/admin/salud/profesional-dias-consultorios/profesional-dias-consultorios.component';
import { PerfilComponent } from 'src/app/components/admin/salud/perfil/perfil.component';
import { ListadoInscritosComponent } from 'src/app/components/admin/refrigerios/inscritos/listado-inscritos/listado-inscritos.component';
import { DiasNoLaborablesComponent } from 'src/app/components/admin/dias-no-laborables/dias-no-laborables.component';
import { MiCitasComponent } from 'src/app/components/admin/salud/mi-citas/mi-citas.component';
import { PerfilRefrigeriosComponent } from 'src/app/components/admin/refrigerios/estudiantes/perfil-refrigerios/perfil-refrigerios.component';
import { atenciones_routes } from 'src/app/components/admin/salud/atenciones/atenciones.routes';
import { AgendaCitasComponent } from 'src/app/components/admin/salud/agenda-citas/agenda-citas.component';
import { ConfiguracionasignaturasComponent } from 'src/app/components/admin/ayudantias/configuracionasignaturas/configuracionasignaturas.component';
import { EncuestasMonitoriasComponent } from 'src/app/components/admin/ayudantias/encuestas-monitorias/encuestas-monitorias.component';
import { SolicicitudesCancelacionComponent } from 'src/app/components/admin/refrigerios/inscritos/solicicitudes-cancelacion/solicicitudes-cancelacion.component';
import { EditarInscripcionComponent } from 'src/app/components/admin/refrigerios/estudiantes/editar-inscripcion/editar-inscripcion.component';
import { AgendaCitasDiariasComponent } from 'src/app/components/admin/salud/agenda-citas-diarias/agenda-citas-diarias.component';
import { ActualizarDatosComponent } from 'src/app/components/admin/salud/actualizar-datos/actualizar-datos.component';
import { DiasNohabilitadosComponent } from 'src/app/components/admin/refrigerios/dias-nohabilitados/dias-nohabilitados.component';
import { ExcusasComponent } from 'src/app/components/admin/refrigerios/estudiantes/excusas/excusas.component';
import { InscripcionAdministrativaComponent } from 'src/app/components/admin/refrigerios/inscripcion-administrativa/inscripcion-administrativa.component';
import { EntregaExtemporaneaComponent } from 'src/app/components/admin/refrigerios/entrega-extemporanea/entrega-extemporanea.component';
import { ListadoFallasComponent } from 'src/app/components/admin/refrigerios/listado-fallas/listado-fallas.component';
import { ModalidadComponent } from 'src/app/components/admin/deportistas-artistas/modalidades/modalidad.component';
import { CriteriosSeleccionComponent } from 'src/app/components/admin/refrigerios/criterios-seleccion/criterios-seleccion.component';
import { DisciplinaComponent } from 'src/app/components/admin/deportistas-artistas/disciplinas/listar-disciplinas/disciplina.component';
import { ReporteAsignacionDiasComponent } from 'src/app/components/admin/refrigerios/reportes/reporte-asignacion-dias/reporte-asignacion-dias.component';

import { ReporteEntregasComponent } from 'src/app/components/admin/refrigerios/reportes/reporte-entregas/reporte-entregas.component';
import { ReporteEntregasEstudiantesComponent } from 'src/app/components/admin/refrigerios/reportes/reporte-entregas-estudiantes/reporte-entregas-estudiantes.component';
import { ReportesRefrigeriosComponent } from 'src/app/components/admin/refrigerios/reportes/ReportesRefrigerio/reportes-refrigerios/reportes-refrigerios.component';
import { RegistroExtemporaneasComponent } from 'src/app/components/admin/refrigerios/registro-extemporaneas/registro-extemporaneas.component';
import { ListadoEntregasEstadosComponent } from 'src/app/components/admin/refrigerios/listado-entregas-estados/listado-entregas-estados.component';
import { REPORTES_ROUTES } from 'src/app/components/admin/refrigerios/reportes/reportes.routes';
import { PerfilSaludComponent } from 'src/app/components/admin/salud/perfil-salud/perfil-salud.component';
import { AgendaComponent } from 'src/app/components/admin/salud/agenda/agenda.component';
import { InscripcionEstudiantesDeportistasComponent } from 'src/app/components/admin/deportistas-artistas/estudiantes/inscripcion-estudiantes/inscripcion-estudiantes.component';
import { REFRIGERIOS_ROUTES } from 'src/app/components/admin/refrigerios/refrigerios.routes';
import { ListaInscripcionesComponent } from 'src/app/components/admin/deportistas-artistas/estudiantes/lista-inscripciones/lista-inscripciones.component';
import { EvaluarEstudiantesDeportistasComponent } from 'src/app/components/admin/deportistas-artistas/evaluacion-estudiantes/evaluar/evaluar-estudiantes.component';
import { evaluacion_routes_artistas_deportistas } from 'src/app/components/admin/deportistas-artistas/evaluacion-estudiantes/evaluacion.routes';
import { CrearClasesComponent } from 'src/app/components/admin/deportistas-artistas/supervisores/crear-clases/crear-clases.component';
import { ListarEstudiantesAsignadosComponent } from 'src/app/components/admin/ayudantias/evaluar-monitorias/listar-estudiantes-asignados/listar-estudiantes-asignados.component';
import { AsignarEstudiantesDeportistasComponent } from 'src/app/components/admin/deportistas-artistas/supervisores/asignar-estudiantes/asignar-estudiantes.component';
import { ListarSupervisoresComponent } from 'src/app/components/admin/deportistas-artistas/supervisores/listar-supervisores/listar-supervisores.component';
import { GruposComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/listar-grupos/grupos.component';
import { InscripcionGruposComponent } from 'src/app/components/admin/deportistas-artistas/estudiantes/inscripcion-grupos/inscripcion-grupos.component';
import { ListarEstudiantesPostuladosGruposComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/listar-estudiantes-postulados/listar-estudiantes-postulados.component';
import { ListarRolesComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/listar-roles/listar-roles.component';
import { PlantillasConvocatoriasComponent } from 'src/app/components/admin/deportistas-artistas/plantillas-convocatorias/plantillas-convocatorias.component';
import { CrearGrupoComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/crear-grupo/crear-grupo.component';
import { EditarGrupoComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/editar-grupo/editar-grupo.component';
import { DetallesGrupoComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/detalles-grupo/detalles-grupo.component';
import { MeritosGruposComponent } from 'src/app/components/admin/deportistas-artistas/grupos-deportivos/meritos-grupos/meritos-grupos.component';
import { CrearDisciplinaComponent } from 'src/app/components/admin/deportistas-artistas/disciplinas/crear-disciplina/crear-disciplina.component';
import { DetallesDisciplinaComponent } from 'src/app/components/admin/deportistas-artistas/disciplinas/detalles-disciplina/detalles-disciplina.component';
import { EditarDisciplinaComponent } from 'src/app/components/admin/deportistas-artistas/disciplinas/editar-disciplina/editar-disciplina.component';

import { comitesMonitorias_routes } from 'src/app/components/admin/ayudantias/comites-monitorias/comites-monitorias.routes';
import { ENCUESTAS_REFRIGERIOS_ROUTES } from 'src/app/components/admin/refrigerios/encuestas/encuestas.routes';
import { ratificacion_routes } from 'src/app/components/admin/ayudantias/estudiantesRatificados/ratificacion.routes';
import { AsignacionAyudasComponent } from 'src/app/components/admin/asignacion-ayudas/asignacion-ayudas.component';
import { AsignacionAyudasListadoComponent } from 'src/app/components/admin/asignacion-ayudas-listado/asignacion-ayudas-listado.component';
import { ListadoPendientesComponent } from '../../components/admin/asignacion-ayudas-listado/listado-pendientes/listado-pendientes.component';
import { ListadoAprobadasComponent } from '../../components/admin/asignacion-ayudas-listado/listado-aprobadas/listado-aprobadas.component';
import { ListadoRechazadasComponent } from '../../components/admin/asignacion-ayudas-listado/listado-rechazadas/listado-rechazadas.component';
import { monitorias_routes } from 'src/app/components/admin/monitorias/monitorias.routes';
import { IndicadoresComponent } from 'src/app/components/admin/indicadores/indicadores.component';



export const ADMIN_ROUTES: Routes = [
    { path: 'principal', component: PrincipalComponent , canActivate:[AuthGuard] },
    { path: 'dashboard', component: DashboardComponent , canActivate:[AuthGuard] },
    { path: 'periodos', component: PeriodosComponent, data: {title:'Periodos'}, canActivate: [AuthGuard] },
    { path: 'facultades', component: FacultadesComponent , canActivate:[AuthGuard] },
    { path: 'programas', component: ProgramasComponent , canActivate:[AuthGuard] },
    { path: 'changePassword', component: CambiarContrasenaComponent , canActivate:[AuthGuard] },
    { path: 'cuantificacionPlazas/:id', component: CuantificacionPlazasComponent , canActivate:[AuthGuard] },
    { path: 'horasActividades/:id', component: HorasActividadesComponent , canActivate:[AuthGuard] },
    { path: 'supervisorAyudantia/:id', component: SupervisorAyudantiaComponent , canActivate:[AuthGuard] },
    { path: 'lugares', component: LugaresComponent , canActivate:[AuthGuard] },
    { path: 'diasProfesionales/:id', component: ProfesionalDiasConsultoriosComponent , canActivate:[AuthGuard] },
    { path: 'DiasNoLaborables', component: DiasNoLaborablesComponent , canActivate:[AuthGuard] },
    { path: 'citasAgenda', component: CitasComponent , canActivate:[AuthGuard] },
    { path: 'agendaCitas', component: AgendaCitasComponent , canActivate:[AuthGuard] },
    { path: 'miCitas', component: MiCitasComponent , canActivate:[AuthGuard] },
    { path: 'agendaDiaria/:id', component: AgendaCitasDiariasComponent , canActivate:[AuthGuard] },
    { path: 'agenda/:id', component: AgendaComponent, canActivate:[AuthGuard] },
    { path: 'actualizarDatos', component: ActualizarDatosComponent , canActivate:[AuthGuard] },
    { path: 'actualizarDatos/:id', component: ActualizarDatosComponent  },
    { path: 'registroExtemporanea', component: RegistroExtemporaneasComponent , canActivate:[AuthGuard] },
    { path: 'estudiantesEvaluador', component: ListarEstudiantesAsignadosComponent , canActivate:[AuthGuard] },
    { path: 'reportePorDias', component: ReporteAsignacionDiasComponent , canActivate:[AuthGuard] },
    { path: 'reporte-entregas/:id', component: ReporteEntregasComponent , canActivate:[AuthGuard],
        data: {title:'Reporte entregas por días', roles:['AdminRefrigerios','ContaduriaBeneficios']},
    },
    { path: 'reporte-entregas-estudiantes/:id', component: ReporteEntregasEstudiantesComponent , canActivate:[AuthGuard],
        data: {title:'Reporte entregas por estudiantes', roles:['AdminRefrigerios','ContaduriaBeneficios']},
    },
    { path: 'reportes/:id', component: ReportesRefrigeriosComponent , canActivate:[AuthGuard],
    data: {title:'Reporte entregas por estudiantes', roles:['AdminRefrigerios','ContaduriaBeneficios','ProyeccionSocial']},
    },
    { 
        path: 'reporte', 
        children: REPORTES_ROUTES,
        data: {title:'Reportes de almuerzos y refrigerios', roles:['AdminRefrigerios','ContaduriaBeneficios']},
        canActivate:[AuthGuard],

    },
    { 
        path: 'convocatorias', 
        children: convocatorias_routes,
        data: {title:'Convocatorias', roles:['Admin', 'Unidad', 'Revisor', 'AdminMonitorias', 'ComiteMonitorias','UnidadMonitorias']},
        canActivate:[AuthGuard],

    },
    { 
        path: 'bolsasPresupuestales', 
        //component: CrearBolsaComponent,
        children: bolsasPresupuestales_routes,
        canActivate:[AuthGuard],
        data: { title:'Bolsas presupuestales', roles: ['Admin', 'AdminMonitorias'] }
    },
    {
        path: 'plazas',
        children: plazas_routes,
        canActivate:[AuthGuard], 
        data: { title:'Plazas', roles: ['Admin','Unidad','Revisor', 'AdminMonitorias', 'ComiteMonitorias','UnidadMonitorias','EvaluadorMonitoria'] }
    },
    {
        path: 'unidades',
        children: unidades_routes,
        canActivate:[AuthGuard],
        data: { title:'Unidades', roles: ['Admin', 'AdminMonitorias'] }
    },
    {
        path: 'estudiantes',
        children: estudiantes_routes,
        data: {title:'Estudiantes'},
        canActivate:[AuthGuard], 
    },
    {
        path: 'usuarios',
        children: usuarios_routes,
        canActivate:[AuthGuard],
        data: { title:'Usuarios', roles: ['Admin', 'AdminMonitorias'] }
    },
    {
        path: 'supervisor',
        children: supervisor_routes,
        data: {title:'Supervisor', roles:['Admin', 'AdminMonitorias', 'Unidad', 'UnidadMonitorias', 'ComiteMonitorias', 'SupervisorAyudante', 'Revisor']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'ayuda',
        component: AyudaComponent,
        data: {title:'Ayuda', roles:['Admin', 'AdminMonitorias','Unidad','UnidadMonitorias','SupervisorAyudante','EvaluadorMonitoria']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'beneficios',
        component: BeneficiosComponent,
        data: {title:'Beneficios', roles:['Admin','Unidad','SupervisorAyudante', 'AdminRefrigerios']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'periodosRefrigerios',
        component: PeriodosRefrigeriosComponent,
        data: {title:'Periodos de almuerzos y refrigerios', roles:['AdminRefrigerios']},
        canActivate:[AuthGuard], 
    },    
    {
        path: 'cafeterias',
        component: CafeteriasComponent,
        data: {title:'Cafeterias', roles:['AdminRefrigerios', 'AdminCafeteria']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'usuariosCafeteria',
        component: UsuariosCafeteriaComponent,
        data: {title:'Usuarios cafetería', roles:['AdminRefrigerios', 'AdminCafeteria']},
        canActivate:[AuthGuard], 
    },
    { 
        path: 'convocatoriasRefrigerio', 
        children: convocatorias_refrigerios_routes,
        data: {title:'Convocatorias almuerzos y refrigerios'},
        canActivate:[AuthGuard],

    },
    {
        path: 'diasNoHabilitados',
        component: DiasNohabilitadosComponent,
        data: {title:'Días no habilitados', roles:['AdminRefrigerios']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'condiciones',
        children: condiciones_routes,
        canActivate:[AuthGuard],
        data: { title:'Condiciones', roles: ['Admin', 'AdminMonitorias', 'AdminAyudas'] }
    },
    {
        path: 'inscripcion/:id',
        component: InscripcionEstudiantesComponent,
        data: {title:'Inscripción almuerzos y refrigerios'},
        canActivate:[AuthGuard], 
    },
    {
        path: 'inscripcion-artistas-deportistas/:id',
        component: InscripcionEstudiantesDeportistasComponent,
        data: {title:'Inscripción de artistas y deportistas', roles:['Estudiante']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'listado-inscripciones',
        component: ListaInscripcionesComponent,
        data: {title:'Listado de inscripción de artistas y deportistas', roles:['Estudiante']},
        canActivate:[AuthGuard], 
    },
    { 
        path: 'inscritos/:id', 
        component: ListadoInscritosComponent,
        data: {title:'Listado de inscritos a almuerzos y refrigerios', roles:['AdminRefrigerios','ProyeccionSocial']},
        canActivate:[AuthGuard],
    },
    {
        path: 'profesionalesSalud',
        children: profesionales_routes,
        data: {title:'Profesionales de la salud', roles:['AdminSalud']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'atenciones',
        children: atenciones_routes,
        // data: {title:'Atenciones', roles:['AdminSalud']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'recepcion/:id',
        component: RecepcionComponent,
        data: {title:'Recepción de almuerzos y refrigerios', roles:['AdminRefrigerios','AsistenteCafeteria','AdminCafeteria']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'configuracionAsignaturas',
        component: ConfiguracionasignaturasComponent,
        data: {title:'Configuración de asignaturas', roles:['Admin', 'UnidadMonitorias']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'encuestaMonitorias/:id',
        component: EncuestasMonitoriasComponent,
        data: {title:'Encuesta de Monitorías', roles:['SupervisorAyudante', 'Estudiante']}, // Falta agregar el rol del docente de la asignatura
        canActivate:[AuthGuard], 
    },
    {
        path: 'nivelesProfesionales',
        children: nivelesProfesionales_routes,
        data: {title:'Niveles profesionales', roles:['AdminSalud']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'estudiosRealizados',
        children: estudiosRealizados_routes,
        data: {title:'Estudios realizados', roles:['AdminSalud']},
        canActivate:[AuthGuard], 
    },
    {
        path: 'tiposProfesionales',
        children: tiposProfesionalesSalud_routes,
        data: {title:'Tipos de profesionales', roles:['AdminSalud']},
        canActivate:[AuthGuard], 
    },
    { 
        path: 'perfil', 
        component: PerfilComponent,
        // children: bolsasPresupuestales_routes,
        canActivate:[AuthGuard],
        // data: { title:'Perfil', roles: ['ProfesionalSalud'] }
    },
    {
        path: 'perfilRefrigerios',
        component: PerfilRefrigeriosComponent,
        data: {title:'Perfil beneficio alimenticio'},
        canActivate:[AuthGuard], 
    },
    {
        path: 'excusas',
        component: ExcusasComponent,
        data: {title:'Excusas beneficio'},
        canActivate:[AuthGuard], 
    },
    { 
        path: 'cancelaciones/:id', 
        component: SolicicitudesCancelacionComponent,
        data: {title:'Listado de solicitudes de cancelación al programa de beneficio alimenticio', roles:['AdminRefrigerios']},
        canActivate:[AuthGuard],
    },
    {   path: 'editarInscripcion/:id/:beneficio', 
        data: {title:'Editar beneficio alimenticio'}, 
        component: EditarInscripcionComponent,
        canActivate:[AuthGuard]
    },
    { 
        path: 'inscripcionAdministrativa', 
        component: InscripcionAdministrativaComponent,
        data: {title:'Inscripción a beneficio alimenticio', roles:['AdminRefrigerios']},
        canActivate:[AuthGuard],
    },
    { 
        path: 'entregaExtemporanea', 
        component: EntregaExtemporaneaComponent,
        data: {title:'Registro administrativo de entregas a beneficios extemporaneas', roles:['AdminRefrigerios', 'EntregasExtemporaneas']},
        canActivate:[AuthGuard],
    },
    { 
        path: 'listadoFallas/:id', 
        component: ListadoFallasComponent,
        data: {title:'Listado de fallas estudiantiles', roles:['AdminRefrigerios','ProyeccionSocial']},
        canActivate:[AuthGuard],
    },
    { 
        path: 'listadoEntregasEstados/:id', 
        component: ListadoEntregasEstadosComponent,
        data: {title:'Reporte de entregas por estado', roles:['AdminRefrigerios','ProyeccionSocial']},
        canActivate:[AuthGuard],
    },
    { 
        path: 'modalidades', 
        component: ModalidadComponent,
        data: {title:'Creación de modalidades',roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    { 
        path: 'criteriosSeleccion/:id', 
        component: CriteriosSeleccionComponent,
        data: {title:'Criterios de estudiantes seleccionados', roles:['AdminRefrigerios','ProyeccionSocial']},
        canActivate:[AuthGuard],
    },
    {
        path: 'disciplinas', 
        component: DisciplinaComponent,
        data: {title:'Creación de disciplina', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    { 
        path: 'convocatorias-artistas-deportistas',
        children: convocatorias_routes_artistas_deportistas,
        data: {title:'Convocatorias de artistas y deportistas',roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    { 
        path: 'evaluacion-estudiantes-deportistas',
        children: evaluacion_routes_artistas_deportistas,
        data: {title:'Evaluación de deportistas y artistas', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'crear-clase', 
        component: CrearClasesComponent,
        data: {title:'Creación de clases', roles:['SupervisorDeportistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'crear-clase/:id', 
        component: CrearClasesComponent,
        data: {title:'Creación de clases', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'listar-supervisores', 
        component: ListarSupervisoresComponent,
        data: {title:'Listar supervisores', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'asignar-estudiantes-clase/:id', 
        component: AsignarEstudiantesDeportistasComponent,
        data: {title:'Asignación de estudiantes a clase', roles:['AdminDeportistasArtistas', 'SupervisorDeportistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'listar-grupos', 
        component: GruposComponent,
        data: {title:'Listado de grupos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'crear-grupo', 
        component: CrearGrupoComponent,
        data: {title:'Creación de grupos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'editar-grupo/:id', 
        component: EditarGrupoComponent,
        data: {title:'Edición de grupos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'detalles-grupo/:id', 
        component: DetallesGrupoComponent,
        data: {title:'Detalles de grupos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'inscripcion-grupos', 
        component: InscripcionGruposComponent,
        data: {title:'Inscripción a grupos deportivos y culturales', roles:['Estudiante']},
        canActivate:[AuthGuard]
    },
    {
        path: 'estudiantes-postulados/:idPeriodo/:idGrupo', 
        component: ListarEstudiantesPostuladosGruposComponent,
        data: {title:'Listado de estudiantes postulados a los grupos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'listar-roles/:idGrupo', 
        component: ListarRolesComponent,
        data: {title:'Listado de roles de los grupos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'plantillas-convocatorias', 
        component: PlantillasConvocatoriasComponent,
        data: {title:'Plantillas convocatorias', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'meritos-grupos/:id/:tipoMerito', 
        component: MeritosGruposComponent,
        data: {title:'Méritos', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'crear-disciplina', 
        component: CrearDisciplinaComponent,
        data: {title:'Creación de disciplina', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'detalles-disciplina/:id', 
        component: DetallesDisciplinaComponent,
        data: {title:'Detalles de disciplina', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'editar-disciplina/:id', 
        component: EditarDisciplinaComponent,
        data: {title:'Edición de disciplina', roles:['AdminDeportistasArtistas']},
        canActivate:[AuthGuard]
    },
    {path: 'pruebaPerfil', component: PerfilSaludComponent , canActivate:[AuthGuard] },
    { 
        path: 'refrigerios', 
        children: REFRIGERIOS_ROUTES,
        data: {title:'Módulo de refrigerios', roles:['Admin', 'AdminRefrigerios', 'AdminCafeteria', 'AsistenteCafeteria', 'Estudiante']},
        canActivate:[AuthGuard],

    },

    { 
        path: 'comitesMonitorias', 
        children: comitesMonitorias_routes,
        data: {title:'Comités de Monitorías', roles:['AdminMonitorias', 'ComiteMonitorias']},
        canActivate:[AuthGuard],

    },
    { 
        path: 'encuestas-refriferios',
        children: ENCUESTAS_REFRIGERIOS_ROUTES,
        data: {title:'Encuestas de satisfacción del servicio', roles:['AdminRefrigerios', 'Admin']},
        canActivate:[AuthGuard],

    },
    { 
        path: 'ratificacionEstudiantes',
        children: ratificacion_routes,
        data: {title:'Ratificación de estudiantes', roles:['UnidadMonitorias', 'AdminMonitorias']},
        canActivate:[AuthGuard],

    },
    {
        path: 'solicitudAyudas', 
        component: AsignacionAyudasComponent,
        data: {title:'Asignación de ayudas', roles:['AdminAyudas','RegistroAyudas']},
        canActivate:[AuthGuard]
    },
    {
        path: 'listadoSolicitudAyudas', 
        children: [
            {
                path: 'listado-pendientes', 
                component: ListadoPendientesComponent,
            },
            {
                path: 'listado-aprobadas', 
                component: ListadoAprobadasComponent,
            },
            {
                path: 'listado-rechazadas', 
                component: ListadoRechazadasComponent,
            }
            
        ],

        component: AsignacionAyudasListadoComponent,
        data: {title:'Listado de solicitudes de ayudas', roles:['AdminAyudas','RegistroAyudas']},
        canActivate:[AuthGuard]
    },
    { 
        path: 'monitorias', 
        children: monitorias_routes,
        data: {title:'Monitorías', roles:['AdminMonitorias', 'ComiteMonitorias']},
        canActivate:[AuthGuard],

    },
    {
        path: 'indicadores',
        component: IndicadoresComponent,
        data: {title:'Resumen indicadores', roles:['Admin', 'ComiteMonitorias','UserIndicadores']},
        canActivate:[AuthGuard],
    },
];
