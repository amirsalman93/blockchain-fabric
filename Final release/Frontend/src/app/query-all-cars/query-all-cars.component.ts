import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-query-all-cars',
  templateUrl: './query-all-cars.component.html',
  styleUrls: ['./query-all-cars.component.scss']
})
export class QueryAllCarsComponent implements OnInit {

  private firs: Array<object>;
  response;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.firs$.subscribe((firsArray) => {
      this.firs = firsArray;
    });
    this.apiService.queryAllFirs();
  }
}
