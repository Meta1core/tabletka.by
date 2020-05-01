import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DrugsPageComponent } from './drugs-page/drugs-page.component';
import { PharmacyPageComponent } from './pharmacy-page/pharmacy-page.component';
import { AboutPharmacyComponent } from './about-pharmacy/about-pharmacy.component';

const routes: Routes = [
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },
  { path: 'main-page', component: MainPageComponent },
  { path: 'pharmacy-page/:ls_num/:region', component: PharmacyPageComponent, pathMatch: 'full' },
  { path: 'drugs-page/:drugName/:region', component: DrugsPageComponent, pathMatch: 'full'},
  { path: 'about-pharmacy/:ls_num/:region/:name', component: AboutPharmacyComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
