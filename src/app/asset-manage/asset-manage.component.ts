import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-asset-manage',
  templateUrl: './asset-manage.component.html',
  styleUrls: ['./asset-manage.component.css']
})
export class AssetManageComponent implements OnInit {
  @ViewChild('dialogContent') dialogContent!: TemplateRef<any>;

  newAssetForm: FormGroup;
  statusOptions: string[] = ['New', 'In Use', 'Damaged', 'Dispose'];

  constructor(
    private fb: FormBuilder,
    private dataService: DataServiceService,
    public dialog: MatDialog
  ) {
    // Initialize the form group
    this.newAssetForm = this.fb.group({
      brand: ['', Validators.required],
      serialNumber: ['', Validators.required],
      status: ['', Validators.required],
      warrantyExpirationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  openCreateAssetDialog(): void {
    const dialogRef = this.dialog.open(this.dialogContent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

  onSubmit(): void {
    if (this.newAssetForm.valid) {
      const newAsset = this.newAssetForm.value;
      this.dataService.createAsset(newAsset)
        this.dialog.closeAll();
    }
  }
}
