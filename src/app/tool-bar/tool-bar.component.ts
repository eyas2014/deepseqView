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
  @Input() mouseOnColumn;
  sample1: boolean=true;
  sample2: boolean=true;
  selected=['sample1', 'sample2'];
  snapshot="";
  genome='';

  ymax=100;
  value;
  
  constructor(private dataService: DataService) { }

  sliderChange(){
  	this.ymax=[10, 50, 100, 200, 500, 1000, 2000, 5000, 10000][this.value];
  }

  ngOnInit(){
      this.dataService.getGenome().subscribe(genome=>this.genome=genome);
  }

  ngOnChanges() {
    if(this.mouseOnColumn)this.snapshot=this.genome.substring(this.mouseOnColumn, this.mouseOnColumn+32);
    else this.snapshot=''
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
