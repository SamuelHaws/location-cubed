import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResultscreenComponent } from './components/resultscreen/resultscreen.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {path: 'results', component: ResultscreenComponent},
  { path: 'map', component: MapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
