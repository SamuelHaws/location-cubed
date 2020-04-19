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
      .getScoresByCoordinate(this.businessTypeStr, this.lat, this.long)
      .subscribe(res => {
        console.log(res);
      });
  }


}
