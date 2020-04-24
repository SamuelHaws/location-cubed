import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/services/http.service';
import { take } from 'rxjs/operators';

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

  constructor(private httpService: HTTPService) {}

  ngOnInit() {}

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    this.httpService.crimeData.pipe(take(1)).subscribe(crimeData => {
      console.log('crimeData: ', crimeData);
      this.crimeHeatMap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: crimeData,
        // gradient: [
        //   'rgba(0, 0, 0, 0)',
        //   'rgba(0, 255, 0, 1)',
        //   'rgba(0, 0, 255, 1)'
        // ],
        radius: 50
      });
    });

    this.httpService.businessData.pipe(take(1)).subscribe(businessData => {
      console.log('businessData: ', businessData);
      this.businessHeatMap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: businessData,
        gradient: [
          'rgba(0, 0, 0, 0)',
          'rgba(137, 196, 244, 1)',
          'rgba(77, 5, 232, 1)'
        ],
        radius: 150
      });
    });

    this.httpService.zoneData.pipe(take(1)).subscribe(zoneData => {
      console.log('zoneData', zoneData);
    });
  }
}
