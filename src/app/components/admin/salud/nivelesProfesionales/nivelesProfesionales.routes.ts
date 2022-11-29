import { Routes } from '@angular/router';
import { ListarNivelesprofesionalesComponent } from './listar-nivelesprofesionales/listar-nivelesprofesionales.component';


export const nivelesProfesionales_routes: Routes = [
    { path: 'listar-nivelesprofesionales', component: ListarNivelesprofesionalesComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listar-nivelesprofesionales'},
];