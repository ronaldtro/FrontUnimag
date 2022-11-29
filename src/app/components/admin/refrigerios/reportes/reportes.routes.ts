import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReporteEntregasConvocatoriasComponent } from './reporte-entregas-convocatorias/reporte-entregas-convocatorias.component';

export const REPORTES_ROUTES: Routes = [
    { path: 'entregasConvocatorias', data: {title:'Reporte de entregas de almuerzos y refrigerios'}, component: ReporteEntregasConvocatoriasComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(REPORTES_ROUTES)],
    exports: [RouterModule]
})
export class ReportesRoutingModule {}
