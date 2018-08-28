import { Component } from '@angular/core';
import {DataService} from './data.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deepseqView';

  DividedMergedData;
  zoomStack=[];
  chartStart=0;
  scaleBar; 
  range;
  zoomLevel=0;
  dataRaw;
  mouseOnPanel;
  mouseOnColumn;

  constructor(private dataService: DataService){}

  ngOnInit(){
    this.dataRaw=this.dataService.fetchData();
    this.dataRaw.pipe(map(this.calculate.bind(this))).subscribe(data=>this.DividedMergedData=data);
  }

  onToolEvent($event){
    switch ($event) {
      case 'in':  this.zoomIn(0);
                  break;
      case 'out': this.zoomOut();
                  break;
      default:;
    }
  }


  onPanelClick(index){
    this.zoomIn(index);
  }

  zoomIn(index){
    console.log(this.dataRaw);
    if(this.zoomLevel<5){
      this.zoomStack.push(this.chartStart);
      this.zoomLevel++;
      this.chartStart=this.range[index].left;
      this.dataRaw.pipe(map(this.calculate.bind(this)))
                         .subscribe(data=>this.DividedMergedData=data);
    }else {
      alert('maximum zoomIn...');
    }
  }

  zoomOut(){
    if(this.zoomLevel>0){
      this.chartStart=this.zoomStack.pop();
      this.zoomLevel--;
      this.dataRaw.pipe(map(this.calculate.bind(this)))
                         .subscribe(data=>this.DividedMergedData=data);
    }else { 
      alert('maximum zoomOut...');
    }
  }

  enterColumn(index){
    const position=(this.mouseOnPanel*250+index)*this.scaleBar;
    this.mouseOnColumn=this.chartStart+position;

  }

  leaveColumn(){
    this.mouseOnColumn=null
  }

  enterPanel(index){
    this.mouseOnPanel=index;
  }



  calculate(data){
    var DividedMergedData=[];
    var peakWidth=1*Math.pow(6, 5-this.zoomLevel);
    this.scaleBar=peakWidth;
    let range;
    this.range=[];
    this.scaleBar=peakWidth;
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
        panelData={columns: MergedData.slice(i*250, (i+1)*250), range};
        DividedMergedData.push(panelData);
        this.range.push(range);
      }
    }
    return DividedMergedData;
  }


}
