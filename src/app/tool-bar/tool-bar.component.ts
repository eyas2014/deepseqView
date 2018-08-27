import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {DataService} from '../data.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  @Output() eventEmitter= new EventEmitter();

  ymax=100;
  value;
  

  constructor(private dataService: DataService) { }

  sliderChange(){
  	this.ymax=100*Math.pow(10, this.value);
  }

  ngOnInit() {
  	this.scaleBar=this.dataService.scaleBar;
  	console.log(this.scaleBar);
  }

  onClick(str){
  	this.eventEmitter.emit(str);
  	this.scaleBar=this.dataService.scaleBar;

  }
}
