import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {DataService} from '../data.service';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  @Input() scaleBar;
  @Input() hover_position;
  @Input() hover_reads;
  @Output() eventEmitter= new EventEmitter();
  
  isShow=[true, true];
  selected=['sample1', 'sample2'];
  sample_list=['sample1', 'sample2'];
  slider_value=2;
  ymax=100;
  
  constructor(private dataService: DataService) { }

  sliderChange(){
  	this.ymax=[10, 50, 100, 200, 500, 1000, 2000, 5000, 10000][this.slider_value];
  }

  ngOnInit(){

  }

 
  onClick(str){
  	this.eventEmitter.emit(str);
  }

  sampleSelectionChange(){
    for(var i=0; i<2; i++){
    	if(this.selected.includes(this.sample_list[i]))this.isShow[i]=true;
    	else this.isShow[i]=false;
    }
  }
}
