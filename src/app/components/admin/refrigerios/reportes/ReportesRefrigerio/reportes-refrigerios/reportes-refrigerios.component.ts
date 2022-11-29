import { Component, OnInit } from '@angular/core';
import { CafeteriaService } from 'src/app/services/cafeterias.service';
// import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reportes-refrigerios',
  templateUrl: './reportes-refrigerios.component.html',
  styleUrls: ['./reportes-refrigerios.component.css']
})
export class ReportesRefrigeriosComponent implements OnInit {
  funciones:FuncionesJSService;
  id: any;
  userService:UserService;
  constructor(
    private _reportes: CafeteriaService,
    // private spinner: NgxSpinnerService,
    private route: ActivatedRoute,  
    private _location: Location,  
    private funcionesP: FuncionesJSService,
    private _userService: UserService
  ) {
    this.funciones = funcionesP;
    this.userService = _userService;
   }

  ngOnInit() {   
    // this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];    

    })   
  }

  backClicked() {
    this._location.back();
  }

}
