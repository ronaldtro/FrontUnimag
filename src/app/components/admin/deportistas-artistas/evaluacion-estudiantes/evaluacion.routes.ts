import { Routes } from '@angular/router';

import { AuthGuard } from 'src/app/guards/auth.guard';
import { ListarEstudiantesDeportistasComponent } from './listar-estudiantes-postulados/listar-estudiantes.component';
import { EvaluarEstudiantesDeportistasComponent } from './evaluar/evaluar-estudiantes.component';
import { ListarEstudiantesSeleccionadosComponent } from './listar-estudiantes-seleccionados/listar-estudiantes-seleccionados.component';

export const evaluacion_routes_artistas_deportistas: Routes = [
    { path: ':id', component: ListarEstudiantesDeportistasComponent, canActivate:[AuthGuard]},
    { path: 'evaluar-estudiante/:idDisciplinaConvocatoria/:idInscripcion', component: EvaluarEstudiantesDeportistasComponent, canActivate:[AuthGuard] },
    { path: 'listar-estudiantes/:id', component: ListarEstudiantesDeportistasComponent, canActivate:[AuthGuard] },
    { path: 'seleccionados/:id', component: ListarEstudiantesSeleccionadosComponent, canActivate:[AuthGuard] },
    { path: '**', pathMatch: 'full', redirectTo:''}
];

