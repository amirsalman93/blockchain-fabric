import { Component, OnInit } from '@angular/core';
import { FormsModule, Form } from '@angular/forms';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrls: ['./create-car-form.component.scss']
})
export class CreateCarFormComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  async onSubmit(data) {
    console.log(data);
    let ts = Date.now();
    let date = new Date(ts).toString();

    return this.apiService.createFir(data.district, data.policeStationAddress, data.crimeType, data.caseSummary , data.caseDetailedDescription , data.incidentLocation
      , data.registrarDesignation, data.registrarName, data.complainantName, data.complainantCnic,date );
  }
}
