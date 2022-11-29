import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:any = {
    email:null,
    password:null
  };
  redirect:string;

  constructor(private _userService:UserService, private router:Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) { }
  
  ngOnInit() {
    if(this._userService.isLogin()){
     
      this.route.queryParams.subscribe(params => {
        if(params['redirect']){
          this.redirect=params['redirect'];
        }else{
          this.router.navigate(['/dashboard']);
        }
      });
    }

    this.route.queryParams.subscribe(params => {
      if(params['redirect']){
        this.redirect=params['redirect'];
      }
    });
  }

  enviar(forma:NgForm){
    if(!forma.valid){
      return;
    }
    this.spinner.show();
    this._userService.userAuthentication(this.user.email, this.user.password).subscribe((data:any) => {
      localStorage.setItem('userToken',data.access_token);
      let role = JSON.parse(data.role);
      localStorage.setItem('userRoles',JSON.stringify(role.userRoles));
      localStorage.setItem('userTipos',JSON.stringify(role.tipos));
      //localStorage.setItem('userTipos',JSON.stringify(role.tipos));
      let actualDate = new Date();
      actualDate.setSeconds(actualDate.getSeconds() + data.expires_in );
      localStorage.setItem('expires_in', (actualDate.getTime()).toString());
     if(this.redirect){
        this.router.navigate([this.redirect]);
      }else{
        this.router.navigate(['/principal']);
        // if(this._userService.roleMatch(['AsistenteCafeteria'])){
        //   this.router.navigate(['/recepcion']);
        // }else{
        //   this.router.navigate(['/principal']);
        // }
        
      }
      this.spinner.hide();
    },(err : HttpErrorResponse)=>{
      this.spinner.hide();
      swal({
        type: 'error',
        title: 'Error',
        text: 'Verifique la información y vuelva a intentarlo.'
      })
    });

    // this._userService.getRoleTipos(this.user.email).subscribe((data:any)=>{
    //   let tipos = JSON.parse(data.tipos_roles)
    //   localStorage.setItem('userTipos',tipos);
    //   },(err : HttpErrorResponse)=>{
    //     this.spinner.hide();
    //     swal({
    //       type: 'error',
    //       title: 'Error',
    //       text: 'Verifique la información y vuelva a intentarlo.'
    //     })
    //   });

  }

}
