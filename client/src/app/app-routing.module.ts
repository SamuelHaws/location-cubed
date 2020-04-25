import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MarkerMapComponent } from './components/markermap/markermap.component';
import { HeatMapComponent } from './components/heatmap/heatmap.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'markermap', component: MarkerMapComponent },
  { path: 'heatmap', component: HeatMapComponent },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
