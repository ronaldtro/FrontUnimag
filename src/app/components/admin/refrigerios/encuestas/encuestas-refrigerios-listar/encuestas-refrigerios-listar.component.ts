import { Component, OnInit } from '@angular/core';
import { EncuestasService } from 'src/app/services/encuestas.service';

@Component({
  selector: 'app-encuestas-refrigerios-listar',
  templateUrl: './encuestas-refrigerios-listar.component.html',
  styleUrls: ['./encuestas-refrigerios-listar.component.css']
})
export class EncuestasRefrigeriosListarComponent implements OnInit {

  encuestas:any[];

  constructor(private _encuestasService: EncuestasService) { 
    this.encuestas = [];
  }

  ngOnInit() {
    this._encuestasService.getEncuestas().subscribe((data:any) => {
      this.encuestas = data;
    });
  }

}
