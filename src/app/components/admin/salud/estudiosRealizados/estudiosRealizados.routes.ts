import { Routes } from '@angular/router';
import { ListarEstudiosrealizadosComponent } from './listar-estudiosrealizados/listar-estudiosrealizados.component';


export const estudiosRealizados_routes: Routes = [
    { path: 'listar-estudiosrealizados', component: ListarEstudiosrealizadosComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listar-estudiosrealizados'},
];