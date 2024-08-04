import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private getAllAssetUrl = 'https://localhost:7082/api/Asset/GetAllAssets';
  private createAssetUrl = 'https://localhost:7082/api/Asset/CreateAsset';
  private deleteAssetUrl = 'https://localhost:7082/api/Asset/DeleteAsset/';
  private editAssetUrl = 'https://localhost:7082/api/Asset/UpdateAsset';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAllAsset(): Observable<any> {
    return this.http.get<any>(this.getAllAssetUrl).pipe(
      tap(() => this.toastr.success("All assets retrieved successfully")),
      catchError(err => {
        this.toastr.error("Failed to retrieve assets");
        console.error("Failed to retrieve assets:", err);
        return throwError(err);
      })
    );
  }

  updateAsset(body: any): void {
    this.http.put(this.editAssetUrl, body).subscribe({
      next: () => {
        this.toastr.success("Asset updated successfully");
        console.log("Asset updated successfully");
      },
      error: (err) => {
        this.toastr.error("Failed to update asset");
        console.error("Failed to update asset:", err);
      }
    });
  }

  createAsset(body: any): void {
    this.http.post(this.createAssetUrl, body).subscribe({
      next: (res) => {
        this.toastr.success("Asset created successfully");
        console.log("Asset created successfully", res);
      },
      error: (err) => {
        this.toastr.warning("Failed to add asset\nThere's Data duplication");
        console.error("Failed to create asset:", err);
      }
    });
  }

  deleteAsset(assetId: number): Observable<void> {
    const url = `${this.deleteAssetUrl}${assetId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.toastr.success("Asset deleted successfully");
        console.log('Asset deleted successfully');
      }),
      catchError(err => {
        this.toastr.error("Failed to delete asset");
        console.error('Failed to delete asset:', err);
        return throwError(err);
      })
    );
  }
}
