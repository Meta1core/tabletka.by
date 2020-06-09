import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DrugsService {

  constructor(private http: HttpClient) { }

  // getRegions(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer 363445c9357d86a78539f8d3e52c089ae6589500'
  //   })
  //   return this.http.get("http://api.tab.by/regions/list", { headers: headers })
  //   }
  getRegions(): Observable<any> {
    return this.http.get("https://api-drugsearcher.herokuapp.com/drugs/regions");
  }
  getDrugs(drugName : string, region: number): Observable<any> {
    if(region == 0) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams().set("drugName",drugName);
    return this.http.get("https://api-drugsearcher.herokuapp.com/drugs/search", {params: params});
    }
    else {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      let params = new HttpParams().set("drugName",drugName).set("region", region.toString());
      return this.http.get("https://api-drugsearcher.herokuapp.com/drugs/search", {params: params});
    }
  }
  findPharmacy(ls_num: string, region: number): Observable<any> {
    if(region == 0) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams().set("ls_num",ls_num);
    return this.http.get("https://api-drugsearcher.herokuapp.com/drugs/pharmacy", {params: params});
    }
    else {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      let params = new HttpParams().set("ls_num",ls_num).set("region", region.toString());
      return this.http.get("https://api-drugsearcher.herokuapp.com/drugs/pharmacy", {params: params});
    }
  }
  aboutPharmacy(name:string, ls_num:number, region:number): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams().set("name",name).set("ls_num", ls_num.toString()).set("region",region.toString());
    return this.http.get("https://api-drugsearcher.herokuapp.com/drugs/pharmacy/about", {params: params});
  }
  checkPython(): Observable<any>{
    return this.http.get("http://localhost:5000/")
  }
}
