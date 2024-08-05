import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'; // Import Highcharts for charting
import { DataServiceService } from '../Services/data-service.service'; // Import the data service

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // Define the type for Highcharts
  chartOptions1!: Highcharts.Options; // Options for the first chart
  chartOptions2!: Highcharts.Options; // Options for the second chart

  constructor(private dataService: DataServiceService) {}

  // Lifecycle hook for component initialization
  ngOnInit(): void {
    this.fetchAllAssets(); // Fetch assets when the component initializes
  }

  // Fetch all assets from the data service
  fetchAllAssets() {
    this.dataService.getAllAsset().subscribe(assets => {
      this.createChart1(assets as any[]); // Create the first chart with asset data
      this.createChart2(assets as any[]); // Create the second chart with asset data
    });
  }

  // Create the first chart: Number of Assets by Brand
  createChart1(assets: any[]) {
    const brands: Record<string, number> = {}; // Object to store brand counts

    assets.forEach(asset => {
      // Count each brand
      brands[asset.brand] = (brands[asset.brand] || 0) + 1;
    });

    // Define the chart options
    this.chartOptions1 = {
      chart: {
        type: 'bar' // Set chart type to bar
      },
      title: {
        text: 'Number of Assets by Brand' // Chart title
      },
      xAxis: {
        categories: Object.keys(brands) // X-axis categories (brand names)
      },
      series: [{
        type: 'bar', // Series type
        name: 'Brands', // Series name
        data: Object.values(brands) as number[] // Series data (counts of each brand)
      }]
    };
  }

  // Create the second chart: Number of Assets by Status
  createChart2(assets: any[]) {
    const statuses: Record<string, number> = {}; // Object to store status counts

    assets.forEach(asset => {
      // Count each status
      statuses[asset.status] = (statuses[asset.status] || 0) + 1;
    });

    // Define the chart options
    this.chartOptions2 = {
      chart: {
        type: 'pie' // Set chart type to pie
      },
      title: {
        text: 'Number of Assets by Status' // Chart title
      },
      series: [{
        type: 'pie', // Series type
        name: 'Statuses', // Series name
        data: Object.entries(statuses).map(([key, value]) => ({
          name: key, // Pie slice name (status)
          y: value as number // Pie slice value (count)
        }))
      }]
    };
  }
}
