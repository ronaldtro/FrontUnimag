import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

declare var jQuery:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy  {
  userService: UserService;
  constructor(private elementRef: ElementRef, private _userService:UserService) { this.userService = _userService; }

  ngOnInit() {

  }
  ngOnDestroy() {
    jQuery(this.elementRef.nativeElement).find('[data-toggle="tooltip"]').tooltip('hide');
  }
  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="tooltip"]').tooltip();
  }

}
