import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/services/http.service';
import { BusinessType } from 'src/app/models/BusinessType';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  businessTypes: BusinessType[];
 

  constructor(private httpService: HTTPService, private router: Router) {}

  ngOnInit() {
    this.httpService.getUniqueBusinessTypes().subscribe(businessTypes => {
      this.businessTypes = businessTypes;
      console.log(businessTypes);
    });
  }



  form = new FormGroup({
    business: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  });
  
  get f(){
    return this.form.controls;
  }
  
  submit(){
    console.log(this.form.value);
    this.router.navigate(['/results']);
  }

 
}