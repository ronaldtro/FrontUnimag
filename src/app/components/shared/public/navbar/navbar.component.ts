import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-public-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../../../../../assets/css/public.min.css']
})
export class NavbarComponent implements OnInit {
  userService: UserService;
  constructor(private router:Router, private _userService:UserService) { this.userService = _userService }

  ngOnInit() {
    this.loadScript('https://cdn.unimagdalena.edu.co/code/js/main.min.js');  
  }

  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true,
    document.getElementsByTagName('head')[0].appendChild(node);
 }

 Logout() {
  localStorage.removeItem('userRoles');
  localStorage.removeItem('expires_in');
  localStorage.removeItem('userToken');
  localStorage.clear();
  window.location.href = "/";
  //this.router.navigate(['/']);
}

}
