import { LoginComponent } from "./login/login.component";
import { Routes } from "@angular/router";
import { ListadoEvaluadosComponent } from "./listado-evaluados/listado-evaluados.component";
import { ListadoEstudiantesAprobadosComponent } from "./listado-estudiantes-aprobados/listado-estudiantes-aprobados.component";

export const publicEstudiantes_routes: Routes = [
    { path: 'login', data: {title:'Inicio de sesión del estudiante'}, component: LoginComponent },
    { path: 'listadoEvaluados/:id', data: {title:'Estudiantes evaluados'}, component: ListadoEvaluadosComponent },
    { path: 'listadoAprobados/:id', data: {title:'Estudiantes aprobados'}, component: ListadoEstudiantesAprobadosComponent }
];

