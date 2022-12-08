import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID  } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomFormsModule } from 'ng2-validation'
import { ToastModule } from 'primeng/toast';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { registerLocaleData } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/public/navbar/navbar.component';
import { FooterComponent } from './components/shared/public/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { APP_ROUTING } from './app.routes';
import { FooterPrivateComponent } from './components/shared/private/footer/footer.component';
import { NavbarPrivateComponent } from './components/shared/private/navbar/navbar.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { PeriodosComponent } from './components/admin/ayudantias/periodos/periodos.component';

import { PeriodoService } from "./services/periodo.service";
import { TipoPlazaService } from "./services/tipo-plaza.service";
import { CrearComponent } from './components/admin/ayudantias/convocatorias/crear/crear.component';
import { CrearConvocatoriaArtistasDeportistasComponent } from './components/admin/deportistas-artistas/convocatorias/crear/crear.component';
import { ListarBolsasComponent } from './components/admin/bolsasPresupuestales/listar-bolsas/listar-bolsas.component';
import { KeysPipe } from './pipes/keys.pipe';
import { IDToNamePipe } from './pipes/idto-name.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { CrearPlazaComponent } from './components/admin/ayudantias/plazas/crear-plaza/crear-plaza.component';
import { PlazaService } from './services/plaza.service';
import { SelecPlazaPipe } from './pipes/selec-plaza.pipe';
import { obtenerFechaPipe } from './pipes/obtenerFecha.pipe';
import { BolsaPresupuestalService } from './services/bolsa-presupuestal.service';
import { GuardarBolsaComponent } from './components/admin/bolsasPresupuestales/guardar-bolsa/guardar-bolsa.component';

import { EditarPlazaComponent } from './components/admin/ayudantias/plazas/editar-plaza/editar-plaza.component';
import { DonseguroPipe } from './pipes/donseguro.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { ListarConvocatoriasComponent } from './components/admin/ayudantias/convocatorias/listar-convocatorias/listar-convocatorias.component';
import { LoginComponent } from './components/public/login/login.component';
import { LoginComponent as LoginEstudianteComponent } from './components/public/estudiantes/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { TiposPlazasComponent } from './components/admin/ayudantias/plazas/tipos-plazas/tipos-plazas.component';
import { SearchPipe } from './pipes/search.pipe';

import { EditarConvocatoriasComponent } from './components/admin/ayudantias/convocatorias/editar-convocatorias/editar-convocatorias.component';
import { DataFilterPipe } from './pipes/data-filter.pipe';
import { HistorialConvocatoriasComponent } from './components/admin/ayudantias/convocatorias/historial-convocatorias/historial-convocatorias.component';
import { ListarPlazasComponent } from './components/admin/ayudantias/plazas/listar-plazas/listar-plazas.component';
import { ListarUnidadesComponent } from './components/admin/ayudantias/unidades/listar-unidades/listar-unidades.component';
import { GuardarUnidadComponent } from './components/admin/ayudantias/unidades/guardar-unidad/guardar-unidad.component';
import { CriteriosEvaluacionComponent } from './components/admin/ayudantias/plazas/criterios-evaluacion/criterios-evaluacion.component';
import { ConvocatoriaComponent } from './components/public/convocatoria/convocatoria.component';
import { PlazasInformacionComponent } from './components/public/plazas/plazas-informacion/plazas-informacion.component';
import { FacultadesComponent } from './components/admin/facultades/facultades.component';
import { FacultadesService } from './services/facultades.service';
import { ProgramasComponent } from './components/admin/programas/programas.component';
import { ProgramaService } from './services/programas.service';
import { ListaPlazasComponent } from './components/public/lista-plazas/lista-plazas.component';
import { PerfilEstudianteComponent } from './components/admin/estudiantes/perfil-estudiante/perfil-estudiante.component';
import { EstudiantesPlazasComponent } from './components/admin/ayudantias/plazas/estudiantes-plazas/estudiantes-plazas.component';
import { PlazasAprobadasComponent } from './components/admin/ayudantias/plazas/plazas-aprobadas/plazas-aprobadas.component';
import { EvaluacionEstudianteComponent } from './components/admin/ayudantias/plazas/evaluacion-estudiante/evaluacion-estudiante.component';
import { EvaluarEstudianteService } from './services/evaluar-estudiante.service';
import { VerPlazaComponent } from './components/admin/ayudantias/plazas/ver-plaza/ver-plaza.component';
import { ControlValueAccesorComponent } from './components/control-value-accesor/control-value-accesor.component';
import { EstudianteEvaluadoComponent } from './components/admin/ayudantias/plazas/estudiante-evaluado/estudiante-evaluado.component';
import { EstudiantesEvaluadosComponent } from './components/admin/ayudantias/plazas/estudiantes-evaluados/estudiantes-evaluados.component';

import { AdminComponent } from './layout/admin/admin.component';
import { PublicComponent } from './layout/public/public.component';
import { TitleService } from './services/title.service';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ActividadesComponent } from './components/admin/estudiantes/actividades/actividades.component';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { ChecklistModule } from 'angular-checklist';
import { PublicAprobadosComponent } from './components/public/plazas/public-aprobados/public-aprobados.component';
import { PublicEvaluadoComponent } from './components/public/plazas/public-evaluado/public-evaluado.component';
import { ListarUsuariosComponent } from './components/admin/usuarios/listar-usuarios/listar-usuarios.component';
import { EstudiantesSupervisorComponent } from './components/admin/ayudantias/supervisor/estudiantes-supervisor/estudiantes-supervisor.component';
import { ActividadesSupervisorComponent } from './components/admin/ayudantias/supervisor/actividades-supervisor/actividades-supervisor.component';
import { LogsEstudianteComponent } from './components/admin/ayudantias/plazas/logs-estudiante/logs-estudiante.component';
import { ConvocatoriaDetalleComponent } from './components/admin/ayudantias/convocatorias/convocatoria-detalle/convocatoria-detalle.component';
import {NgxPaginationModule} from 'ngx-pagination';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import localeEs from '@angular/common/locales/es-CO';
import { AyudaComponent } from './components/admin/ayuda/ayuda.component';
import { HistorialPlazasComponent } from './components/admin/ayudantias/plazas/historial-plazas/historial-plazas.component';
import { EntrevistasEstudiantesComponent } from './components/public/entrevistas-estudiantes/entrevistas-estudiantes.component';
import { ListadoEvaluadosComponent } from './components/public/estudiantes/listado-evaluados/listado-evaluados.component';
import { ListadoEstudiantesAprobadosComponent } from './components/public/estudiantes/listado-estudiantes-aprobados/listado-estudiantes-aprobados.component';
import { CuantificacionPlazasComponent } from './components/admin/ayudantias/consultas/cuantificacion-plazas/cuantificacion-plazas.component';
import { HorasActividadesComponent } from './components/admin/ayudantias/consultas/horas-actividades/horas-actividades.component';
import { SupervisorAyudantiaComponent } from './components/admin/ayudantias/supervisor-ayudantia/supervisor-ayudantia.component';
import { GeneralesComponent } from './components/admin/ayudantias/consultas/generales/generales.component';
import { BeneficiosComponent } from './components/admin/beneficios/beneficios.component';
import { PeriodosRefrigeriosComponent } from './components/admin/refrigerios/periodos-refrigerios/periodos-refrigerios.component';
import { CafeteriasComponent } from './components/admin/refrigerios/cafeterias/cafeterias.component';
import { UsuariosCafeteriaComponent } from './components/admin/refrigerios/usuarios-cafeteria/usuarios-cafeteria.component';
import { CrearConvocatoriaComponent } from './components/admin/refrigerios/convocatorias-refrigerios/crear-convocatoria/crear-convocatoria.component';
import { ListarConvocatoriasRefrigeriosComponent } from './components/admin/refrigerios/convocatorias-refrigerios/listar-convocatorias-refrigerios/listar-convocatorias-refrigerios.component';
import { DetalleConvocatoriasRefrigeriosComponent } from './components/admin/refrigerios/convocatorias-refrigerios/detalle-convocatorias-refrigerios/detalle-convocatorias-refrigerios.component';
import { EditarConvocatoriasRefrigeriosComponent } from './components/admin/refrigerios/convocatorias-refrigerios/editar-convocatorias-refrigerios/editar-convocatorias-refrigerios.component';
import { InscripcionEstudiantesComponent } from './components/admin/refrigerios/estudiantes/inscripcion-estudiantes/inscripcion-estudiantes.component';
import { EstudianteCondicionComponent } from './components/admin/estudiantes/estudiante-condicion/estudiante-condicion.component';
import { ListarCondicionesComponent } from './components/admin/condiciones/listar-condiciones/listar-condiciones.component';
import { CambiarContrasenaComponent } from './components/public/cambiar-contrasena/cambiar-contrasena.component';
import { ListadoInscritosComponent } from './components/admin/refrigerios/inscritos/listado-inscritos/listado-inscritos.component';
import { ProfesionalesComponent } from './components/admin/salud/profesionalesSalud/profesionales/profesionales.component';
import { GuardarProfesionalsaludComponent } from './components/admin/salud/profesionalesSalud/guardar-profesionalsalud/guardar-profesionalsalud.component';
import { ListarEstudiosrealizadosComponent } from './components/admin/salud/estudiosRealizados/listar-estudiosrealizados/listar-estudiosrealizados.component';
import { ListarNivelesprofesionalesComponent } from './components/admin/salud/nivelesProfesionales/listar-nivelesprofesionales/listar-nivelesprofesionales.component';

import { LugaresComponent } from './components/admin/lugares/lugares.component';
import { PrincipalComponent } from './components/shared/private/principal/principal.component';

import { ConvocatoriaRefrigeriosComponent } from './components/public/refrigerios/convocatoria-refrigerios/convocatoria-refrigerios.component';
import { DetalleConvocatoriaRefrigeriosComponent } from './components/public/refrigerios/detalle-convocatoria-refrigerios/detalle-convocatoria-refrigerios.component';
import { RecepcionComponent } from './components/admin/refrigerios/recepcion/recepcion.component';
import { TiposprofesionalessaludComponent } from './components/admin/salud/tiposProfesionalesSalud/tiposprofesionalessalud/tiposprofesionalessalud.component';
import { ProfesionalDiasConsultoriosComponent } from './components/admin/salud/profesional-dias-consultorios/profesional-dias-consultorios.component';
import { PerfilComponent } from './components/admin/salud/perfil/perfil.component';
import { DiasNoLaborablesComponent } from './components/admin/dias-no-laborables/dias-no-laborables.component';
import { CitasComponent } from './components/admin/salud/citas/citas.component';
import { ObtenerHoraPipe } from './pipes/obtener-hora.pipe';
import { DashboardEstudianteComponent } from './components/admin/estudiantes/dashboard-estudiante/dashboard-estudiante.component';
import { AgendaCitasComponent } from './components/admin/salud/agenda-citas/agenda-citas.component';
import { MiCitasComponent } from './components/admin/salud/mi-citas/mi-citas.component';
import { MedicinageneralComponent } from './components/admin/salud/atenciones/medicinageneral/medicinageneral.component';
import { PerfilRefrigeriosComponent } from './components/admin/refrigerios/estudiantes/perfil-refrigerios/perfil-refrigerios.component';
import { ConfiguracionasignaturasComponent } from './components/admin/ayudantias/configuracionasignaturas/configuracionasignaturas.component';
import { SolicicitudesCancelacionComponent } from './components/admin/refrigerios/inscritos/solicicitudes-cancelacion/solicicitudes-cancelacion.component';
import { EditarInscripcionComponent } from './components/admin/refrigerios/estudiantes/editar-inscripcion/editar-inscripcion.component';
import { AgendaCitasDiariasComponent } from './components/admin/salud/agenda-citas-diarias/agenda-citas-diarias.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { ActualizarDatosComponent } from './components/admin/salud/actualizar-datos/actualizar-datos.component';
import { DiasNohabilitadosComponent } from './components/admin/refrigerios/dias-nohabilitados/dias-nohabilitados.component';
import { AtencionService } from './services/atencion.service';

import { CalcularEdadPipe } from './pipes/calcular-edad.pipe';
import { InscripcionAdministrativaComponent } from './components/admin/refrigerios/inscripcion-administrativa/inscripcion-administrativa.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ExcusasComponent } from './components/admin/refrigerios/estudiantes/excusas/excusas.component';
import { EntregaExtemporaneaComponent } from './components/admin/refrigerios/entrega-extemporanea/entrega-extemporanea.component';
import { ListadoFallasComponent } from './components/admin/refrigerios/listado-fallas/listado-fallas.component';
import { ModalidadComponent } from './components/admin/deportistas-artistas/modalidades/modalidad.component';
import { AsistenteConvocatoriaComponent } from './components/admin/refrigerios/convocatorias-refrigerios/asistente-convocatoria/asistente-convocatoria.component';
import { CriteriosSeleccionComponent } from './components/admin/refrigerios/criterios-seleccion/criterios-seleccion.component';
import { DisciplinaComponent } from './components/admin/deportistas-artistas/disciplinas/listar-disciplinas/disciplina.component';
import { ListadoFallasEstudianteComponent } from './components/admin/refrigerios/estudiantes/listado-fallas-estudiante/listado-fallas-estudiante.component';
import { DetalleCitaComponent } from './components/admin/salud/detalle-cita/detalle-cita.component';
import { ReporteAsignacionDiasComponent } from './components/admin/refrigerios/reportes/reporte-asignacion-dias/reporte-asignacion-dias.component';
import { NoProgramadaComponent } from './components/admin/salud/atenciones/no-programada/no-programada.component';
import { ReporteEntregasComponent } from './components/admin/refrigerios/reportes/reporte-entregas/reporte-entregas.component';
import { ReporteEntregasEstudiantesComponent } from './components/admin/refrigerios/reportes/reporte-entregas-estudiantes/reporte-entregas-estudiantes.component';
import { ReportesRefrigeriosComponent } from './components/admin/refrigerios/reportes/ReportesRefrigerio/reportes-refrigerios/reportes-refrigerios.component';
import { RegistroExtemporaneasComponent } from './components/admin/refrigerios/registro-extemporaneas/registro-extemporaneas.component';
import { ListadoEntregasEstadosComponent } from './components/admin/refrigerios/listado-entregas-estados/listado-entregas-estados.component';
import { ListarConvocatoriasArtistasDeportistasComponent } from './components/admin/deportistas-artistas/convocatorias/listar-convocatorias/listar-convocatorias.component';
import { ConvocatoriaDetalleArtistasDeportistasComponent } from './components/admin/deportistas-artistas/convocatorias/convocatoria-detalle/convocatoria-detalle.component';
import { EditarConvocatoriasArtistasDeportistasComponent } from './components/admin/deportistas-artistas/convocatorias/editar-convocatorias/editar-convocatorias.component';
import { HistorialConvocatoriasArtistasDeportistasComponent } from './components/admin/deportistas-artistas/convocatorias/historial-convocatorias/historial-convocatorias.component';
import { AsociarDisciplinasComponent } from './components/admin/deportistas-artistas/convocatorias/asociar-disciplinas/asociar-disciplinas.component';
import { AsociarItemsComponent } from './components/admin/deportistas-artistas/convocatorias/asociar-items/asociar-items.component';

import { EnfermeriaComponent } from './components/admin/salud/atenciones/enfermeria/enfermeria.component';
import { ReporteEntregasConvocatoriasComponent } from './components/admin/refrigerios/reportes/reporte-entregas-convocatorias/reporte-entregas-convocatorias.component';
import { ReportesModule } from './components/admin/refrigerios/reportes/reportes.modules';
import { PsicologiaComponent } from './components/admin/salud/atenciones/psicologia/psicologia.component';
import { PerfilSaludComponent } from './components/admin/salud/perfil-salud/perfil-salud.component';
import { AgendaComponent } from './components/admin/salud/agenda/agenda.component';
import { RegistroIncapacidadComponent } from './components/admin/salud/atenciones/registro-incapacidad/registro-incapacidad.component';
import { LetrasPipe } from './pipes/letras.pipe';
import { DetalleCitaEnfermeriaComponent } from './components/admin/salud/detalle-cita-enfermeria/detalle-cita-enfermeria.component';
import { DiferenciaFechasPipe } from './pipes/diferencia-fechas.pipe';
import { InscripcionEstudiantesDeportistasComponent } from './components/admin/deportistas-artistas/estudiantes/inscripcion-estudiantes/inscripcion-estudiantes.component';
import { CapitalizePipePipe } from './pipes/capitalize-pipe.pipe';
import { MedicinaDeportivaComponent } from './components/admin/salud/atenciones/medicina-deportiva/medicina-deportiva.component';
import { EncuestaComponent } from './components/admin/refrigerios/estudiantes/encuesta/encuesta.component';
import { ListaInscripcionesComponent } from './components/admin/deportistas-artistas/estudiantes/lista-inscripciones/lista-inscripciones.component';
import { EvaluarEstudiantesDeportistasComponent } from './components/admin/deportistas-artistas/evaluacion-estudiantes/evaluar/evaluar-estudiantes.component';
import { ListarEstudiantesDeportistasComponent } from './components/admin/deportistas-artistas/evaluacion-estudiantes/listar-estudiantes-postulados/listar-estudiantes.component';
import { CrearClasesComponent } from './components/admin/deportistas-artistas/supervisores/crear-clases/crear-clases.component';
import { AsignarEstudiantesDeportistasComponent } from './components/admin/deportistas-artistas/supervisores/asignar-estudiantes/asignar-estudiantes.component';
import { ConvocatoriaMonitoriaComponent } from './components/public/convocatoria-monitoria/convocatoria-monitoria.component';
import { PostulacionPlazaComponent } from './components/public/plazas/postulacion-plaza/postulacion-plaza.component';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { ListarEstudiantesAsignadosComponent } from './components/admin/ayudantias/evaluar-monitorias/listar-estudiantes-asignados/listar-estudiantes-asignados.component';
import { ListarSupervisoresComponent } from './components/admin/deportistas-artistas/supervisores/listar-supervisores/listar-supervisores.component';
import { GruposComponent } from './components/admin/deportistas-artistas/grupos-deportivos/listar-grupos/grupos.component';
import { InscripcionGruposComponent } from './components/admin/deportistas-artistas/estudiantes/inscripcion-grupos/inscripcion-grupos.component';
import { MeritosGruposComponent } from './components/admin/deportistas-artistas/grupos-deportivos/meritos-grupos/meritos-grupos.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListaDisciplinasComponent } from './components/public/deportistas-artistas/lista-disciplinas/lista-disciplinas.component';
import { ListarEstudiantesPostuladosGruposComponent } from './components/admin/deportistas-artistas/grupos-deportivos/listar-estudiantes-postulados/listar-estudiantes-postulados.component';
import { ListarRolesComponent } from './components/admin/deportistas-artistas/grupos-deportivos/listar-roles/listar-roles.component';
import { PerfilDeportistasComponent } from './components/admin/deportistas-artistas/evaluacion-estudiantes/perfil-deportistas/perfil-deportistas.component';
import { EstadoConvocatoriaDeportistasComponent } from './components/public/deportistas-artistas/estado-convocatoria-deportistas/estado-convocatoria-deportistas.component';
import { PlantillasConvocatoriasComponent } from './components/admin/deportistas-artistas/plantillas-convocatorias/plantillas-convocatorias.component';
import { CrearGrupoComponent } from './components/admin/deportistas-artistas/grupos-deportivos/crear-grupo/crear-grupo.component';
import { EditarGrupoComponent } from './components/admin/deportistas-artistas/grupos-deportivos/editar-grupo/editar-grupo.component';
import { DetallesGrupoComponent } from './components/admin/deportistas-artistas/grupos-deportivos/detalles-grupo/detalles-grupo.component';
import { ConvocatoriaDeportistasComponent } from './components/public/deportistas-artistas/convocatoria-deportistas/convocatoria-deportistas.component';
import { ListaGruposComponent } from './components/public/deportistas-artistas/lista-grupos-disciplinas/lista-grupos.component';
import { DetalleGrupoComponent } from './components/public/deportistas-artistas/detalle-grupo/detalle-grupo.component';
import { ListaSeleccionadosDeportistasComponent } from './components/public/deportistas-artistas/lista-seleccionados/lista-seleccionados.component';
import { ListarEstudiantesSeleccionadosComponent } from './components/admin/deportistas-artistas/evaluacion-estudiantes/listar-estudiantes-seleccionados/listar-estudiantes-seleccionados.component';
import { CrearDisciplinaComponent } from './components/admin/deportistas-artistas/disciplinas/crear-disciplina/crear-disciplina.component';
import { DetallesDisciplinaComponent } from './components/admin/deportistas-artistas/disciplinas/detalles-disciplina/detalles-disciplina.component';
import { EditarDisciplinaComponent } from './components/admin/deportistas-artistas/disciplinas/editar-disciplina/editar-disciplina.component';
//import { MatTabsModule } from '@angular/material/tabs';
import { DetalleAtencionDeportologoComponent } from './components/admin/salud/detalle-atencion-deportologo/detalle-atencion-deportologo.component';
import { AtencionesNoProgramadasComponent } from './components/admin/salud/atenciones-no-programadas/atenciones-no-programadas.component';
import { ListarComitesComponent } from './components/admin/ayudantias/comites-monitorias/listar-comites/listar-comites.component';
import { HistorialComitesComponent } from './components/admin/ayudantias/comites-monitorias/historial-comites/historial-comites.component';
import { RolesComitesComponent } from './components/admin/ayudantias/comites-monitorias/roles-comites/roles-comites.component';
import { EstudiantesAtendidosComponent } from './components/admin/ayudantias/comites-monitorias/estudiantes-atendidos/estudiantes-atendidos.component';
import { EncuestasMonitoriasComponent } from './components/admin/ayudantias/encuestas-monitorias/encuestas-monitorias.component';
import { EncuestasRefrigeriosListarComponent } from './components/admin/refrigerios/encuestas/encuestas-refrigerios-listar/encuestas-refrigerios-listar.component';
import { VerResultadosEncuestasComponent } from './components/admin/ayudantias/comites-monitorias/ver-resultados-encuesta/ver-resultados-encuesta.component';
import { EstaEnEtapaPipe } from './pipes/esta-en-etapa.pipe';
import { RatificarComponent } from './components/admin/ayudantias/estudiantesRatificados/ratificar/ratificar.component';
import { CrearUsuarioComponent } from './components/admin/usuarios/crear-usuario/crear-usuario.component';
import { AsignacionAyudasComponent } from './components/admin/asignacion-ayudas/asignacion-ayudas.component';
import { AsignacionAyudasListadoComponent } from './components/admin/asignacion-ayudas-listado/asignacion-ayudas-listado.component';
import { ListadoPendientesComponent } from './components/admin/asignacion-ayudas-listado/listado-pendientes/listado-pendientes.component';
import { ListadoAprobadasComponent } from './components/admin/asignacion-ayudas-listado/listado-aprobadas/listado-aprobadas.component';
import { ListadoRechazadasComponent } from './components/admin/asignacion-ayudas-listado/listado-rechazadas/listado-rechazadas.component';
import { DetalleSolicitudAyudaComponent } from './components/admin/asignacion-ayudas-listado/detalle-solicitud-ayuda/detalle-solicitud-ayuda.component';
import { EnviosSinEntregaPipe } from './pipes/envios-sin-entrega.pipe';
import { ListaEstudiantesAtendidosComponent } from './components/admin/monitorias/lista-estudiantes-atendidos/lista-estudiantes-atendidos.component';
import { IndicadoresComponent } from './components/admin/indicadores/indicadores.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InformacionComplementariaEstudianteComponent } from './components/admin/informacion-complementaria-estudiante/informacion-complementaria-estudiante.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    FooterPrivateComponent,
    NavbarPrivateComponent,
    PeriodosComponent,
    CrearComponent,
    KeysPipe,
    CrearConvocatoriaArtistasDeportistasComponent,
    ListarConvocatoriasArtistasDeportistasComponent,
    ConvocatoriaDetalleArtistasDeportistasComponent,
    EditarConvocatoriasArtistasDeportistasComponent,
    HistorialConvocatoriasArtistasDeportistasComponent,
    GuardarBolsaComponent,
    ListarBolsasComponent,
    IDToNamePipe,
    OrderByPipe,
    CrearPlazaComponent,
    SelecPlazaPipe,
    EditarPlazaComponent,
    DonseguroPipe,
    ListarConvocatoriasComponent,
    LoginComponent,
    TiposPlazasComponent,
    SearchPipe,
    obtenerFechaPipe,
    EditarConvocatoriasComponent,
    DataFilterPipe,
    HistorialConvocatoriasComponent,
    ListarPlazasComponent,
    ListarUnidadesComponent,
    GuardarUnidadComponent,
    CriteriosEvaluacionComponent,
    ConvocatoriaComponent,
    PlazasInformacionComponent,
    FacultadesComponent,
    ProgramasComponent,
    ListaPlazasComponent,
    PerfilEstudianteComponent,
    EstudiantesPlazasComponent,
    PlazasAprobadasComponent,
    EvaluacionEstudianteComponent,
    VerPlazaComponent,
    ControlValueAccesorComponent,
    EstudianteEvaluadoComponent,
    EstudiantesEvaluadosComponent,
    AdminComponent,
    PublicComponent,
    DashboardComponent,
    PublicAprobadosComponent,
    ActividadesComponent,
    LimitToPipe,
    PublicEvaluadoComponent,
    ListarUsuariosComponent,
    EstudiantesSupervisorComponent,
    ActividadesSupervisorComponent,
    LogsEstudianteComponent,
    ConvocatoriaDetalleComponent,
    AyudaComponent,
    HistorialPlazasComponent,
    LoginEstudianteComponent,
    EntrevistasEstudiantesComponent,
    ListadoEvaluadosComponent,
    ListadoEstudiantesAprobadosComponent,
    CuantificacionPlazasComponent,
    HorasActividadesComponent,
    SupervisorAyudantiaComponent,
    GeneralesComponent,
    BeneficiosComponent,
    PeriodosRefrigeriosComponent,
    CafeteriasComponent,
    UsuariosCafeteriaComponent,
    CrearConvocatoriaComponent,
    ListarConvocatoriasRefrigeriosComponent,
    DetalleConvocatoriasRefrigeriosComponent,
    CambiarContrasenaComponent,
    EditarConvocatoriasRefrigeriosComponent,
    ListarCondicionesComponent,
    EstudianteCondicionComponent,
    InscripcionEstudiantesComponent,
    LugaresComponent,
    ConvocatoriaRefrigeriosComponent,
    DetalleConvocatoriaRefrigeriosComponent,
    ConvocatoriaRefrigeriosComponent,
    DetalleConvocatoriaRefrigeriosComponent,
    LugaresComponent,
    ListadoInscritosComponent,
    ProfesionalesComponent,
    GuardarProfesionalsaludComponent,
    ListarEstudiosrealizadosComponent,
    ListarNivelesprofesionalesComponent,
    LugaresComponent,
    PrincipalComponent,
    DiasNoLaborablesComponent,
    ConvocatoriaRefrigeriosComponent,
    DetalleConvocatoriaRefrigeriosComponent,
    RecepcionComponent,
    TiposprofesionalessaludComponent,
    ProfesionalDiasConsultoriosComponent,
    PerfilComponent,
    CitasComponent,
    ObtenerHoraPipe,
    DashboardEstudianteComponent,
    AgendaCitasComponent,
    MiCitasComponent,
    MedicinageneralComponent,
    DashboardEstudianteComponent,
    PerfilRefrigeriosComponent,
    ConfiguracionasignaturasComponent,
    SolicicitudesCancelacionComponent,
    EditarInscripcionComponent,
    AgendaCitasDiariasComponent,
    ProfileComponent,
    ActualizarDatosComponent,
    DiasNohabilitadosComponent,
    CalcularEdadPipe,
    InscripcionAdministrativaComponent,
    FilterPipe,
    ExcusasComponent,
    EntregaExtemporaneaComponent,
    ListadoFallasComponent,
    ModalidadComponent,
    DisciplinaComponent,
    AsistenteConvocatoriaComponent,
    CriteriosSeleccionComponent,
    DisciplinaComponent,
    DetalleCitaComponent,
    ReporteAsignacionDiasComponent,
    NoProgramadaComponent,
    ListadoFallasEstudianteComponent,
    DetalleCitaComponent,
    ReporteEntregasComponent,
    ReporteEntregasEstudiantesComponent,
    ReportesRefrigeriosComponent,
    RegistroExtemporaneasComponent,
    ListadoEntregasEstadosComponent,
    AsociarDisciplinasComponent,
    AsociarItemsComponent,
    EnfermeriaComponent,
    ReporteEntregasConvocatoriasComponent, 
    AgendaComponent, 
    DetalleCitaEnfermeriaComponent,
    PsicologiaComponent,
    PerfilSaludComponent,
    AgendaComponent,
    RegistroIncapacidadComponent,
    LetrasPipe,
    DiferenciaFechasPipe,
    InscripcionEstudiantesDeportistasComponent,
    CapitalizePipePipe,
    MedicinaDeportivaComponent,
    EncuestaComponent,
    ListaInscripcionesComponent,
    EvaluarEstudiantesDeportistasComponent,
    ListarEstudiantesDeportistasComponent,
    CrearClasesComponent,
    AsignarEstudiantesDeportistasComponent,
    ConvocatoriaMonitoriaComponent,
    PostulacionPlazaComponent,
    SentenceCasePipe,
    ListarEstudiantesAsignadosComponent,
    ListarSupervisoresComponent,
    GruposComponent,
    InscripcionGruposComponent,
    MeritosGruposComponent,
    ListaDisciplinasComponent,
    ListarEstudiantesPostuladosGruposComponent,
    ListarRolesComponent,
    PerfilDeportistasComponent,
    EstadoConvocatoriaDeportistasComponent,
    PlantillasConvocatoriasComponent,
    CrearGrupoComponent,
    EditarGrupoComponent,
    DetallesGrupoComponent,
    ConvocatoriaDeportistasComponent,
    ListaGruposComponent,
    DetalleGrupoComponent,
    ListaSeleccionadosDeportistasComponent,
    ListarEstudiantesSeleccionadosComponent,
    CrearDisciplinaComponent,
    DetallesDisciplinaComponent,
    EditarDisciplinaComponent,
    DetalleAtencionDeportologoComponent,
    AtencionesNoProgramadasComponent,
    ListarComitesComponent,
    HistorialComitesComponent,
    RolesComitesComponent,
    EstudiantesAtendidosComponent,
    EncuestasMonitoriasComponent,
    EncuestasRefrigeriosListarComponent,
    VerResultadosEncuestasComponent,
    EstaEnEtapaPipe,
    RatificarComponent,
    CrearUsuarioComponent,
    AsignacionAyudasComponent,
    AsignacionAyudasListadoComponent,
    ListadoPendientesComponent,
    ListadoAprobadasComponent,
    ListadoRechazadasComponent,
    DetalleSolicitudAyudaComponent,
    EnviosSinEntregaPipe,
    ListaEstudiantesAtendidosComponent,
    IndicadoresComponent,
    InformacionComplementariaEstudianteComponent,
    HomeMonitoriasComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,    
    HttpModule,
    HttpClientModule,
    FormsModule,
    APP_ROUTING,
    FileUploadModule,
    CalendarModule,
    SweetAlert2Module.forRoot(),
    DropdownModule,
    NgSelectModule,
    CustomFormsModule,
    ToastModule,
    DataTablesModule,
    NgxSpinnerModule,
    ChecklistModule,
    NgxPaginationModule,
    AutocompleteLibModule,
    FullCalendarModule, // for FullCalendar!,
    ReportesModule,
    CKEditorModule,
    NgApexchartsModule
    //MatTabsModule
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    PlazaService,
    PeriodoService,
    AuthGuard,
    TipoPlazaService, 
    BolsaPresupuestalService,
    PeriodoService,
    FacultadesService,
    ProgramaService,
    EvaluarEstudianteService,
    TitleService,
    AtencionService,
    { provide:LOCALE_ID, useValue: 'es-CO' }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(titleService: TitleService) {
    titleService.init();
  }
 }
