import { Component } from '@angular/core';
import {DataService} from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deepseqView';

  DividedMergedData=[];
  yscale;

  constructor(private dataService: DataService){}

  ngOnInit(){
    this.dataService.fetchData().subscribe(function(data){this.DividedMergedData=data});
    this.yscale=this.dataService.yscale;
  }

  update(){
    this.DividedMergedData=this.dataService.refetchData();
    this.yscale=this.dataService.yscale;
  }



}
