import { Routes } from '@angular/router';
import { PerfilEstudianteComponent } from './perfil-estudiante/perfil-estudiante.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { EstudianteCondicionComponent } from './estudiante-condicion/estudiante-condicion.component';
import { DashboardEstudianteComponent } from './dashboard-estudiante/dashboard-estudiante.component';
import { ListadoFallasEstudianteComponent } from '../refrigerios/estudiantes/listado-fallas-estudiante/listado-fallas-estudiante.component';
import { AuthGuard } from 'src/app/guards/auth.guard';


export const estudiantes_routes: Routes = [
    { path: 'perfil', component: PerfilEstudianteComponent },
    { path: 'perfil/:tipo-convocatoria', component: PerfilEstudianteComponent },
    { path: 'dashboard', component: DashboardEstudianteComponent },
    { path: 'actividades/:id', component: ActividadesComponent },
    { path: 'listadoFallasEstudiante/:id', component: ListadoFallasEstudianteComponent},
    { path: 'condicionesEstudiantes', component: EstudianteCondicionComponent ,canActivate: [AuthGuard],
    data: { title:'Estudiantes con condiciones especiales', roles: ['AdminRefrigerios', 'AdminAyudas', 'RegistroAyudas']}
    },
    { path: '**', pathMatch: 'full', redirectTo:'/'},
];