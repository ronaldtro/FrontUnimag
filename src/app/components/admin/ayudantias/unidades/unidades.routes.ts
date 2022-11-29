import { Routes } from '@angular/router';
import { GuardarUnidadComponent } from './guardar-unidad/guardar-unidad.component';
import { ListarUnidadesComponent } from './listar-unidades/listar-unidades.component';


export const unidades_routes: Routes = [
    { path: 'listar-unidades', component: ListarUnidadesComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listar-unidades'},
];