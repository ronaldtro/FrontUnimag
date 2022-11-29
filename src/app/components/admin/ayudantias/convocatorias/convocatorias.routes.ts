import { Routes } from '@angular/router';

import { CrearComponent } from './crear/crear.component';
import { ListarConvocatoriasComponent } from './listar-convocatorias/listar-convocatorias.component';
import { EditarConvocatoriasComponent } from './editar-convocatorias/editar-convocatorias.component';
import { HistorialConvocatoriasComponent } from './historial-convocatorias/historial-convocatorias.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ConvocatoriaDetalleComponent } from './convocatoria-detalle/convocatoria-detalle.component';

export const convocatorias_routes: Routes = [
    { path: ':id', component:ListarConvocatoriasComponent},
    { path: 'crear/:id', component: CrearComponent, data: {roles:['Admin', 'AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: 'editar/:id', component: EditarConvocatoriasComponent, data: {roles:['Admin', 'AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: 'historial/:id', component: HistorialConvocatoriasComponent },
    { path: 'detalle/:id', component: ConvocatoriaDetalleComponent },
    { path: '**', pathMatch: 'full', redirectTo:'/'},
];