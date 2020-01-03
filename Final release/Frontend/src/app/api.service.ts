import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';

const httpOptionsJson = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',
    'Accept': 'text/plain'
  }),
};

const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });

const baseURL = `http://localhost:8081`;
const queryAllFirsURL = `/queryAllFirs`;
const createFirURL = `/createFir`;
const updateFirResultURL = `/updateFirResult`;
const loginURL = `/login`;

@Injectable()
export class ApiService {

  public firs$: Subject<Array<object>> = new BehaviorSubject<Array<object>>([]);

  constructor(private http: HttpClient) {
  }
    createFir(district: string, policeStationAddress: string, crimeType: string, caseSummary: string, caseDetailedDescription: string, incidentLocation: string
      , registrarDesignation: string, registrarName: string, complainantName: string, complainantCnic: string, date: string) {
    return this.http.post(baseURL + createFirURL, ({
      'district': district,
      'policeStationAddress': policeStationAddress,
      'crimeType': crimeType,
      'caseSummary': caseSummary,
      'caseDetailedDescription': caseDetailedDescription,
      'incidentLocation': incidentLocation,
      'registrarDesignation': registrarDesignation,
      'registrarName': registrarName,
      'complainantName': complainantName,
      'complainantCnic': complainantCnic,
      'date': date,
    }), {headers}).toPromise().then((result) => { this.queryAllFirs(); });

  }

  updateFirResult(firid: string, result: string) {
    console.log(baseURL + updateFirResultURL);
    return this.http.post(baseURL + updateFirResultURL, {'firId': firid, 'result': result},
    {headers}).toPromise().then((result) => { this.queryAllFirs(); });
  }

  login(userName: string, password: string) {
    console.log(baseURL + loginURL);
    return this.http.post(baseURL + loginURL, {'userName': userName, 'password': password},
    {headers}).toPromise().then((result) => {
       console.log(result);
       return result;
     });
  }

  queryAllFirs() {
    console.log(baseURL + queryAllFirsURL);
    return this.http.get<Array<any>>(baseURL + queryAllFirsURL, httpOptionsJson).subscribe((response) => {
      this.firs$.next(response);
    });
  }
}
