import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../../guards/auth.guard';
import { ESTUDIANTES_REFRIGERIOS_ROUTES } from './estudiantes/estudiantes-refrigerios.routes';


export const REFRIGERIOS_ROUTES: Routes = [
    {
        path: 'estudiante',
        children: ESTUDIANTES_REFRIGERIOS_ROUTES,
        data: {title:'Estudiantes', roles:['Estudiante']},
        canActivate:[AuthGuard],
         
    }
];

@NgModule({
    imports: [RouterModule.forRoot(REFRIGERIOS_ROUTES)],
    exports: [RouterModule]
})
export class RefrigeriosRoutingModule {}