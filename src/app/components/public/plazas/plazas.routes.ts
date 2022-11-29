import { Routes, RouterModule } from '@angular/router';

import { PlazasInformacionComponent } from './plazas-informacion/plazas-informacion.component';
import { PublicAprobadosComponent } from './public-aprobados/public-aprobados.component';
import { PublicEvaluadoComponent } from './public-evaluado/public-evaluado.component';

export const informacion_plazas: Routes = [
    { path:'aprobados/:id', component: PublicAprobadosComponent },
    { path:'evaluado/:id', component: PublicEvaluadoComponent },
    { path:'informacion/:id', component: PlazasInformacionComponent },
    { path: '**', pathMatch: 'full', redirectTo:'/'},

];

