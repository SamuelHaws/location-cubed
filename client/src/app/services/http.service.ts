import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BusinessType } from '../models/BusinessType';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  apiUrl = 'http://localhost:5000';

  crimeData: Observable<any>;
  businessData: Observable<any>;
  zoneData: Observable<any>;
  trafficData: Observable<any>;

  constructor(private http: HttpClient) {}

  getUniqueBusinessTypes(): Observable<BusinessType[]> {
    return this.http.get(this.apiUrl + '/businesstypes') as Observable<
      BusinessType[]
    >;
  }

  getMapResultData(
    lat: string,
    lng: string,
    rad: number,
    businessType: string
  ) {
    let params = new HttpParams();

    params = params.set('lat', lat);
    params = params.set('lng', lng);
    params = params.set('rad', rad.toString());
    params = params.set('businessType', businessType);

    this.crimeData = this.http.get(this.apiUrl + '/crimes', {
      params: params
    });
    this.businessData = this.http.get(this.apiUrl + '/businesses', {
      params: params
    });
    this.zoneData = this.http.get(this.apiUrl + '/zones', {
      params: params
    });
    this.trafficData = this.http.get(this.apiUrl + '/traffic', {
      params: params
    });
  }
}
