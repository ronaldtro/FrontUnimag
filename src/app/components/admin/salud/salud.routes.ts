import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


export const SALUD_ROUTES: Routes = [
    // { path: 'entregasConvocatorias', data: {title:'Reporte de entregas de almuerzos y refrigerios'}, component: ReporteEntregasConvocatoriasComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(SALUD_ROUTES)],
    exports: [RouterModule]
})
export class ReportesRoutingModule {}
