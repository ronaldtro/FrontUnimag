
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { LoginComponent } from '../../components/public/login/login.component';
import { ConvocatoriaComponent } from '../../components/public/convocatoria/convocatoria.component';
import { informacion_plazas } from '../../components/public/plazas/plazas.routes';
import { ListaPlazasComponent } from '../../components/public/lista-plazas/lista-plazas.component';
import { publicEstudiantes_routes } from 'src/app/components/public/estudiantes/public-estudiantes.routes';
import { EntrevistasEstudiantesComponent } from 'src/app/components/public/entrevistas-estudiantes/entrevistas-estudiantes.component';
import { GeneralesComponent } from 'src/app/components/admin/ayudantias/consultas/generales/generales.component';
import { ConvocatoriaRefrigeriosComponent } from '../../components/public/refrigerios/convocatoria-refrigerios/convocatoria-refrigerios.component';
import { DetalleConvocatoriaRefrigeriosComponent } from '../../components/public/refrigerios/detalle-convocatoria-refrigerios/detalle-convocatoria-refrigerios.component';
import { ConvocatoriaMonitoriaComponent } from 'src/app/components/public/convocatoria-monitoria/convocatoria-monitoria.component';
import { ListaDisciplinasComponent } from 'src/app/components/public/deportistas-artistas/lista-disciplinas/lista-disciplinas.component';
import { EstadoConvocatoriaDeportistasComponent } from 'src/app/components/public/deportistas-artistas/estado-convocatoria-deportistas/estado-convocatoria-deportistas.component';
import { ConvocatoriaDeportistasComponent } from 'src/app/components/public/deportistas-artistas/convocatoria-deportistas/convocatoria-deportistas.component';
import { ListaGruposComponent } from 'src/app/components/public/deportistas-artistas/lista-grupos-disciplinas/lista-grupos.component';
import { DetalleGrupoComponent } from 'src/app/components/public/deportistas-artistas/detalle-grupo/detalle-grupo.component';
import { ListaSeleccionadosDeportistasComponent } from 'src/app/components/public/deportistas-artistas/lista-seleccionados/lista-seleccionados.component';
import { publicDeportistas_routes } from 'src/app/components/public/deportistas-artistas/public-deportistas.routes';
import { EncuestasMonitoriasComponent } from 'src/app/components/admin/ayudantias/encuestas-monitorias/encuestas-monitorias.component';
 
export const PUBLIC_ROUTES: Routes = [
    
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'convocatoria', data: {title:'Convocatorias'}, component: ConvocatoriaComponent },
    { path: 'convocatoria/:tipo_convocatoria', data: {title:'Convocatorias'}, component: ConvocatoriaComponent },
    { path: 'convocatoria-monitoria', data: {title:'Convocatorias'}, component: ConvocatoriaMonitoriaComponent },
    { path: 'plazasConvocatorias/:id', data: {title:'Plazas de convocatoria'}, component: ListaPlazasComponent },
    { path: 'plazasConvocatorias/:id/:codigo', data: {title:'Plazas de convocatoria'}, component: ListaPlazasComponent },
    { path: 'entrevistasEstudiantes/:id', data: {title:'Entrevistas estudiantes'}, component: EntrevistasEstudiantesComponent },
    { path: 'consultasGenerales', component: GeneralesComponent  },
    
    {   
        path: 'plaza', 
        children : informacion_plazas
    },
    {
        path: 'estudiantes',
        children: publicEstudiantes_routes,
        data: { title:'Estudiantes'}
    },
    {
        path: 'deportistas-artistas',
        children: publicDeportistas_routes,
        data: { title:'Deportistas'}
    },
    {path: 'login', data: {title:'Inicio de sesión'}, component: LoginComponent},

    { path: 'convocatoriaRefrigerios', data: {title:'Convocatorias de almuerzos y refrigerios'}, component: ConvocatoriaRefrigeriosComponent },
    { path: 'detalleConvocatoria/:id', data: {title:'Detalle convocatoria de almuerzos y refrigerios'}, component: DetalleConvocatoriaRefrigeriosComponent },
    {
        path: 'encuestaMonitorias/:tipo_encuesta/:token',
        component: EncuestasMonitoriasComponent,
        data: {title:'Encuesta de evaluación de monitorías'}, // Falta agregar el rol del docente de la asignatura
        
    }
];