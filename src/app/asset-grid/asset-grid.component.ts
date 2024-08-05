import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ColDef, ICellRendererParams, CellValueChangedEvent } from 'ag-grid-community';
import { DataServiceService } from '../Services/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-asset-grid',
  templateUrl: './asset-grid.component.html',
  styleUrls: ['./asset-grid.component.css']
})
export class AssetGridComponent implements OnInit {
  // Reference to the confirmation dialog template for deletion
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;

  // Variables to hold the assets data and the currently selected asset
  assets: any;
  selectedAsset: any;

  // Create an instance of DatePipe for formatting dates
  datePipe = new DatePipe('en-US');

  // Column definitions for the AG-Grid table
  columnDefs: ColDef[] = [
    // Column for asset ID
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    // Column for asset brand
    { headerName: 'Brand', field: 'brand', sortable: true, filter: true, width: 150, editable: true },
    // Column for serial number
    { headerName: 'Serial Number', field: 'serialNumber', sortable: true, filter: true, width: 200, editable: true },
    // Column for asset status with a dropdown editor
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
    // Column for warranty expiration date with a date editor and formatted display
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
    // Column for action buttons, specifically a delete button
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: ICellRendererParams) => {
        // Create a delete button element
        const button = document.createElement('button');
        button.innerText = 'Delete';
        button.className = 'ag-grid-delete-button'; // Apply a CSS class for styling
        // Add a click event listener to the button
        button.addEventListener('click', () => {
          this.selectedAsset = params.data;
          this.openConfirmDeleteDialog(this.selectedAsset); // Open the confirmation dialog
        });
        return button; // Return the button element to be rendered in the cell
      }
    }
  ];

  // Default column settings for AG-Grid
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  constructor(private dataService: DataServiceService, public dialog: MatDialog, private toaster: ToastrService) {}

  ngOnInit(): void {
    this.fetchAllAssets(); // Fetch all assets when the component initializes
  }

  // Fetch all assets from the server and store them in the 'assets' variable
  fetchAllAssets() {
    this.dataService.getAllAsset().subscribe(data => {
      this.assets = data;
    });
  }

  // Open a confirmation dialog before deleting an asset
  openConfirmDeleteDialog(assetId: any): void {
    const dialogRef = this.dialog.open(this.confirmDeleteDialog); // Open the dialog
    
    // Handle the result when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          this.onDelete(assetId); // Proceed with deletion if confirmed
        } else {
          console.log('Thank you'); // Log message if cancellation is confirmed
        }
      } else {
        console.log('Dialog closed without action'); // Log if the dialog is closed without any action
      }
    });
  }

  // Delete an asset by calling the data service
  onDelete(asset: any): void {
    console.log("Deleting asset...");
    
    this.dataService.deleteAsset(asset.id).subscribe(
      response => {
        console.log('Asset deleted successfully');
        setTimeout(() => {
          window.location.reload(); // Refresh the page after a delay of 3 seconds
        }, 3000); // 3-second delay
      },
      error => {
        console.error('Failed to delete asset', error); // Log error if deletion fails
      }
    );
  }

  // Handle changes to cell values in the grid
  onCellValueChanged(event: CellValueChangedEvent): void {
    const updatedAsset = event.data;

    // Convert date fields to 'yyyy-MM-dd' format for consistency
    if (updatedAsset.warrantyExpirationDate) {
      updatedAsset.warrantyExpirationDate = this.datePipe.transform(updatedAsset.warrantyExpirationDate, 'yyyy-MM-dd') || '';
    }

    this.dataService.updateAsset(updatedAsset); // Update the asset in the server
  }
}
