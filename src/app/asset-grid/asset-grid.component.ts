import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ColDef, ICellRendererParams, CellValueChangedEvent } from 'ag-grid-community';
import { DataServiceService } from '../Services/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { timeout, timestamp } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-asset-grid',
  templateUrl: './asset-grid.component.html',
  styleUrls: ['./asset-grid.component.css']
})
export class AssetGridComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;

  assets: any;
  selectedAsset: any;

  datePipe = new DatePipe('en-US');

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    { headerName: 'Brand', field: 'brand', sortable: true, filter: true, width: 150, editable: true },
    { headerName: 'Serial Number', field: 'serialNumber', sortable: true, filter: true, width: 200, editable: true },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      width: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['New', 'In Use', 'Damaged', 'Dispose']
      }
    },
    { 
      headerName: 'Warranty Expiration', 
      field: 'warrantyExpirationDate', 
      sortable: true, 
      filter: true, 
      width: 180,
      editable: true,
      cellEditor: 'agDateCellEditor',
      valueFormatter: (params: { value: Date }) => this.datePipe.transform(params.value, 'yyyy-MM-dd') || 'N/A'
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: ICellRendererParams) => {
        const button = document.createElement('button');
        button.innerText = 'Delete';
        button.className = 'ag-grid-delete-button'; // Apply the CSS class
        button.addEventListener('click', () => {
          this.selectedAsset = params.data;
          this.openConfirmDeleteDialog(this.selectedAsset);
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

  constructor(private dataService: DataServiceService, public dialog: MatDialog, private toaster: ToastrService) {}

  ngOnInit(): void {
    this.fetchAllAssets();
  }

  fetchAllAssets() {
    this.dataService.getAllAsset().subscribe(data => {
      this.assets = data;
    });
  }

  openConfirmDeleteDialog(assetId: any): void {
    const dialogRef = this.dialog.open(this.confirmDeleteDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          this.onDelete(assetId);
        } else {
          console.log('Thank you');
        }
      } else {
        console.log('Dialog closed without action');
      }
    });
  }
  
  

  onDelete(asset: any): void {
    console.log("Here");
    
    this.dataService.deleteAsset(asset.id).subscribe(
      response => {
        console.log('Asset deleted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Delay of 3 seconds
      },
      error => {
        console.error('Failed to delete asset', error);
      }
    );
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const updatedAsset = event.data;

    // Convert date fields to yyyy-MM-dd format
    if (updatedAsset.warrantyExpirationDate) {
      updatedAsset.warrantyExpirationDate = this.datePipe.transform(updatedAsset.warrantyExpirationDate, 'yyyy-MM-dd') || '';
    }

    this.dataService.updateAsset(updatedAsset)
  }
}
