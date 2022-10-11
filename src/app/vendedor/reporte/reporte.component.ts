import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  searchText = '';
  fechaInicio: NgbDateStruct = this.calendar.getToday();
  fechaFin: NgbDateStruct = this.calendar.getToday();
  constructor(
    private calendar: NgbCalendar) { }

  ngOnInit(): void {
  }


  goPedidos(){

  }

  goUsuarios(){

  }
}
