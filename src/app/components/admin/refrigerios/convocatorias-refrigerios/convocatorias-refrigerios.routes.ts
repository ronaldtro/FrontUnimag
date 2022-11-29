import { Routes } from '@angular/router';

import { CrearConvocatoriaComponent } from './crear-convocatoria/crear-convocatoria.component';
import { ListarConvocatoriasRefrigeriosComponent } from './listar-convocatorias-refrigerios/listar-convocatorias-refrigerios.component';
import { HistorialConvocatoriasComponent } from '../../../admin/ayudantias/convocatorias/historial-convocatorias/historial-convocatorias.component';
import { EditarConvocatoriasRefrigeriosComponent } from './editar-convocatorias-refrigerios/editar-convocatorias-refrigerios.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DetalleConvocatoriasRefrigeriosComponent } from './detalle-convocatorias-refrigerios/detalle-convocatorias-refrigerios.component';
import { AsistenteConvocatoriaComponent } from './asistente-convocatoria/asistente-convocatoria.component';

export const convocatorias_refrigerios_routes: Routes = [
    { path: '', component:ListarConvocatoriasRefrigeriosComponent},
    { path: 'crear', component: CrearConvocatoriaComponent, data: {roles:['AdminRefrigerios']}, canActivate:[AuthGuard] },
    { path: 'editar/:id', component: EditarConvocatoriasRefrigeriosComponent, data: {roles:['AdminRefrigerios']}, canActivate:[AuthGuard] },
    { path: 'detalle/:id', component: DetalleConvocatoriasRefrigeriosComponent },
    { path: 'asistente/:id', component: AsistenteConvocatoriaComponent },
    { path: 'historial', component: HistorialConvocatoriasComponent },
    { path: 'historial/:id', component: HistorialConvocatoriasComponent },
    { path: '**', pathMatch: 'full', redirectTo:''},
];