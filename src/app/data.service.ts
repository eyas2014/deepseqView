import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  fetchData(){
    const data1=this.http.get('/assets/output_s1.txt');
    const data2=this.http.get('/assets/output_s2.txt');
    return forkJoin([data1, data2])
              .pipe(map(this.toArray.bind(this)))
  }

  getGenome(){
    return this.http.get('/assets/ecoli.fna', {responseType: 'text'});
  }


  toArray(a){
    let dataRaw=[];
    for(let j=0; j<a.length; j++){
      let data=new Array(4699674).fill(0);
      for(let key in a[j]){
        var key1=parseInt(key);
        for(let i=key1; i<key1+40; i++) data[i]=data[i]+a[j][key];
      }
      dataRaw.push(data);
    }
    return dataRaw
  }

}
