import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/services/http.service';
import { take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatMapComponent implements OnInit {
  latitude = 42.890981;
  longitude = -78.872579;
  mapType = 'roadmap';
  zoom = 12;
  maxZoom = 16;

  private map: google.maps.Map = null;
  private crimeHeatMap: google.maps.visualization.HeatmapLayer = null;
  private businessHeatMap: google.maps.visualization.HeatmapLayer = null;
  private zoneHeatMap: google.maps.visualization.HeatmapLayer = null;

  isCrimeDataLoaded: boolean;
  isBusinessDataLoaded: boolean;
  isZoneDataLoaded: boolean;

  crimeMapData = [];
  businessMapData = [];
  zoneMapData = [];

  constructor(
    private router: Router,
    private httpService: HTTPService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();

    this.httpService.crimeData.pipe(take(1)).subscribe(crimeData => {
      this.isCrimeDataLoaded = true;
      console.log('crimeData: ', crimeData);
      crimeData.forEach(crime => {
        let coords = {
          location: new google.maps.LatLng(crime.lat, crime.lng)
        };
        this.crimeMapData.push(coords);
      });
    });

    this.httpService.businessData.pipe(take(1)).subscribe(businessData => {
      this.isBusinessDataLoaded = true;
      console.log('businessData: ', businessData);
      businessData.forEach(business => {
        let coords = {
          location: new google.maps.LatLng(business.lat, business.lng)
        };
        this.businessMapData.push(coords);
      });
    });

    this.httpService.zoneData.pipe(take(1)).subscribe(zoneData => {
      this.isZoneDataLoaded = true;
      console.log('zoneData: ', zoneData);
      zoneData.forEach(zone => {
        let coords = {
          location: new google.maps.LatLng(zone.lat, zone.lng)
        };
        this.zoneMapData.push(coords);
      });
    });
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    this.crimeHeatMap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: this.crimeMapData,
      radius: 50
    });

    this.businessHeatMap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: this.businessMapData,
      gradient: [
        'rgba(0, 0, 0, 0)',
        'rgba(136,140,252, 1)',
        'rgba(62,67,209, 1)',
        'rgba(34,0,255, 1)'
      ],
      radius: 100
    });

    this.zoneHeatMap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: this.zoneMapData,
      gradient: ['rgba(0, 0, 0, 0)', 'rgba(137,250,147, 0.75)'],
      radius: 70
    });

    this.httpService.zoneData.pipe(take(1)).subscribe(zoneData => {
      console.log('zoneData', zoneData);
    });
  }

  toggleCrimeHeatmap() {
    if (this.crimeHeatMap.getData().getLength() > 0)
      this.crimeHeatMap.setData([]);
    else this.crimeHeatMap.setData(this.crimeMapData);
  }

  toggleBusinessHeatmap() {
    if (this.businessHeatMap.getData().getLength() > 0)
      this.businessHeatMap.setData([]);
    else this.businessHeatMap.setData(this.businessMapData);
  }

  toggleZoneHeatmap() {
    if (this.zoneHeatMap.getData().getLength() > 0)
      this.zoneHeatMap.setData([]);
    else this.zoneHeatMap.setData(this.zoneMapData);
  }

  back() {
    this.router.navigate(['/']);
  }
}
