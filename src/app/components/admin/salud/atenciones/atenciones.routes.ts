import { Routes } from '@angular/router';
import { MedicinageneralComponent } from './medicinageneral/medicinageneral.component';
import { DetalleCitaComponent } from 'src/app/components/admin/salud/detalle-cita/detalle-cita.component';
import { NoProgramadaComponent } from './no-programada/no-programada.component';
import { EnfermeriaComponent } from './enfermeria/enfermeria.component';
import { DetalleCitaEnfermeriaComponent } from '../detalle-cita-enfermeria/detalle-cita-enfermeria.component';
import { PsicologiaComponent } from './psicologia/psicologia.component';
import { RegistroIncapacidadComponent } from './registro-incapacidad/registro-incapacidad.component';
import { MedicinaDeportivaComponent } from './medicina-deportiva/medicina-deportiva.component';
import { DetalleAtencionDeportologoComponent } from '../detalle-atencion-deportologo/detalle-atencion-deportologo.component';



export const atenciones_routes: Routes = [
    { path: 'medicinageneral/:bandera/:id', component: MedicinageneralComponent },
    { path: 'detalle-cita/:id', component: DetalleCitaComponent },
    { path: 'psicologia/:bandera/:id', component: PsicologiaComponent },
    { path: 'enfermeria/:bandera/:id', component: EnfermeriaComponent },
    { path: 'detalle-cita-enfermeria/:id', component: DetalleCitaEnfermeriaComponent },
    { path: 'detalle-atencion-deportologia', component: DetalleAtencionDeportologoComponent },
    { path: 'psicologia', component: PsicologiaComponent },
    { path: 'noProgramada', component: NoProgramadaComponent },
    { path: 'registroIncapacidad/:id', component: RegistroIncapacidadComponent },
    { path: 'deportologia/:bandera/:id', component: MedicinaDeportivaComponent },


    { path: '**', pathMatch: 'full', redirectTo:'atenciones'},
];