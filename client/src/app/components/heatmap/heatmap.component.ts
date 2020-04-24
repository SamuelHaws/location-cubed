import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

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

  constructor(private mapService: MapService) {}

  ngOnInit() {}

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    let crimeHeatMapData = [];
    let businessHeatMapData = [];

    this.mapService.data[0].forEach(incident => {
      crimeHeatMapData.push({
        location: new google.maps.LatLng(incident.latitude, incident.longitude)
      });
    });

    this.mapService.data[1].forEach(business => {
      businessHeatMapData.push({
        location: new google.maps.LatLng(business.latitude, business.longitude)
      });
    });

    this.crimeHeatMap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: crimeHeatMapData,
      // gradient: [
      //   'rgba(0, 0, 0, 0)',
      //   'rgba(0, 255, 0, 1)',
      //   'rgba(0, 0, 255, 1)'
      // ],
      radius: 50
    });
    this.businessHeatMap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: businessHeatMapData,
      gradient: [
        'rgba(0, 0, 0, 0)',
        'rgba(137, 196, 244, 1)',
        'rgba(77, 5, 232, 1)'
      ],
      radius: 150
    });
  }
}
