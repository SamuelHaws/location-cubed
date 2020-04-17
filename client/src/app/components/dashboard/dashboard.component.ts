import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/services/http.service';
import { BusinessType } from 'src/app/models/BusinessType';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  businessTypes: BusinessType[];

  constructor(private httpService: HTTPService) {}

  ngOnInit() {
    this.httpService.getUniqueBusinessTypes().subscribe(businessTypes => {
      this.businessTypes = businessTypes;
      console.log(businessTypes);
    });
  }
}
