import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/cars`;

@Injectable({
  providedIn: 'root'
})
export class CarService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Car[]> {
    return this.http.get<Car[]>(API_URL);
  }

  get(id: number): Observable<Car> {
    return this.http.get<Car>(`${API_URL}/${id}`);
  }

  create(data: Car): Observable<Car> {
    return this.http.post<Car>(API_URL, {
      marca: data.marca,
      model: data.model,
      an_fabricatie: data.an_fabricatie,
      capacitate_cilindrica: data.capacitate_cilindrica,
      taxa_impozit: data.taxa_impozit
    });
  }

  update(id: number, data: Car): Observable<Car> {
    return this.http.put<Car>(`${API_URL}/${id}`, {
      marca: data.marca,
      model: data.model,
      an_fabricatie: data.an_fabricatie,
      capacitate_cilindrica: data.capacitate_cilindrica,
      taxa_impozit: data.taxa_impozit
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
} 