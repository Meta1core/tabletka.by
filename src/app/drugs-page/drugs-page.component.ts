import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { DrugsService } from '../drugs.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-drugs-page',
  templateUrl: './drugs-page.component.html',
  styleUrls: ['./drugs-page.component.css']
})
export class DrugsPageComponent implements OnInit {
  drugName;
  regionNumber;
  regions:Array<any>;
  region;
  regionValue;
  drugs:Array<any>;
  dataSource = new MatTableDataSource(this.drugs);
  constructor(private drugsService: DrugsService,  public route: ActivatedRoute, public router: Router) { }

  displayedColumns: string[] = ['ls_num','ls_name','tar_name','firm_name','country_name','otc_rx', 'nlec_name', 'price_min','price_max', 'apt_cnt'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit(): void {
    this.regionValue = localStorage.getItem("regionValue");
    this.drugName = localStorage.getItem("drugName");
    this.fillSelect();
    this.route.paramMap.subscribe(params => {
      
       this.drugName = params.get('drugName');
       this.region = params.get('region');
       console.clear();
       this.getDrugs();
       this.dataSource.sort = this.sort;
   });
   this.regionNumber = localStorage.getItem("regionValue");
  }


  getDrugs(){
    this.drugsService.getDrugs(this.drugName, this.region)
    .subscribe(data => {
      console.log(data);
      this.drugs = data[0].class;
      console.log(this.drugs);
      this.dataSource = new MatTableDataSource(this.drugs);
      this.dataSource.sort = this.sort;

    }, error => console.log(error));
  }
  findPharmacy(ls_num:number){
    this.router.navigate(['/pharmacy-page', ls_num, this.region]);
    for(let item of this.drugs){
      if (item.ls_num == ls_num){
        var infoDrug = item.ls_name + " " + item.tar_name;
        localStorage.setItem("infoDrug", infoDrug);
      }
  }
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
