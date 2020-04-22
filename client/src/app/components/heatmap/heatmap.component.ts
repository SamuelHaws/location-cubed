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
  maxZoom = 17;

  private map: google.maps.Map = null;
  private crimeHeatMap: google.maps.visualization.HeatmapLayer = null;
  private businessHeatMap: google.maps.visualization.HeatmapLayer = null;

  constructor(private mapService: MapService) {}

  ngOnInit() {}

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    // here our in other method after you get the coords; but make sure map is loaded
    let heatmapdata = [];

    this.mapService.data[0].forEach(incident => {
      heatmapdata.push({
        location: new google.maps.LatLng(incident.latitude, incident.longitude)
      });
    });

    // this.mapService.scores.push({
    //   address: '',
    //   lat: 42.890592258013704,
    //   lng: -78.87067511355886,
    //   score: 2
    // });
    // this.mapService.scores.push({
    //   address: '',
    //   lat: 42.89193736947815,
    //   lng: -78.87125974901336,
    //   score: 3
    // });
    // this.mapService.scores.forEach(score => {
    //   let coordsWithWeight = {
    //     location: new google.maps.LatLng(score.lat, score.lng),
    //     weight: score.score
    //   };
    //   heatmapdata.push(coordsWithWeight);
    // });

    this.crimeHeatMap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: heatmapdata,
      radius: 50
    });
  }
}
