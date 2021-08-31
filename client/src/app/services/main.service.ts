import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  private _actionUrl: string;

  constructor(private _http: HttpClient) {
    this._actionUrl = 'http://127.0.0.1:3000/';
  }


  public async getPointsOfInterest(bounds: object): Promise<Array<object>> {
    console.log(bounds);
    const params = new HttpParams().set('lat_min', bounds['South']).set('lat_max', bounds['North'])
    .set('lon_min', bounds['East']).set('lon_max', bounds['West']);

    return new Promise<Array<object>>(async (resolve, reject) => {
      try {
        console.log(this._actionUrl + 'getInBounds');
        const results = <Array<object>> await this._http.get(this._actionUrl + 'getInBounds', {params: params}).toPromise();
        resolve(results);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  public async getNewPointsOfInterest(): Promise<void> {
    try {
      await this._http.post(this._actionUrl + 'newPOI', 'qwerrr').toPromise();
    } catch (err) {
      console.log(err);
    }
  }

  public getUploadTime(uploadDate: number): Date {
    return new Date(uploadDate * 1000);
  }

  public async saveProgress() {
    await this._http.post(this._actionUrl + 'progress', '').toPromise();
  }
}
