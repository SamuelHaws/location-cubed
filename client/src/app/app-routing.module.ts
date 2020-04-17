import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResultscreenComponent } from './components/resultscreen/resultscreen.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {path: 'results', component: ResultscreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
