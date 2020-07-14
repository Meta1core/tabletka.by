import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { DrugsService } from '../drugs.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {} from "googlemaps";

declare var google: any;

export interface PeriodicElement {
  apt_id: number;
  name: string;
  region:string;
  address: string;
  phones: string;
  is_24: number;
  work_today: string;
  distanceBetweenUser: number;
  data_update: string;
}
@Component({
  selector: 'app-pharmacy-page',
  templateUrl: './pharmacy-page.component.html',
  styleUrls: ['./pharmacy-page.component.css']
})
export class PharmacyPageComponent implements OnInit {
  checked = false;
  checked2 = false;

  location: Location;
  selectedMarker: Marker;

  userlat;
  userlng;
  usermarkgeolocation: any;
  usergeolocation: any;
  pharmacygeolocation: any;

  ls_num;
  region;
  regions:Array<any>;
  pharmacys:Array<any>;
  sorted_amount: boolean = false;
  sorted_gospharmacy: boolean = false;
  distances:Array<any> = [];
  dataSource;
  regionNumber;
  myImage = "./assets/pictures/gmap.jpg";
  closeResult = '';
  mapType: "satelite";
  
  x:number;
  y:number;
  constructor( private drugsService: DrugsService,  public route: ActivatedRoute, public router: Router, private modalService: NgbModal) { }

  displayedColumns: string[] = ['apt_id','name','address', 'region', 'phones', 'is_24', 'work_today', 'date_update', 'price_list[0].price','amount','distanceBetweenUser'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit(): void {
    this.regionNumber = localStorage.getItem("regionValue");
    console.clear();
    this.selectedMarker = {
      lat: 53.4184231,
      lng: 27.3576187,
      label: ""
  }
    this.location = {
      latitude: 53.4184231,
      longitude: 27.3576187,
      mapType: "satelite",
      zoom: 5,
      markers: [
          {
              lat: 53.4184231,
              lng: 27.3576187,
              label: ""
          }
      ]
  }
    this.route.paramMap.subscribe(params => { 
      this.ls_num = params.get('ls_num'); 
      this.region = params.get('region'); 
  });
  this.drugsService.findPharmacy(this.ls_num, this.region)
  .subscribe(data => {
    console.log(data);
    if(this.region == 0) {
      this.x = 27.3576187;
      this.y = 53.4184231;
      this.location.zoom = 6;
    } else {
    this.x = parseFloat(data[0].geo_x);
    this.y = parseFloat(data[0].geo_y);
    this.location.markers[0].lat = this.y;
    this.location.markers[0].lng = this.x;
    this.location.zoom = 11;
  }
    this.location.latitude = this.y;
    this.location.longitude = this.x;
  }, error => console.log(error));
  navigator.geolocation.getCurrentPosition((position)=>{
    this.userlat = position.coords.latitude;
    this.userlng = position.coords.longitude;
    this.location.longitude = position.coords.longitude;
    this.location.latitude = position.coords.latitude;
    this.location.zoom = 11;
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position)=>{
      this.userlat = position.coords.latitude;
      this.userlng = position.coords.longitude;
      this.location.longitude = position.coords.longitude;
      this.location.latitude = position.coords.latitude;
      this.location.zoom = 11;
    });
} else {
   console.log("No support for geolocation")
}
  this.findPharmacys();
  this.setCurrentPosition();
}

sortByUserMark(lat: number, lng: number, label:string){
  this.location.markers.pop();
  console.log("Метка поставлена!");
  console.log(lat, lng, label)
  this.addMarker(lat, lng, label);
  for(let item of this.pharmacys){
    this.usermarkgeolocation = { 
      lat: lat, 
      lng: lng
  };
  this.pharmacygeolocation = { 
      lat: item.geo_y, 
      lng: item.geo_x
  };
  item.distanceBetweenUser = (this.calculateDistance(this.usermarkgeolocation, this.pharmacygeolocation));
  }
  this.sortByCoords();
}

sortPharmacy(){
  if(this.checked2 == false){
    if(this.sorted_gospharmacy == false){
    this.drugsService.findPharmacy(this.ls_num, this.region)
    .subscribe(data => {
      this.sorted_gospharmacy = true;
      this.pharmacys = [];
      if(this.checked == true){
        for(let item of data){
          if(item.price_list[0].amount == '0' || String(item.name).includes("Фармация") || String(item.name).includes("фармация") ){
          }
          else if(item.price_list[0].amount == '0.000' || String(item.name).includes("Фармация") || String(item.name).includes("фармация") ){
            
          }
          else {
            this.pharmacys.push(item);
          }
        }
        for(let i of this.pharmacys){
          i.price_list[0].amount = Number(i.price_list[0].amount);
         }
      }
      else {
      for(let item of data){
        if(String(item.name).includes("Фармация") ){
          
        }
        else if(String(item.name).includes("фармация")){
          
        }
        else {
          this.pharmacys.push(item);
        }
      }
    }
      this.fillDistances()
      this.dataSource = new MatTableDataSource(this.pharmacys);
      this.dataSource.sort = this.sort;
      for(let item of data) {
        this.addMarker(item.geo_y, item.geo_x, item.apt_id);
       }
    }, error => console.log(error)); }
    else{
      this.findPharmacys();
    }
  }
  else{
    this.findPharmacys();
  }
}
sortAmount(){
  if(this.checked == false){
  if(this.sorted_amount == false){
  this.drugsService.findPharmacy(this.ls_num, this.region)
  .subscribe(data => {
    this.sorted_amount = true;
    this.pharmacys = [];
    if(this.checked2 == true){
      for(let item of data){
        if(item.price_list[0].amount == '0' || String(item.name).includes("Фармация") || String(item.name).includes("фармация") ){
        }
        else if(item.price_list[0].amount == '0.000' || String(item.name).includes("Фармация") || String(item.name).includes("фармация") ){
          
        }
        else {
          this.pharmacys.push(item);
        }
      }
      for(let i of this.pharmacys){
        i.price_list[0].amount = Number(i.price_list[0].amount);
       }
    }
    else {
    for(let item of data){
      if(item.price_list[0].amount == '0' ){
      }
      else if(item.price_list[0].amount == '0.000'){
        
      }
      else {
        this.pharmacys.push(item);
      }
    }
  }
    for(let i of this.pharmacys){
      i.price_list[0].amount = Number(i.price_list[0].amount);
     }

    this.fillDistances()
    this.dataSource = new MatTableDataSource(this.pharmacys);
    this.dataSource.sort = this.sort;
    for(let item of data) {
      this.addMarker(item.geo_y, item.geo_x, item.apt_id);
     }
  }, error => console.log(error)); }
  else{
    this.findPharmacys();
  }
}
else{
  this.findPharmacys();
}
}

fillDistances(){
  for(let item of this.pharmacys){
    this.usergeolocation = { 
      lat: this.userlat, 
      lng: this.userlng 
  };
  this.pharmacygeolocation = { 
      lat: item.geo_y, 
      lng: item.geo_x
  };
  item.distanceBetweenUser = (this.calculateDistance(this.usergeolocation, this.pharmacygeolocation));
  if(item.distanceBetweenUser == 'NaN'){
    item.distanceBetweenUser = 0;
  }
  }
}

calculateDistance(point1, point2) {
  const p1 = new google.maps.LatLng(
  point1.lat,
  point1.lng
  );
  const p2 = new google.maps.LatLng(
  point2.lat,
  point2.lng
  );
  return (
  google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000
  ).toFixed(2);
}

selectMarker(event) {
  console.log("Маркер выбран")
    this.selectedMarker = {
        lat: event.latitude,
        lng: event.longitude,
        label: event.label
    }
    for(let item of this.location.markers){
      if (item.label == "Ваша метка"){
        const index = this.location.markers.indexOf(item);
        if (index > -1) {
          this.location.markers.splice(index, 1);
        }
      }
    }
}

addMarker(lat: number, lng: number, label:string) {
    this.location.markers.push({
        lat,
        lng,
        label
    })
  }

  setCurrentPosition() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      this.addMarker(
        position.coords.latitude,
        position.coords.longitude,
        "Вы находитесь здесь!"
      )
    });
    } else {
    alert("Geolocation is not supported by this browser, please use google chrome.");
    }
  }

  openGM(content) {
    navigator.geolocation.getCurrentPosition((position)=>{
      this.location.longitude = position.coords.longitude;
      this.location.latitude = position.coords.latitude;
      this.location.zoom = 11;
    });
    this.modalService.open(content, {size: 'xl', centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  findPharmacys(){
    this.pharmacys = [];
    this.sorted_amount = false;
    this.drugsService.findPharmacy(this.ls_num, this.region)
    .subscribe(data => {
      this.pharmacys = data;
      for(let i of this.pharmacys){
       i.price_list[0].amount = Number(i.price_list[0].amount);
       i.phones = i.phones.substring(0, i.phones.length - 1);
      }
      this.fillDistances()
      this.dataSource = new MatTableDataSource(this.pharmacys);
      this.dataSource.sort = this.sort;
      for(let item of data) {
        this.addMarker(item.geo_y, item.geo_x, item.apt_id);
       }
       
    }, error => console.log(error));
  }

  aboutPharmacy(name:string){
    this.drugsService.aboutPharmacy(name, this.ls_num, this.region)
    .subscribe(data => {
      console.log(data);
    }, error => console.log(error));
    this.router.navigate(['/about-pharmacy',this.ls_num, this.region, name]);
  }

  sortByCoords(){
    this.pharmacys.sort(function (a, b) {
      return a.distanceBetweenUser - b.distanceBetweenUser;
    });
  }

  sortByPrice(){
    this.pharmacys.sort(function (a, b) {
      return a.price_list[0].price - b.price_list[0].price
    });
  }

  fillSelect(){
    this.drugsService.getRegions()
    .subscribe(data => {
      this.regions = data;
      console.log(data);
    }, error => console.log(error));
  }

  findDrugs(drugName: string, region:number){
    if(drugName == "" || undefined) {
      alert("Введите название препарата!");
      return;
    }
    this.router.navigate(['/drugs-page', drugName, region])
  }
}

interface Marker {
    lat: number;
    lng: number;
    label: string;
}

interface Location {
    latitude: number;
    longitude: number;
    mapType: string;
    zoom: number;
    markers: Array<Marker>;
}