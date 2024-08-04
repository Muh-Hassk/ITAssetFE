import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient) { }
  getAllAssetUrl = 'https://localhost:7082/api/Asset/GetAllAssets';
  createAssetUrl = 'https://localhost:7082/api/Asset/CreateAsset';
  deleteAssetUrl = 'https://localhost:7082/api/Asset/DeleteAsset/';
  editAssetUrl = 'https://localhost:7082/api/Asset/UpdateAsset';

  getAllAsset() {
    console.log("here");
    
    return this.http.get(this.getAllAssetUrl) 
  }
  

  updateAsset(body: any): void {
    this.http.put(this.editAssetUrl, body).subscribe({
      next: (res) => {
        console.log("Asset Updated Successfully");
      },
      error: (err) => {
        console.error("Failed to Update Asset: ", err);
      }
    });
  }
  

  createAsset(body: any): void {
    console.log('Creating asset with data:', body);
  
    this.http.post(this.createAssetUrl, body).subscribe({
      next: (res) => {
        console.log('Asset Created Successfully', res);
      },
      error: (err) => {
        console.error('Failed to Create Asset:', err);
      }
    });
  }

  deleteAsset(assetId: number): Observable<void> {
    const url = `${this.deleteAssetUrl}${assetId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log('Asset deleted successfully');
      }),
      catchError(err => {
        console.error('Failed to delete asset:', err);
        return throwError(err); // Propagate the error
      })
    );
  }
  
  
}
