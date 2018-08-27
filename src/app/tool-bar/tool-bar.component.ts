import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {DataService} from '../data.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  @Output() eventEmitter= new EventEmitter();
  @Input() scaleBar;
  sample1: boolean=false;
  sample2: boolean=false;
  selected=[];

  ymax=100;
  value;
  
  constructor(private dataService: DataService) { }

  sliderChange(){
  	this.ymax=[100, 200, 500, 1000, 2000, 5000, 10000, 50000, 100000, 4000000][this.value];
  }

  ngOnInit() {
  }

  onClick(str){
  	this.eventEmitter.emit(str);
  }

  sampleSelectionChange(){
  	if(this.selected.includes('sample1'))this.sample1=true;
  	else this.sample1=false;
  	if(this.selected.includes('sample2'))this.sample2=true;
  	else this.sample2=false;
  }
}
