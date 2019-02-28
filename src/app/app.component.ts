import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deepseqView';
  genome_size=4641000;
  No_samples=2;
  zoom=0;
  chart_start=0;
  column_width;
  hover_content={position:"", data:""};

  zoom_stack=[];
  chart_data=[];
  shifting="";
  loading;
  column_shift=0;
  selected=[true, true];
  ymax=100;

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.column_width=6**(5-this.zoom);
    this.loading=true;
    this.http.get("/api/chart/0/0", {responseType: "text"})
         .subscribe(data=>{
                  this.chart_data=JSON.parse(data);
                  this.loading=false;
         });

  }

  onToolEvent($event){
    switch ($event.type) {
      case 'change_ymax':  this.ymax=$event.ymax;
                  break;
      case 'select_sample':  this.selected=$event.selected;
                  break;
      case 'in': this.zoomIn(0);
                  break;
      case 'out': this.zoomOut();
                  break;
      case 'left':  this.shiftLeft();
                  break;
      case 'right': this.shiftRight();
                  break;

      default:;
    }
  }

  onChartEvent($event){
    switch ($event.type) {
      case 'mouseEnterColumn': 
                  this.hover_content={position:$event.position, data:$event.data};
                  break;
      case 'mouseLeaveColumn': 
                  this.hover_content={position:"", data:""};
                  break;
      case 'panelClick':  this.zoomIn($event.panel);
                  break;
      default:;
    }
  }

  zoomIn(index){
    if(this.zoom<5){
      this.zoom_stack.push(this.chart_start+this.column_shift);
      this.column_shift=0;
      this.loading=true;
      this.zoom++;
      this.column_width=this.column_width/6;
      this.chart_start=this.chart_start+index*this.column_width*1500;
      this.http.get("/api/chart/"+this.zoom+"/"+this.chart_start, {responseType: "text"})
               .subscribe(data=>{
                  this.loading=false;
                  this.chart_data=JSON.parse(data);
                }); 

    }else {
      alert('maximum zoomIn...');
    }
  }

  zoomOut(){
    this.column_shift=0;
    this.loading=true;
    if(this.zoom>0){
      this.zoom--;
      this.column_width=this.column_width*6;
      this.chart_start=this.zoom_stack.pop();
      this.http.get("/api/chart/"+this.zoom+"/"+this.chart_start, {responseType: "text"})
         .subscribe(data=>{
                      this.chart_data=JSON.parse(data);
                      this.loading=false;
                  });

    }else { 
      alert('maximum zoomOut...');
    }
  }






  shiftLeft(){
    if(this.chart_start+this.column_width*1500>this.genome_size){
      alert("Sorry, no more");
      return;
    }
    this.shifting="left";
    let padding = Array(6).fill(0).map(() => Array(this.No_samples).fill(0));
    this.chart_data=this.chart_data.slice(6);
    this.chart_data=this.chart_data.concat(padding);

    this.column_shift=this.column_shift+this.column_width*6;
    this.http.get("/api/shift/"+this.zoom+"/"+(this.chart_start+1494*this.column_width+this.column_shift), {responseType: "text"})
   .subscribe(data=>{
                let shift_data=JSON.parse(data);
                this.chart_data=this.chart_data.slice(0,1494);
                this.chart_data=this.chart_data.concat(shift_data);
                this.shifting="";
            }); 

  }

  shiftRight(){
    if(this.chart_start<=0){
      alert("Sorry, no more");
      return;
    }
    this.shifting="right";
    this.column_shift=this.column_shift-this.column_width*6;
    let padding = Array(6).fill(0).map(() => Array(this.No_samples).fill(0));
    this.chart_data=padding.concat(this.chart_data);
    if(this.chart_data.length>1500) this.chart_data=this.chart_data.slice(0,1500);
    this.http.get("/api/shift/"+this.zoom+"/"+(this.chart_start+this.column_shift), {responseType: "text"})
   .subscribe(data=>{
                let shift_data=JSON.parse(data);
                this.chart_data=this.chart_data.slice(6);
                this.chart_data=shift_data.concat(this.chart_data);
                this.shifting="";
            });   


  }


}
