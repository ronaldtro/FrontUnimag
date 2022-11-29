import { Routes } from '@angular/router';
import { ActividadesSupervisorComponent } from './actividades-supervisor/actividades-supervisor.component';
import { EstudiantesSupervisorComponent } from './estudiantes-supervisor/estudiantes-supervisor.component';


export const supervisor_routes: Routes = [
    { path: 'estudiante/:id/actividades', component: ActividadesSupervisorComponent },
    { path: 'estudiantes', component: EstudiantesSupervisorComponent },
    { path: '**', pathMatch: 'full', redirectTo:'/'},
];