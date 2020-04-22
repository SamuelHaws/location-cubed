import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/services/http.service';
import { BusinessType } from 'src/app/models/BusinessType';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { take } from 'rxjs/operators';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // All business Types that exist in the OpenData Business License dataset
  businessTypes: string[] = [];
  // User's chosen business type, as a string (to be used as HTTP param)
  businessType: string;
  lat: string = '';
  lng: string = '';
  // radius to look for places from (lat,lng) in meters
  rad: number;

  constructor(
    private httpService: HTTPService,
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit() {
    this.httpService
      .getUniqueBusinessTypes()
      .pipe(take(1))
      .subscribe(businessTypes => {
        businessTypes.forEach(businessType => {
          this.businessTypes.push(businessType.descript);
        });
      });

    this.businessType = this.mapService.businessType;
    this.rad = this.mapService.rad;

    if (this.mapService.marker) {
      this.lat = this.mapService.marker.lat.toString();
      this.lng = this.mapService.marker.lng.toString();
    }
  }

  onSubmit() {
    this.httpService
      .getScores(this.lat, this.lng, this.rad, this.businessType)
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
        this.mapService.data = res;
        this.router.navigate(['/heatmap']);
      });
  }

  loadMap() {
    this.mapService.businessType = this.businessType;
    this.mapService.rad = this.rad;
    this.router.navigate(['/markermap']);
  }
}
