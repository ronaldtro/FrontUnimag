import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EncuestasRefrigeriosListarComponent } from './encuestas-refrigerios-listar/encuestas-refrigerios-listar.component';


export const ENCUESTAS_REFRIGERIOS_ROUTES: Routes = [
    { path: '', data: {title:'Encuesta de satisfacción de subsidio alimentario'}, component: EncuestasRefrigeriosListarComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(ENCUESTAS_REFRIGERIOS_ROUTES)],
    exports: [RouterModule]
})
export class EncuestasRefrigeriosRoutingModule {}