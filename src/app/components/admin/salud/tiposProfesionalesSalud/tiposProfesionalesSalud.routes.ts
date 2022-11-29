import { Routes } from '@angular/router';
import { TiposprofesionalessaludComponent } from './tiposprofesionalessalud/tiposprofesionalessalud.component';


export const tiposProfesionalesSalud_routes: Routes = [
    { path: 'listado', component: TiposprofesionalessaludComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listado'},
];