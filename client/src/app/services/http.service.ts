import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BusinessType } from '../models/BusinessType';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getUniqueBusinessTypes(): Observable<BusinessType[]> {
    return this.http.get(this.apiUrl + '/businesstypes') as Observable<
      BusinessType[]
    >;
  }

  getPlaces(businessType: string, lat: string, long: string): Observable<any> {
    let params = new HttpParams();

    params = params.set('businessType', businessType);
    params = params.set('lat', lat);
    params = params.set('long', long);

    console.log(params);

    return this.http.get(this.apiUrl + '/places', { params: params });
  }
}
