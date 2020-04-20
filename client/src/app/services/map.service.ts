import { Injectable } from '@angular/core';
import { Marker } from '../models/Marker';
import { Score } from '../models/Score';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  marker: Marker;
  radius: number;
  businessType: string;
  scores: Score[] = [];

  constructor() {}
}
