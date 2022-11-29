import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _usuarioService: UsuarioService) { }

  ngOnInit() {
    // this._usuarioService.infoUsuario().subscribe((data:any) => {
    //   console.log(data);
    // },
    // (err:any)=> {

    // });
  }

}
