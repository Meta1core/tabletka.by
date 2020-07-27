import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { DrugsService } from '../drugs.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {} from "googlemaps";
import { element } from 'protractor';
declare var google: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchField') searchField: ElementRef;
  defaultValue = 'domain';
  public regions:Array<any>;
  public drugs:Array<any>;
  public filteredRegions:Array<any>;


  public regionId : Number;


  public modelRegion: Bank;

  public userRegion;public userReg_num;

  public lat: any; lng: any;
  public currentCity : String;
  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  reload: boolean = false;

  constructor( private drugsService: DrugsService,  public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.sortRegions();
    this.reloadPage();
  }

  reloadPage(){
    if(localStorage.getItem("reloaded") == null){
      localStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Bank, b: Bank) => a && b && a.region === b.region;
      });
  }

  protected filterBanks() {
    console.log("ТЕСТ");
    if (!this.regions) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.regions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.regions.filter(bank => bank.region.toLowerCase().indexOf(search) > -1)
    );
  }

test(searchRegion: string){
  if(searchRegion == "") this.sortRegions();
  this.regions = this.filteredRegions = this.regions.filter(
    item => item.region.toLowerCase().includes(searchRegion.toLowerCase()));
    console.log(this.filteredRegions);
  }

  getCity(){
    navigator.geolocation.getCurrentPosition((position)=>{
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      new google.maps.Geocoder().geocode({'latLng' : latlng},(results, status) => {
       if (status == google.maps.GeocoderStatus.OK) {
           if (results[1]) {
               var country = null, countryCode = null, city = null, cityAlt = null;
               var c, lc, component;
               for (var r = 0, rl = results.length; r < rl; r += 1) {
                   var result = results[r];
   
                   if (!city && result.types[0] === 'locality') {
                       for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                           component = result.address_components[c];
   
                           if (component.types[0] === 'locality') {
                               city = component.long_name;
                               break;
                           }
                       }
                   }
                   else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
                       for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                           component = result.address_components[c];
   
                           if (component.types[0] === 'administrative_area_level_1') {
                               cityAlt = component.long_name;
                               break;
                           }
                       }
                   } else if (!country && result.types[0] === 'country') {
                       country = result.address_components[0].long_name;
                       countryCode = result.address_components[0].short_name;
                   }

                   if (city && country) {
                       break;
                   }
                   if (city != null && city!= undefined) {
                    console.log(city)
                   this.drugsService.getRegions()
                   .subscribe(data => {
                     this.filteredRegions = data;
                     for(let i of this.filteredRegions){
                      if(i.region == city){
                        this.userReg_num = i.reg_num;
                        this.userRegion = i.region;
                      }
                     }
                   }, error => console.log(error));
               }
            }
           }
       }
   });
});

}





















compareItems(i1, i2) {
  return i1 && i2 && i1.id===i2.id;
}

  clearAltVariants(){
    this.drugs = [];
  }
  setSearchedDrug(value){
    this.searchField.nativeElement.value = value;
    this.drugs = [];
  }

  fillDrugs(value){
    this.drugsService.getDrugs(value, 0)
    .subscribe(data => {
      this.drugs = data[0].class;
      console.log(this.drugs);
      this.drugs = this.drugs.filter((elem, index, self) => self.findIndex(
        (t) => {return (t.ls_name === elem.ls_name && t.ls_name === elem.ls_name)}) === index)
    }, error => console.log(error));
  }

  sortRegions(){
    this.drugsService.getRegions()
    .subscribe(data => {
      this.regions = data;
      this.filteredRegions = data;
      this.filteredBanks.next(data);
       this.regions.sort((n1, n2) => {
        return this.naturalCompare(n1.region, n2.region)
      })
      console.log(data);
    }, error => console.log(error));
    this.getCity();
  }

  naturalCompare(a, b) {
    var ax = [], bx = [];
 
    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
 
    while (ax.length && bx.length) {
      var an = ax.shift();
      var bn = bx.shift();
      var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if (nn) return nn;
    }
 
    return ax.length - bx.length;
 }

  findDrugs(drugName: string, region:number){
    if(drugName == "" || undefined) {
      alert("Введите название препарата!");
      return;
    }
    localStorage.setItem("regionValue", region.toString())
    localStorage.setItem("drugName", drugName.toString())
    this.router.navigate(['/drugs-page', drugName, region])
  }
}
export interface Bank {
  reg_num: string;
  region: string;
}