import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EncuestaComponent } from './encuesta/encuesta.component';


export const ESTUDIANTES_REFRIGERIOS_ROUTES: Routes = [
    { path: 'encuesta', data: {title:'Encuesta de satisfacción de subsidio alimentario'}, component: EncuestaComponent },
    { path: 'encuesta/:id', data: {title:'Encuesta de satisfacción de subsidio alimentario'}, component: EncuestaComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(ESTUDIANTES_REFRIGERIOS_ROUTES)],
    exports: [RouterModule]
})
export class EstudiantesRefrigeriosRoutingModule {}