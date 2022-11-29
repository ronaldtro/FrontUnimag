import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { AdminComponent } from './layout/admin/admin.component';
import { ADMIN_ROUTES } from './layout/admin/admin.routes';
import { PublicComponent } from './layout/public/public.component';
import { PUBLIC_ROUTES } from './layout/public/public.routes';


const routes: Routes = [
    // { path: '', component: HomeComponent },

    { path: '', component: PublicComponent, children: PUBLIC_ROUTES },
    { path: '', component: AdminComponent, canActivate: [AuthGuard], children: ADMIN_ROUTES },

    { path: '**', pathMatch: 'full', redirectTo:'' },
];

export const APP_ROUTING = RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
});