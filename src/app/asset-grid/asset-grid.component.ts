import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ColDef, ICellRendererParams, CellValueChangedEvent, ValueParserParams } from 'ag-grid-community';
import { DataServiceService } from '../Services/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-asset-grid',
  templateUrl: './asset-grid.component.html',
  styleUrls: ['./asset-grid.component.css']
})
export class AssetGridComponent implements OnInit {
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;

  assets: any; // Variable to hold the list of assets
  selectedAsset: any; // Variable to hold the currently selected asset

  datePipe = new DatePipe('en-US'); // Instance of DatePipe for date formatting

  // Column definitions for AG-Grid table
  columnDefs: ColDef[] = [
    { 
      headerName: 'ID', 
      field: 'id', 
      sortable: true, 
      filter: true, 
      width: 100 
    },
    { 
      headerName: 'Brand', 
      field: 'brand', 
      sortable: true, 
      filter: true, 
      width: 150, 
      editable: true 
    },
    { 
      headerName: 'Serial Number', 
      field: 'serialNumber', 
      sortable: true, 
      filter: true, 
      width: 200, 
      editable: true 
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      width: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor', // Dropdown editor for status
      cellEditorParams: {
        values: ['New', 'In Use', 'Damaged', 'Dispose'] // Status options
      }
    },
    { 
      headerName: 'Warranty Expiration', 
      field: 'warrantyExpirationDate', 
      sortable: true, 
      filter: true, 
      width: 180,
      editable: true,
      cellEditor: 'agDateCellEditor', // Date editor for warranty expiration
      valueFormatter: (params: { value: Date }) => this.datePipe.transform(params.value, 'yyyy-MM-dd') || 'N/A', // Format date for display
      valueParser: (params: ValueParserParams<string, Date>) => {
        const parsedDate = new Date(params.newValue); // Parse string to Date object
        return isNaN(parsedDate.getTime()) ? null : parsedDate; // Check if the date is valid
      }
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: ICellRendererParams) => {
        // Create a delete button element
        const button = document.createElement('button');
        button.innerText = 'Delete';
        button.className = 'ag-grid-delete-button'; // Apply CSS class for styling

        // Add a click event listener to the button
        button.addEventListener('click', () => {
          this.selectedAsset = params.data; // Set the selected asset
          this.openConfirmDeleteDialog(this.selectedAsset); // Open confirmation dialog
        });

        return button; // Return the button to be rendered in the cell
      }
    }
  ];

  // Default column settings for AG-Grid
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  constructor(
    private dataService: DataServiceService, // Data service for API interactions
    public dialog: MatDialog, // Angular Material dialog service
    private toaster: ToastrService // Toastr service for notifications
  ) {}

  ngOnInit(): void {
    this.fetchAllAssets(); // Fetch assets when the component initializes
  }

  // Fetch all assets from the server
  fetchAllAssets() {
    this.dataService.getAllAsset().subscribe(data => {
      this.assets = data; // Store the fetched assets
    });
  }

  // Open confirmation dialog before deleting an asset
  openConfirmDeleteDialog(asset: any): void {
    const dialogRef = this.dialog.open(this.confirmDeleteDialog); // Open the confirmation dialog
    
    // Handle the result when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          this.onDelete(asset); // Proceed with deletion if confirmed
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
        }, 3000);
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

    // Ensure the date field is in the correct format before sending to the server
    this.dataService.updateAsset(updatedAsset);
  }
}
