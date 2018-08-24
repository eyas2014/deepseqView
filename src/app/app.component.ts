import { Component } from '@angular/core';
//import * as d3 from 'd3';
import {DataService} from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deepseqView';

  DividedMergedData=[];
  zoomStack=[];
  chartStart;
  zoomLevel;
  data;
  scaleBar;
  yscale=100;
  baseLine="50";

  constructor(private dataService: DataService){}

  ngOnInit(){
    this.zoomLevel=0;
    this.chartStart=0;
    this.dataService.getData().subscribe(data=>{this.toArray(data); this.reCalculate()});

  }

  zoomIn(index){
    if(this.zoomLevel<5){
      this.zoomStack.push(this.chartStart);
      this.zoomLevel++;
      this.chartStart=this.DividedMergedData[index].range.left;
      this.DividedMergedData=[];
      this.reCalculate();
    }else alert('maximum zoomIn...');

  }

  zoomOut(){
    if(this.zoomLevel>0){
      this.DividedMergedData=[];
      this.chartStart=this.zoomStack.pop();
      this.zoomLevel--;
      this.reCalculate()
    }else alert('maximum zoomOut...');
  }


  reCalculate(){
    var peakWidth=1*Math.pow(6, 5-this.zoomLevel);
    this.scaleBar=peakWidth*25;
    console.log(this.data);
    if(this.zoomLevel==0){
      var numOfColumns=Math.ceil(this.data.length/peakWidth);
      var MergedData=[], peakHeight;
      for(let i=0; i<numOfColumns-1; i++) {
        peakHeight=Math.max(...this.data.slice(i*peakWidth, (i+1)*peakWidth));
        MergedData.push(peakHeight);
      }
      peakHeight=Math.max(...this.data.slice((numOfColumns-1)*peakWidth, this.data.length));
      MergedData.push(peakHeight);
      var numOfPanels=Math.ceil(MergedData.length/250), panelData;
      for(let i=0; i<numOfPanels-1; i++){
        panelData={columns: MergedData.slice(i*250, (i+1)*250),
                    range: {left: i*250*peakWidth,right: (i+1)*250*peakWidth-1}
                  };
        this.DividedMergedData.push(panelData);
      };
      panelData={columns: MergedData.slice((numOfPanels-1)*250, MergedData.length),
                  range: {left: (numOfPanels-1)*250*peakWidth, right: this.data.length}
                };
      this.DividedMergedData.push(panelData);
    }else{
      var MergedData=[];
      for(let i=0; i<1500; i++) {
        peakHeight=Math.max(...this.data.slice(this.chartStart+i*peakWidth, this.chartStart+(i+1)*peakWidth));
        MergedData.push(peakHeight);
      }
          console.log(MergedData);

      for(let i=0; i<6; i++){
        panelData={columns: MergedData.slice(i*250, (i+1)*250),
                    range: {left: this.chartStart+i*250*peakWidth,right: this.chartStart+(i+1)*250*peakWidth-1}
                  };



        this.DividedMergedData.push(panelData);
      }

               
    }

  }

  toArray(a){
    this.data=new Array(4699674).fill(0);
    for(let key in a){
      var key1=parseInt(key);
      for(let i=key1; i<key1+40; i++)this.data[i]=this.data[i]+a[key];
    }
    const baselineInt=parseInt(this.baseLine);
    this.data=this.data.map(item=>item>baselineInt?item-baselineInt:0);
  }

}
