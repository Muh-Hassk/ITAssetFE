import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ColDef, ICellRendererParams, CellValueChangedEvent } from 'ag-grid-community';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-asset-grid',
  templateUrl: './asset-grid.component.html',
  styleUrls: ['./asset-grid.component.css']
})
export class AssetGridComponent implements OnInit {
  assets: any;

  datePipe = new DatePipe('en-US');

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    { headerName: 'Brand', field: 'brand', sortable: true, filter: true, width: 150 },
    { headerName: 'Serial Number', field: 'serialNumber', sortable: true, filter: true, width: 200 },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      width: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor', // Use AG-Grid's built-in select cell editor
      cellEditorParams: {
        values: ['New', 'In Use', 'Damaged', 'Dispose'] // Predefined values for the select dropdown
      }
    },
    { 
      headerName: 'Warranty Expiration', 
      field: 'warrantyExpirationDate', 
      sortable: true, 
      filter: true, 
      width: 180,
      valueFormatter: (params: { value: Date }) => this.datePipe.transform(params.value, 'yyyy/MM/dd') || 'N/A',
      editable: true
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: ICellRendererParams) => {
        const button = document.createElement('button');
        button.innerText = 'Delete';
        button.className = 'ag-grid-delete-button'; 
        button.addEventListener('click', () => {
          if (confirm(`Are you sure you want to delete asset with ID ${params.data.id}?`)) {
            this.onDelete(params.data);
          }
        });
        return button;
      }
    }
  ];

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.fetchAllAssets();
  }

  fetchAllAssets() {
    this.dataService.getAllAsset().subscribe(data => {
      this.assets = data;
    });
  }

  onDelete(asset: any): void {
    this.dataService.deleteAsset(asset.id).subscribe(response => {
      console.log('Asset deleted successfully');
    }, error => {
      console.error('Failed to delete asset', error);
    });
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const updatedAsset = event.data;
    this.dataService.updateAsset(updatedAsset)
  }
}
