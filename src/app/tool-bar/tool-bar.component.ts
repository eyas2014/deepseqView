import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {DataService} from '../data.service';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  @Input() scaleBar;
  @Input() hover_content;
  @Output() eventEmitter= new EventEmitter();
  
  isShow=[true, true];
  selected=['sample1', 'sample2'];
  sample_list=['sample1', 'sample2'];
  slider_value=2;
  
  constructor(private dataService: DataService) { }

  ngOnInit(){}

  sliderChange(){
  	let ymax=[10, 50, 100, 200, 500, 1000, 2000, 5000, 10000][this.slider_value];
    this.eventEmitter.emit({type:"change_ymax", ymax:ymax});
  }

 
  zoom(action){
  	this.eventEmitter.emit({type:action});
  }

  shift(action){
    this.eventEmitter.emit({type:action});
  }

  sampleSelectionChange(){
    for(var i=0; i<2; i++){
    	if(this.selected.includes(this.sample_list[i]))this.isShow[i]=true;
    	else this.isShow[i]=false;
    }
    this.eventEmitter.emit({type:"select_sample", selected: this.isShow});
  }

}
