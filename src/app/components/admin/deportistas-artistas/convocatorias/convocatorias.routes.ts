import { Routes } from '@angular/router';

import { ListarConvocatoriasArtistasDeportistasComponent } from './listar-convocatorias/listar-convocatorias.component';
import { CrearConvocatoriaArtistasDeportistasComponent } from './crear/crear.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ConvocatoriaDetalleArtistasDeportistasComponent } from './convocatoria-detalle/convocatoria-detalle.component';
import { EditarConvocatoriasArtistasDeportistasComponent } from './editar-convocatorias/editar-convocatorias.component';
import { AsociarDisciplinasComponent } from './asociar-disciplinas/asociar-disciplinas.component';
import { AsociarItemsComponent } from './asociar-items/asociar-items.component';
import { HistorialConvocatoriasArtistasDeportistasComponent } from './historial-convocatorias/historial-convocatorias.component';

export const convocatorias_routes_artistas_deportistas: Routes = [
    { path: '', component:ListarConvocatoriasArtistasDeportistasComponent},
    { path: 'crear', component: CrearConvocatoriaArtistasDeportistasComponent, canActivate:[AuthGuard] },
    { path: 'detalle/:id', component: ConvocatoriaDetalleArtistasDeportistasComponent, canActivate:[AuthGuard] },
    { path: 'editar/:id', component: EditarConvocatoriasArtistasDeportistasComponent, canActivate:[AuthGuard] },
    { path: 'asignar-disciplinas/:id', component: AsociarDisciplinasComponent, canActivate:[AuthGuard] },
    { path: 'asignar-items/:id', component: AsociarItemsComponent, canActivate:[AuthGuard] },
    { path: 'historial', component: HistorialConvocatoriasArtistasDeportistasComponent, canActivate:[AuthGuard] },
    { path: '**', pathMatch: 'full', redirectTo:''}
];
