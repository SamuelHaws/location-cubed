import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { ResultscreenComponent } from './components/resultscreen/resultscreen.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, ResultscreenComponent, MapComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBLT-P4ecWpHBsk1OMVPgJftjqf5G6klSQ'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
