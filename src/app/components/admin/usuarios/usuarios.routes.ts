import { Routes } from '@angular/router';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';


export const usuarios_routes: Routes = [
    { path: 'listar-usuarios', component: ListarUsuariosComponent },
    { path: '**', pathMatch: 'full', redirectTo:'listar-usuarios'},
];