import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ReporteEntregasConvocatoriasComponent } from './reporte-entregas-convocatorias/reporte-entregas-convocatorias.component';

const routes: Routes = [
    { path: 'entregasConvocatorias', component: ReporteEntregasConvocatoriasComponent },
    // { path: '**', component: DashboardComponent },

    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportesRoutingModule {}
