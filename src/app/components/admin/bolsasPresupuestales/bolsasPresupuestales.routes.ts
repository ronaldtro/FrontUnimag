import { Routes } from '@angular/router';

import { GuardarBolsaComponent } from './guardar-bolsa/guardar-bolsa.component';
import { ListarBolsasComponent } from './listar-bolsas/listar-bolsas.component';

export const bolsasPresupuestales_routes: Routes = [
    { path: 'guardar-bolsa/:id', data: {title:'Formulario de edición de bolsa presupuestal'}, component: GuardarBolsaComponent },
    { path: 'guardar-bolsa', data: {title:'Formulario de ingreso de bolsa presupuestal'},  component: GuardarBolsaComponent },
    { path: 'listar-bolsas', data: {title:'Listado de bolsas presupuestales'}, component: ListarBolsasComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listar-bolsas'},
];