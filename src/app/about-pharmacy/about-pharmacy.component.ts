import { Component, OnInit } from '@angular/core';
import { DrugsService } from '../drugs.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';
@Component({
  selector: 'app-about-pharmacy',
  templateUrl: './about-pharmacy.component.html',
  styleUrls: ['./about-pharmacy.component.css']
})
export class AboutPharmacyComponent implements OnInit {
  ls_num;
  region;
  drugName;
  regionValue;
  name;
  pharmacy:Array<any>;
  location: Location;
  latitude: number;
  longitude: number;
  regions:Array<any>;
  mapType: "satelite";
  constructor(private drugsService: DrugsService,  private _location: Location, public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.regionValue = localStorage.getItem("regionValue");
    this.route.paramMap.subscribe(params => { 
      this.ls_num = params.get('ls_num'); 
      this.region = params.get('region'); 
      this.name = params.get('name'); 
      console.clear();
      this.getInfoAboutPharmacy();
  });
  this.fillSelect();
  this.drugName = localStorage.getItem("drugName");
}
findTime(){
}

findDrugs(drugName: string, region:number){
  if(drugName == "" || undefined) {
    alert("Введите название препарата!");
    return;
  }
  this.router.navigate(['/drugs-page', drugName, region])
}

fillSelect(){
  this.drugsService.getRegions()
  .subscribe(data => {
    this.regions = data;
    console.log(data);
  }, error => console.log(error));

}

returnBack(){
  this._location.back();
}
getInfoAboutPharmacy(){
  this.drugsService.aboutPharmacy(this.name, this.ls_num, this.region)
    .subscribe(data => {
      this.pharmacy = data;
      this.pharmacy[0].phones = this.pharmacy[0].phones.substring(0, this.pharmacy[0].phones.length - 1);
      this.latitude = parseFloat(this.pharmacy[0].geo_y);
      this.longitude = parseFloat(this.pharmacy[0].geo_x);
      if(this.pharmacy[0].work6 == "1000-1000") this.pharmacy[0].work6 = "Выходной";
      if(this.pharmacy[0].work7 == "1000-1000") this.pharmacy[0].work7 = "Выходной";
      console.log(this.pharmacy)
    }, error => console.log(error));
    console.log(this.longitude);
}
}