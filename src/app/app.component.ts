import { Component } from '@angular/core';
import {DataService} from './data.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deepseqView';
  genome_size=4641000;
  chart=[];
  zoom=0;
  chart_start=0;
  column_width;
  mouseOnPanel;
  mouseOnColumn;
  panel_ranges=[];
  colors=["#00ff33","#ff0033","$33ffff", "#85f0e0","#33ff00"];
  ZIndex=[];
  zoom_stack=[];

  constructor(private http: HttpClient){}

  ngOnInit(){
    
    this.column_width=6**(5-this.zoom);

    this.updatePanelRange();

    this.http.get("/api/chart?zoom=0&start=0", {responseType: "text"})
         .subscribe(data=>{
             this.chart=JSON.parse(data);
             this.updateZIndex();
         });

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
    if(this.zoom<5){
      this.zoom_stack.push(this.chart_start);
      this.zoom++;
      this.column_width=this.column_width/6;
      this.chart_start=this.chart_start+index*this.column_width*1500;
      this.http.get("/api/chart/"+this.zoom+"/"+this.chart_start, {responseType: "text"})
               .subscribe(data=>{
                  this.chart=JSON.parse(data);
                  this.updateZIndex();
                  this.updatePanelRange();
                });

    }else {
      alert('maximum zoomIn...');
    }
  }

  zoomOut(){
    if(this.zoom>0){
      this.zoom--;
      this.chart_start=this.zoom_stack.pop();
      this.column_width=this.column_width*6;
      this.http.get("/api/chart/"+this.zoom+"/"+this.chart_start, {responseType: "text"})
         .subscribe(data=>{
                      this.chart=JSON.parse(data);
                      this.updateZIndex();
                      this.updatePanelRange();
                  });

    }else { 
      alert('maximum zoomOut...');
    }
  }

  enterColumn(index){
    this.mouseOnColumn=(this.mouseOnPanel*250+index)*this.column_width;
  }

  leaveColumn(){
    this.mouseOnColumn=null
  }

  enterPanel(index){
    this.mouseOnPanel=index;
  }


  updateZIndex(){
    this.ZIndex=[];
    for(var i=0; i<this.chart.length; i++){
      this.ZIndex[i]=[];
      for(var j=0; j<this.chart[i].length; j++){
        this.ZIndex[i][j]=[];
        for(var k=0; k<this.chart[i][j].length; k++){
          var highest_column=Math.max(...this.chart[i][j]);
          this.ZIndex[i][j][k]=highest_column==0?0:800*(highest_column-this.chart[i][j][k])/highest_column;
        }
      }
    }
  }

  updatePanelRange(){
    var i=0;
    var panel_cursor=this.chart_start;
    do {
      this.panel_ranges[i]={left: panel_cursor};
      var panel_cursor=panel_cursor+this.column_width*250;
      this.panel_ranges[i].right=panel_cursor<this.genome_size?panel_cursor-1:this.genome_size;
      i++;
    } while(panel_cursor<this.genome_size);


  }

  columnHeight(reads, selected, ymax){
    if(selected) return reads*140/ymax;
    else return 0;

  }

}
