import { Component, OnInit } from '@angular/core';
import { DrugsService } from '../drugs.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-about-pharmacy',
  templateUrl: './about-pharmacy.component.html',
  styleUrls: ['./about-pharmacy.component.css']
})
export class AboutPharmacyComponent implements OnInit {
  ls_num;
  region;
  regionValue;
  name;
  pharmacy:Array<any>;
  location: Location;
  latitude: number;
  longitude: number;
  regions:Array<any>;
  mapType: "satelite";
  constructor(private drugsService: DrugsService,  public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.regionValue = localStorage.getItem("regionValue");
    this.route.paramMap.subscribe(params => { 
      this.ls_num = params.get('ls_num'); 
      this.region = params.get('region'); 
      this.name = params.get('name'); 
      console.clear();
      this.getInfoAboutPharmacy();
  });
}

findDrugs(drugName: string, region:number){
  this.router.navigate(['/drugs-page', drugName, region])
}

fillSelect(){
  this.drugsService.getRegions()
  .subscribe(data => {
    this.regions = data;
    console.log(data);
  }, error => console.log(error));
}

getInfoAboutPharmacy(){
  this.drugsService.aboutPharmacy(this.name, this.ls_num, this.region)
    .subscribe(data => {
      this.pharmacy = data;
      this.latitude = parseFloat(this.pharmacy[0].geo_y);
      this.longitude = parseFloat(this.pharmacy[0].geo_x);
    }, error => console.log(error));
    console.log(this.latitude);
    console.log(this.longitude);
}
}