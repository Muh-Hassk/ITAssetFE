import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import { Injectable } from '@angular/core'; // Import Injectable for dependency injection
import { ToastrService } from 'ngx-toastr'; // Import ToastrService for showing notifications
import { catchError, Observable, tap, throwError } from 'rxjs'; // Import RxJS operators for handling observables

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  // API endpoints
  private getAllAssetUrl = 'https://localhost:7082/api/Asset/GetAllAssets';
  private createAssetUrl = 'https://localhost:7082/api/Asset/CreateAsset';
  private deleteAssetUrl = 'https://localhost:7082/api/Asset/DeleteAsset/';
  private editAssetUrl = 'https://localhost:7082/api/Asset/UpdateAsset';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  // Method to get all assets
  getAllAsset(): Observable<any> {
    return this.http.get<any>(this.getAllAssetUrl).pipe(
      tap(() => this.toastr.success("All assets retrieved successfully")), // Show success message
      catchError(err => {
        this.toastr.error("Failed to retrieve assets"); // Show error message
        console.error("Failed to retrieve assets:", err); // Log error
        return throwError(err); // Propagate error
      })
    );
  }

  // Method to update an asset
  updateAsset(body: any): void {
    this.http.put(this.editAssetUrl, body).subscribe({
      next: () => {
        this.toastr.success("Asset updated successfully"); // Show success message
        console.log("Asset updated successfully"); // Log success
      },
      error: (err) => {
        this.toastr.error("Failed to update asset"); // Show error message
        console.error("Failed to update asset:", err); // Log error
      }
    });
  }

  // Method to create a new asset
  createAsset(body: any): void {
    this.http.post(this.createAssetUrl, body).subscribe({
      next: (res) => {
        this.toastr.success("Asset created successfully"); // Show success message
        console.log("Asset created successfully", res); // Log success
        window.location.reload(); // to refresh page
      },
      error: (err) => {
        this.toastr.warning("Failed to add asset"); // Show warning message
        console.error("Failed to create asset:", err); // Log error
      }
    });
  }

  // Method to delete an asset
  deleteAsset(assetId: number): Observable<void> {
    const url = `${this.deleteAssetUrl}${assetId}`; // Construct URL with asset ID
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.toastr.success("Asset deleted successfully"); // Show success message
        console.log('Asset deleted successfully'); // Log success
      }),
      catchError(err => {
        this.toastr.error("Failed to delete asset"); // Show error message
        console.error('Failed to delete asset:', err); // Log error
        return throwError(err); // Propagate error
      })
    );
  }
}
