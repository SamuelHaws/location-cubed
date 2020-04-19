import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/services/http.service';
import { BusinessType } from 'src/app/models/BusinessType';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  businessTypes: BusinessType[];
  businessTypeStr: string;
  lat: string = '';
  long: string = '';

  constructor(private httpService: HTTPService, private router: Router) {}

  ngOnInit() {
    this.httpService
      .getUniqueBusinessTypes()
      .pipe(take(1))
      .subscribe(businessTypes => {
        this.businessTypes = businessTypes;
      });
  }

  onSubmit() {
    this.httpService
      .getPlaces(this.businessTypeStr, this.lat, this.long)
      .subscribe(res => {
        this.sendAddressestoAPI(res.results);
      });
  }

  /**
   * Parses the places surrounding a point for the addresses and sends them to the API
   * @param mapResponse The response from the submit that does the needful.
   */
  sendAddressestoAPI(mapResponse) {
    var sendable = [];
    mapResponse.forEach(location => {
      var addressParts = location.vicinity.split(" ");
      for(var i = 0; i < addressParts.length; i++) {
        // console.log(addressParts[i]);
        if(!isNaN(addressParts[i])) {
          var currentAddress = {
            "housenumber": addressParts[i],
            "street": addressParts[i+1]
          };
          sendable.push(currentAddress);
        }
      }
    });
    this.httpService.getScoreByAddress(JSON.stringify(sendable), this.businessTypeStr).subscribe(res => {
      console.log(res);
    });
  }


}
