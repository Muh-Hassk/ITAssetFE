import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-asset-manage',
  templateUrl: './asset-manage.component.html',
  styleUrls: ['./asset-manage.component.css']
})
export class AssetManageComponent {
  // Reference to the dialog content template
  @ViewChild('dialogContent') dialogContent!: TemplateRef<any>;

  // Form group for creating a new asset
  newAssetForm: FormGroup;
  // Options for the asset status dropdown
  statusOptions: string[] = ['New', 'In Use', 'Damaged', 'Dispose'];

  constructor(
    private fb: FormBuilder, // Service for building reactive forms
    private dataService: DataServiceService, // Service for API interactions
    public dialog: MatDialog // Service for managing dialogs
  ) {
    // Initialize the form group with controls and validation
    this.newAssetForm = this.fb.group({
      brand: ['', Validators.required], // Brand of the asset, required field
      serialNumber: ['', Validators.required], // Serial number of the asset, required field
      status: ['', Validators.required], // Status of the asset, required field
      warrantyExpirationDate: ['', Validators.required] // Warranty expiration date, required field
    });
  }



  // Open the dialog for creating a new asset
  openCreateAssetDialog(): void {
    const dialogRef = this.dialog.open(this.dialogContent, {
      width: '600px' // Set the width of the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      // No need to handle anything here it got handled by onSubmit{}
    });
  }

  // Handle form submission for creating a new asset
  onSubmit(): void {
    if (this.newAssetForm.valid) { // Checks if the form has all data as valid
      const newAsset = this.newAssetForm.value; // Get the asset form group values
      this.dataService.createAsset(newAsset) // Call Api
        this.dialog.closeAll(); // Close Dialog
    }
  }
}
