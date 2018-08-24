import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data;
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
        this.baseLine=20;
        this.zoomStack=[];
        this.zoomLevel=0;
        this.range=[];

  }

  fetchData(){
    const data=this.http.get('/assets/output.txt');
    data.pipe(this.toArray.bind(this), this.calculate.bind(this));   //miss one function
  	return data;
  }

  refetchData(){
    return this.calculate(this.data);

  }

  zoomIn(index){
    if(this.zoomLevel<5){
      this.zoomStack.push(this.chartStart);
      this.zoomLevel++;
      this.chartStart=this.range[index].left;
      return this.calculate(this.data);
    }else alert('maximum zoomIn...');

  }

  zoomOut(){
    if(this.zoomLevel>0){
      this.chartStart=this.zoomStack.pop();
      this.zoomLevel--;
      return this.calculate(this.data)
    }else alert('maximum zoomOut...');
  }


  calculate(data){
    var DividedMergedData=[];
    var peakWidth=1*Math.pow(6, 5-this.zoomLevel);
    let range;
    this.scaleBar=peakWidth*25+'bp';
    console.log(data);
    if(this.zoomLevel==0){
      var numOfColumns=Math.ceil(data.length/peakWidth);
      var MergedData=[], peakHeight;
      for(let i=0; i<numOfColumns-1; i++) {
        peakHeight=Math.max(...data.slice(i*peakWidth, (i+1)*peakWidth));
        MergedData.push(peakHeight);
      }
      peakHeight=Math.max(...data.slice((numOfColumns-1)*peakWidth, data.length));
      MergedData.push(peakHeight);
      var numOfPanels=Math.ceil(MergedData.length/250), panelData;
      for(let i=0; i<numOfPanels-1; i++){
        range={left: i*250*peakWidth,right: (i+1)*250*peakWidth-1};
        panelData={columns: MergedData.slice(i*250, (i+1)*250), range};
        DividedMergedData.push(panelData);
        this.range.push(range);
      };
      range= {left: (numOfPanels-1)*250*peakWidth, right: data.length};
      panelData={columns: MergedData.slice((numOfPanels-1)*250, MergedData.length), range};
      DividedMergedData.push(panelData);
      this.range.push(range);
    }else{
      var MergedData=[];
      let range;
      for(let i=0; i<1500; i++) {
        peakHeight=Math.max(...this.data.slice(this.chartStart+i*peakWidth, this.chartStart+(i+1)*peakWidth));
        MergedData.push(peakHeight);
      }
          console.log(MergedData);

      for(let i=0; i<6; i++){
        range= {left: this.chartStart+i*250*peakWidth,right: this.chartStart+(i+1)*250*peakWidth-1};
        panelData={columns: MergedData.slice(i*250, (i+1)*250), range};
        DividedMergedData.push(panelData);
        this.range.push(range);
      }
    }
    return DividedMergedData;
  }

  toArray(a){
    let data=new Array(4699674).fill(0);
    for(let key in a){
      var key1=parseInt(key);
      for(let i=key1; i<key1+40; i++) data[i]=data[i]+a[key];
    }
    this.data=data;
    return data;
  }

}
