import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

declare var $:any;

@Component({
  selector: 'app-private-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarPrivateComponent implements OnInit {
  userService: UserService;
  usuarioLogueado:any;
  constructor(private router:Router, private _userService:UserService) { this.userService = _userService }

  ngOnInit() {
    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
      }
      var $subMenu = $(this).next('.dropdown-menu');
      $subMenu.toggleClass('show');
    
    
      // $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      //   $('.dropdown-submenu .show').removeClass('show');
      // });
    
    
      return false;
    });

    this._userService.getLoggedUser().subscribe((data:any) => {
      this.usuarioLogueado = (data.email.split("@")[1].indexOf('unimagdalena') != -1) ? data.email.split("@")[0] : data.email;
    }, (err:HttpErrorResponse) => {
      console.error(err.error);
    });

  }

  Logout() {
    let esEstudiante = this._userService.roleMatch(['Estudiante']);
    
    localStorage.removeItem('userRoles');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('userToken');
    localStorage.clear();
    if(esEstudiante){
      window.location.href = "/estudiantes/login";
      //this.router.navigate(['/estudiantes/login']);
    }else{
      window.location.href = "/login";
      //this.router.navigate(['/login']);
    }
    
  }

  closeModal(){
    $('#modalAyuda').modal('hide');
  }

}
