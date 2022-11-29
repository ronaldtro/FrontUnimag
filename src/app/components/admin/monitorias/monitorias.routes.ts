import { Routes } from '@angular/router';
import { ListaEstudiantesAtendidosComponent } from './lista-estudiantes-atendidos/lista-estudiantes-atendidos.component';


export const monitorias_routes: Routes = [
    { path: 'estudiantes-atendidos/:id', data: {title:'Lista de estudiantes atendidos'}, component: ListaEstudiantesAtendidosComponent },
    { path: '**', pathMatch: 'full', redirectTo:'/principal'},
];