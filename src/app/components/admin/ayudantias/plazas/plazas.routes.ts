import { Routes } from '@angular/router';
import { CrearPlazaComponent } from './crear-plaza/crear-plaza.component';
import { EditarPlazaComponent } from './editar-plaza/editar-plaza.component';
import { ListarPlazasComponent } from './listar-plazas/listar-plazas.component';
import { TiposPlazasComponent } from './tipos-plazas/tipos-plazas.component';
import { CriteriosEvaluacionComponent } from './criterios-evaluacion/criterios-evaluacion.component';
import { EstudiantesPlazasComponent } from './estudiantes-plazas/estudiantes-plazas.component';
import { PlazasAprobadasComponent } from './plazas-aprobadas/plazas-aprobadas.component';
import { EvaluacionEstudianteComponent } from './evaluacion-estudiante/evaluacion-estudiante.component';
import { VerPlazaComponent } from './ver-plaza/ver-plaza.component';
import { EstudianteEvaluadoComponent } from './estudiante-evaluado/estudiante-evaluado.component';
import { EstudiantesEvaluadosComponent } from './estudiantes-evaluados/estudiantes-evaluados.component';
import { LogsEstudianteComponent } from './logs-estudiante/logs-estudiante.component';
import { HistorialPlazasComponent } from './historial-plazas/historial-plazas.component';


export const plazas_routes: Routes = [
    { path: 'solicitar', data: {title:'Solicitar plaza'}, component: CrearPlazaComponent },
    { path: 'solicitar/:id/:tipoConvocatoria', data: {title:'Solicitud de plaza'}, component: CrearPlazaComponent },
    { path: 'solicitar/:id', data: {title:'Solicitud de plaza'}, component: CrearPlazaComponent },
    
    // { path: 'editar-solicitud/:id', data: {title:'Editar solicitud de plaza'}, component: EditarPlazaComponent },
    { path: 'editar-solicitud', data: {title:'Editar solicitud de plaza'}, component: EditarPlazaComponent },
    { path: 'editar-solicitud/:id/:tipoConvocatoria', data: {title:'Editar solicitud de plaza'}, component: EditarPlazaComponent },
    { path: 'listarPlazasSolicitadas', data: {title:'Listado de plazas solicitadas'}, component: ListarPlazasComponent },
    { path: 'listarPlazasSolicitadas/:id/:tipoConvocatoria', data: {title:'Listado de plazas solicitadas'}, component: ListarPlazasComponent },
    { path: 'listarPlazasSolicitadas/:id', data: {title:'Listado de plazas solicitadas'}, component: ListarPlazasComponent },
    { path: 'tipoPlaza', data: {title:'Tipos de plaza'}, component: TiposPlazasComponent },
    { path: 'criteriosEvaluacion/:id', data: {title:'Criterios de evaluación'}, component: CriteriosEvaluacionComponent },
    { path: ':id/estudiantes', component: EstudiantesPlazasComponent },
    { path: ':id/estudiantes/:id_C', component: EstudiantesPlazasComponent },
    { path: 'estudiantesEvaluados/:id', component: EstudiantesEvaluadosComponent},
    { path: 'plazasRespondidas', data: {title:'Plazas respondidas'}, component: PlazasAprobadasComponent,  },
    { path: 'plazasRespondidas/:id/:tipoConvocatoria', data: {title:'Plazas respondidas'}, component: PlazasAprobadasComponent },
    { path: 'plazasRespondidas/:tipoConvocatoria', data: {title:'Plazas respondidas'}, component: PlazasAprobadasComponent },
    { path: 'historialPlazas', data: {title:'Historial plazas'}, component: HistorialPlazasComponent },
    { path: 'evaluarEstudiante/:id' , data: {title:'Evaluación de estudiante'}, component: EvaluacionEstudianteComponent},
    { path: 'estudianteEvaluado/:id' , data: {title:'Estudiante evaluado'},component: EstudianteEvaluadoComponent},
    { path: 'verPlaza/:id', data: {title:'Visualización de plaza'}, component: VerPlazaComponent},
    { path: ':id/observaciones', data: {title:'Libreta de observaciomes'}, component: LogsEstudianteComponent},
    { path: '**', pathMatch: 'full', redirectTo:'/principal'},
];