import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApartment } from './apartment.model';
// import { Apartment } from './apartment.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApartmentService {
  SERVER_URL: string = environment.server_url;

  constructor(private http: HttpClient) {}

  async getApartments(queryString: string): Promise<IApartment[]> {
    return new Promise<IApartment[]>(async (resolve) => {
      resolve(
        this.http
          .get(this.SERVER_URL + 'a/apartment?' + queryString, {
            observe: 'response',
          })
          .toPromise()
          .then((res) => {
            const d: any = res.body;
            return d.data;
          })
          .catch(() => {
            return [];
          })
      );
    });
  }
}
