import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataRaw;
  dataProcessed
  zoomStack;
  chartStart;
  scaleBar;
  yscale; 
  baseLine;
  range;
  zoomLevel;


  constructor(private http: HttpClient) {
        this.chartStart=0;
        this.yscale=100;
        this.baseLine=40;
        this.zoomStack=[];
        this.zoomLevel=0;
        this.range=[];
        this.dataRaw=[];
  }

  fetchData(){
    const data1=this.http.get('/assets/output_s1.txt');
    const data2=this.http.get('/assets/output_s2.txt');
    return forkJoin([data1, data2])
              .pipe(map(this.toArray.bind(this)))
              .pipe(map(this.calculate.bind(this)));
  }

  zoomIn(index){
    if(this.zoomLevel<5){
      this.zoomStack.push(this.chartStart);
      this.zoomLevel++;
      this.chartStart=this.range[index].left;
      return of(this.calculate(this.dataRaw));
    }else {
      alert('maximum zoomIn...');
      return this.dataProcessed;

    }
  }

  zoomOut(){
    if(this.zoomLevel>0){
      this.chartStart=this.zoomStack.pop();
      this.zoomLevel--;
      return of(this.calculate(this.dataRaw));
    }else { 
      alert('maximum zoomOut...');
      return this.dataProcessed;
    }
  }


  calculate(data){
    data=data.map(item=>{return item.map(item=>item>this.baseLine?item-this.baseLine:0)});
    var DividedMergedData=[];
    var peakWidth=1*Math.pow(6, 5-this.zoomLevel);
    this.scaleBar=peakWidth;
    let range;
    this.range=[];
    this.scaleBar=peakWidth+'bp';
    if(this.zoomLevel==0){
      var numOfColumns=Math.ceil(4699674/peakWidth);
      var MergedData=[], peakHeight;
      for(let i=0; i<numOfColumns-1; i++) {
          peakHeight=[];
          for(let j=0; j<data.length; j++){
            peakHeight.push(Math.max(...data[j].slice(i*peakWidth, (i+1)*peakWidth)));
          }
          MergedData.push(peakHeight);
      }
      peakHeight=[];
      for(let j=0; j<data.length; j++)peakHeight.push(Math.max(...data[j].slice((numOfColumns-1)*peakWidth, data.length)));
      MergedData.push(peakHeight);

      var numOfPanels=Math.ceil(MergedData.length/250), panelData;
      for(let i=0; i<numOfPanels-1; i++){
        range={left: i*250*peakWidth,right: (i+1)*250*peakWidth-1};
        panelData={columns: MergedData.slice(i*250, (i+1)*250), range};
        DividedMergedData.push(panelData);
        this.range.push(range);
      };
      range= {left: (numOfPanels-1)*250*peakWidth, right: 4699674};
      panelData={columns: MergedData.slice((numOfPanels-1)*250, MergedData.length), range};
      DividedMergedData.push(panelData);
      this.range.push(range);
    }else{
      var MergedData=[];
      let range;
      for(let i=0; i<1500; i++) {
        peakHeight=[];
        for(let j=0; j<data.length; j++) 
                peakHeight.push(Math.max(...data[j].slice(this.chartStart+i*peakWidth, this.chartStart+(i+1)*peakWidth)));
        MergedData.push(peakHeight);
      }

      for(let i=0; i<6; i++){
        range= {left: this.chartStart+i*250*peakWidth,right: this.chartStart+(i+1)*250*peakWidth-1};
        console.log(range);
        panelData={columns: MergedData.slice(i*250, (i+1)*250), range};
        DividedMergedData.push(panelData);
        this.range.push(range);
      }
    }
    this.dataProcessed=DividedMergedData;
    return DividedMergedData;
  }

  toArray(a){
    for(let j=0; j<a.length; j++){
      let data=new Array(4699674).fill(0);
      for(let key in a[j]){
        var key1=parseInt(key);
        for(let i=key1; i<key1+40; i++) data[i]=data[i]+a[j][key];
      }
      this.dataRaw.push(data);
    }
    return this.dataRaw
  }

}
