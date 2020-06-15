import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { DrugsService } from '../drugs.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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

  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();


  constructor( private drugsService: DrugsService,  public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.getTest();

    this.bankCtrl.setValue(this.regions[10]);
    // load the initial bank list
    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });

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
  if(searchRegion == "") this.getTest();
  this.regions = this.filteredRegions = this.regions.filter(
    item => item.region.toLowerCase().includes(searchRegion.toLowerCase()));
    console.log(this.filteredRegions);
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
    }, error => console.log(error));
  }

  getTest(){
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
    this.router.navigate(['/drugs-page', drugName, region])
  }
}
export interface Bank {
  reg_num: string;
  region: string;
}