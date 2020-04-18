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
  businessTypes: BusinessType[];
  businessTypeStr: string;
  lat: string = '';
  lng: string = '';
  radius: number;

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
        this.businessTypes = businessTypes;
        console.log(businessTypes);
      });

    if (this.mapService.marker) {
      this.lat = this.mapService.marker.lat.toString();
      this.lng = this.mapService.marker.lng.toString();
    }
  }

  onSubmit() {
    console.log(this.businessTypeStr + ' ' + this.lat + ' ' + this.lng);
    this.httpService
      .getPlaces(this.businessTypeStr, this.lat, this.lng)
      .subscribe(res => {
        console.log(res);
      });
  }

  loadMap() {
    this.router.navigate(['/map']);
  }
}
