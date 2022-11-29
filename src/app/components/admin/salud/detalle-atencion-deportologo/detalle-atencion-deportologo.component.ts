import { Component, OnInit } from '@angular/core';
import { PROFILE_BY } from 'src/app/class/api';
@Component({
  selector: 'app-detalle-atencion-deportologo',
  templateUrl: './detalle-atencion-deportologo.component.html',
  styleUrls: ['./detalle-atencion-deportologo.component.css']
})
export class DetalleAtencionDeportologoComponent implements OnInit {

  profile_by = PROFILE_BY.ID_Paciente;
  id = 100;
  constructor() { }

  ngOnInit() {
  }

}
