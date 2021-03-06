import { Injectable } from '@angular/core';
import { Marker } from '../models/Marker';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  marker: Marker;
  rad: number;
  businessType: string;

  constructor() {}
}
