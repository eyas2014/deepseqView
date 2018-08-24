import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data;

  constructor(private http: HttpClient) {
        this.data=this.http.get('/assets/output.txt');
   }

  getData(){
  	return this.data;
  }

  parseData(str){
    return str.split('#');
  }

}
