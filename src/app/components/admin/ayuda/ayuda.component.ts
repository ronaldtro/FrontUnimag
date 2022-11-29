import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {
 userService: UserService;
  constructor(private _userService:UserService, private _location: Location) { this.userService = _userService; }

  ngOnInit() {
  }

  backClicked() {
    this._location.back();
  }
}
