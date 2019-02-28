import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  genome_size=4641000;
  No_samples=2;
  panel_ranges=[];
  colors=["#00ff33","#ff0033","$33ffff", "#85f0e0","#33ff00"];
  ZIndexes=[];
  chart=[];
  column_width;
  mouseOnPanel;

  @Input() chart_data;
  @Input() chart_start;
  @Input() ymax;
  @Input() shifting;
  @Input() zoom;
  @Input() selected;
  @Input() loading;

  @Output() eventEmitter= new EventEmitter();


  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(){
  	this.column_width=6**(5-this.zoom);
  	this.assignPanels();
  	this.updatePanelRanges();
  	this.generateZIndexes();
  }

  updatePanelRanges(){
    this.panel_ranges=[];
    let chart_end=Math.min(this.chart_start+this.column_width*1500, this.genome_size-1);
    let No_panels=Math.ceil((chart_end-this.chart_start)/(250*this.column_width));
    let panel_range;
    for(let i=0; i<No_panels-1; i++){
      panel_range={};
      panel_range.left=this.chart_start+i*this.column_width*250;
      panel_range.right=this.chart_start+(i+1)*this.column_width*250-1;
      this.panel_ranges.push(panel_range);
    }
    panel_range={};
    panel_range.left=this.chart_start+(No_panels-1)*this.column_width*250;
    panel_range.right=chart_end;
    this.panel_ranges.push(panel_range);
  }

  generateZIndexes(){
    this.ZIndexes=[];
    for(let i=0; i<this.chart_data.length; i++){
      var highest_column=Math.max(...this.chart_data[i]);
      let ZIndex=[];
      for(let j=0; j<this.No_samples; j++){
        ZIndex[j]=highest_column==0?0:Math.floor(800*(highest_column-this.chart_data[i][j])/highest_column);
      }
      this.ZIndexes.push(ZIndex);
    }
  }


  assignPanels(){
    this.chart=[];
    let No_panels=Math.ceil(this.chart_data.length/250);
    for(let i=0; i<No_panels-1; i++){
      this.chart.push(this.chart_data.slice(i*250, (i+1)*250));
    }
    if(No_panels!=0)this.chart.push(this.chart_data.slice((No_panels-1)*250));
  }

  columnHeight(reads, selected, ymax){
    if(selected) return reads*140/ymax;
    else return 0;
  }

  enterColumn(index){
    let mouseOnColumn:number=this.chart_start+(this.mouseOnPanel*250+index)*this.column_width;
    let hover_data=this.chart[this.mouseOnPanel][index];

    let data_serialized="";
    for(let i=0; i<this.No_samples; i++){
      if(this.selected[i])data_serialized=data_serialized+'S'+(i+1)+': '+hover_data[i]+'  ';
    }

    this.eventEmitter.emit({type: "mouseEnterColumn",position: mouseOnColumn, data: data_serialized});


  }

  leaveColumn(){
  	this.eventEmitter.emit({type: "mouseLeaveColumn"});

  }

  enterPanel(index){
    this.mouseOnPanel=index;
  }

  onPanelClick(index){
    this.eventEmitter.emit({type: 'panelClick', panel: index});
  }

}
