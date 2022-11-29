import { Routes } from "@angular/router";
import { ConvocatoriaDeportistasComponent } from "./convocatoria-deportistas/convocatoria-deportistas.component";
import { ListaDisciplinasComponent } from "./lista-disciplinas/lista-disciplinas.component";
import { ListaGruposComponent } from "./lista-grupos-disciplinas/lista-grupos.component";
import { DetalleGrupoComponent } from "./detalle-grupo/detalle-grupo.component";
import { ListaSeleccionadosDeportistasComponent } from "./lista-seleccionados/lista-seleccionados.component";
import { EstadoConvocatoriaDeportistasComponent } from "./estado-convocatoria-deportistas/estado-convocatoria-deportistas.component";

export const publicDeportistas_routes: Routes = [
    { path: 'convocatorias', data: {title:'Convocatorias de artistas y deportistas'}, component: ConvocatoriaDeportistasComponent},
    { path: 'disciplinasConvocatorias/:id', data: {title:'Disciplinas de convocatoria'}, component: ListaDisciplinasComponent },
    { path: 'estado-convocatoria/:token', data: {title:'Estado actual de convocatoria'}, component: EstadoConvocatoriaDeportistasComponent },
    { path: 'grupos/:modalidad', data: {title:'Listado de disciplinas'}, component: ListaGruposComponent },
    { path: 'detalles-grupo-inscripcion/:idDisciplina', data: {title:'Detalles de la disciplina'}, component:  DetalleGrupoComponent},
    { path: 'estudiantes-seleccionados/:idDisciplinaConvocatoria', data: {title:'Lista de estudiantes seleccionados'}, component:  ListaSeleccionadosDeportistasComponent}
];

