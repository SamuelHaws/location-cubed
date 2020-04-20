import { Component, OnInit } from '@angular/core';
import { Marker } from 'src/app/models/Marker';
import { MapService } from 'src/app/services/map.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './markermap.component.html',
  styleUrls: ['./markermap.component.css']
})
export class MarkerMapComponent implements OnInit {
  latitude = 42.890981;
  longitude = -78.872579;
  mapType = 'roadmap';
  zoom = 12;
  marker: Marker;

  constructor(private mapService: MapService, private router: Router) {}

  ngOnInit() {}

  addMarker(lat: number, lng: number) {
    this.marker = {
      lat,
      lng
    };
    // Center map on marker
    this.latitude = lat;
    this.longitude = lng;
    // Expand confirmation modal
    $('#confirmationModal').modal('toggle');

    // this.mapService.marker = this.marker;
  }

  setMarker() {
    this.mapService.marker = this.marker;
    this.router.navigate(['/']);
  }
}
