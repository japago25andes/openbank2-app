import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerificarOtpRequest, VerificarOtpResponse } from './validacion-otp.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidacionOtpService {

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) { }

  verificarOtp(request: VerificarOtpRequest): Observable<VerificarOtpResponse> {
    const url = this.baseUrl + '/api/v1/identidad/verificarOtp';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //return this.http.post<VerificarOtpResponse>(url, request, { headers });
    return this.http.post<VerificarOtpResponse>('http://localhost:5050/api/v1/identidad/verificarOtp', request, { headers });
  }
}
