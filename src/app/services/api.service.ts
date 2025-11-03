import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-clawexpress.com.br/api/clt/simulate/lp';

  enviarCredito(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
