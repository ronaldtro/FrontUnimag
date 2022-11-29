import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { TitleService } from 'src/app/services/title.service';
import { FooterPrivateComponent } from 'src/app/components/shared/private/footer/footer.component';
import { NavbarPrivateComponent } from 'src/app/components/shared/private/navbar/navbar.component';

@NgModule({
    declarations: [],
    imports: [ CommonModule, ReportesRoutingModule ],
    exports: [],
    providers: [],
})
export class ReportesModule {}