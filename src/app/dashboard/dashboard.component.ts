import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions1!: Highcharts.Options;
  chartOptions2!: Highcharts.Options;

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.fetchAllAssets();
  }

  fetchAllAssets() {
    this.dataService.getAllAsset().subscribe(assets => {
      this.createChart1(assets as any[]);
      this.createChart2(assets as any[]);
    });
  }

  createChart1(assets: any[]) {
    const brands: Record<string, number> = {};

    assets.forEach(asset => {
      brands[asset.brand] = (brands[asset.brand] || 0) + 1;
    });

    this.chartOptions1 = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Number of Assets by Brand'
      },
      xAxis: {
        categories: Object.keys(brands)
      },
      series: [{
        type: 'bar',
        name: 'Brands',
        data: Object.values(brands) as number[]
      }]
    };
  }

  createChart2(assets: any[]) {
    const statuses: Record<string, number> = {};

    assets.forEach(asset => {
      statuses[asset.status] = (statuses[asset.status] || 0) + 1;
    });

    this.chartOptions2 = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Number of Assets by Status'
      },
      series: [{
        type: 'pie',
        name: 'Statuses',
        data: Object.entries(statuses).map(([key, value]) => ({
          name: key,
          y: value as number
        }))
      }]
    };
  }
}
