import { Routes } from '@angular/router';
import { ProfesionalesComponent } from './profesionales/profesionales.component';
import { GuardarProfesionalsaludComponent } from './guardar-profesionalsalud/guardar-profesionalsalud.component';


export const profesionales_routes: Routes = [
    { path: 'listar-profesionales', component: ProfesionalesComponent },
    { path: 'guardar-profesionalsalud/:id', data: {title:'Editar profesional'}, component: GuardarProfesionalsaludComponent },
    { path: 'guardar-profesionalsalud', component: GuardarProfesionalsaludComponent },  
    { path: '**', pathMatch: 'full', redirectTo:'listar-profesionales'},
];