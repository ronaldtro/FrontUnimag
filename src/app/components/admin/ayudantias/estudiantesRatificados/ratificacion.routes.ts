import { Routes } from '@angular/router';
import { RatificarComponent } from './ratificar/ratificar.component';


export const ratificacion_routes: Routes = [
    { path: 'ratificar/:plaza_id', data: {title:'Ratificar estudiantes'}, component: RatificarComponent },
    { path: '**', pathMatch: 'full', redirectTo:'/principal'}
];