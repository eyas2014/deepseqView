import { Component } from '@angular/core';
import {DataService} from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deepseqView';

  DividedMergedData;
  ymin;
  ymax;

  constructor(private dataService: DataService){}

  ngOnInit(){
    this.DividedMergedData=this.dataService.fetchData();
    this.ymax=100;
  }

  onToolEvent($event){
    switch ($event) {
      case 'in':  this.DividedMergedData=this.dataService.zoomIn(0);
                  break;
      case 'out': this.DividedMergedData=this.dataService.zoomOut();
                  break;
      default:;
    }
  }


  onPanelClick(index){
    this.DividedMergedData=this.dataService.zoomIn(index);
  }


}
