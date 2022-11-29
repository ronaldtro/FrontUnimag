import { Routes } from '@angular/router';
import { ListarCondicionesComponent } from './listar-condiciones/listar-condiciones.component';


export const condiciones_routes: Routes = [
    { path: 'listar-condiciones', component: ListarCondicionesComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listar-condiciones'},
];