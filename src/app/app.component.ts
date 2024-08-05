import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService) {} // Calling spinner Service 
  ngOnInit(): void { // to show spinner every time you run the program
    this.spinner.show();

    setTimeout(() => {
      // spinner ends after 5 seconds 
      this.spinner.hide();
    }, 2000);
  }
  title = 'ITAssetFE';
  
}
