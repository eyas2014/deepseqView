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

  DividedMergedData;


  constructor(private dataService: DataService){}

  ngOnInit(){
  	var data=this.dataService.getData();
  	var peakWidth=Math.ceil(data.length/1500);
  	var numOfPeaks=Math.ceil(data.length/peakWidth);
  	var numOfPanels=Math.ceil(numOfPeaks/250);

  	var MergedData=[];
  	for(var i=0; i<numOfPeaks; i++){
  		MergedData.push(Math.max(...data.slice(i*peakWidth, (i+1)*peakWidth)));
  	}

  	this.DividedMergedData=[];
  	for(var i=0; i<numOfPanels-1; i++){
  		this.DividedMergedData[i]=MergedData.slice(250*i, 250*(i+1));
  	}
  	this.DividedMergedData[numOfPanels-1]=MergedData.slice(250*(numOfPanels-1), numOfPeaks);

  	console.log(this.DividedMergedData);

  }


}
