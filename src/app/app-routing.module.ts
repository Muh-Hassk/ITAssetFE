import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssetManageComponent } from './asset-manage/asset-manage.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' 
  },
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'data',
    component:AssetManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
