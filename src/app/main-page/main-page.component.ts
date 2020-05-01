import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { DrugsService } from '../drugs.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  regions:Array<any>;
  constructor( private drugsService: DrugsService,  public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.getTest();
  }
  getTest(){
    this.drugsService.getRegions()
    .subscribe(data => {
      this.regions = data;
      console.log(data);
    }, error => console.log(error));
  }

  findDrugs(drugName: string, region:number){
    this.router.navigate(['/drugs-page', drugName, region])
  }
}
