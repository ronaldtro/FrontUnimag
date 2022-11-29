import { Routes } from '@angular/router';
import { HistorialComitesComponent } from './historial-comites/historial-comites.component';
import { ListarComitesComponent } from './listar-comites/listar-comites.component';
import { RolesComitesComponent } from './roles-comites/roles-comites.component';
import { EstudiantesAtendidosComponent } from './estudiantes-atendidos/estudiantes-atendidos.component';
import { VerResultadosEncuestasComponent } from './ver-resultados-encuesta/ver-resultados-encuesta.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

export const comitesMonitorias_routes: Routes = [
    { path: 'listar', component:ListarComitesComponent, data: { roles:['AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: 'historial', component: HistorialComitesComponent, data: { roles:['AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: 'estudiantesAtendidos/:id', component: EstudiantesAtendidosComponent },
    { path: 'verResultadosEncuestas/:tipoConvocatoria', component: VerResultadosEncuestasComponent, data: { roles:['AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: 'verResultadosEncuestas/:id/:tipoConvocatoria', component: VerResultadosEncuestasComponent, data: { roles:['AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: 'roles', component: RolesComitesComponent, data: { roles:['AdminMonitorias']}, canActivate:[AuthGuard] },
    { path: '**', pathMatch: 'full', redirectTo:'/'},
];