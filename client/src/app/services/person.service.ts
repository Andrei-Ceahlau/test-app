import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/persons`;

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(API_URL);
  }

  get(id: number): Observable<Person> {
    return this.http.get<Person>(`${API_URL}/${id}`);
  }

  create(data: Person): Observable<Person> {
    const carIds = data.cars ? data.cars.map(car => car.id) : [];
    
    return this.http.post<Person>(API_URL, {
      nume: data.nume,
      prenume: data.prenume,
      cnp: data.cnp,
      varsta: data.varsta,
      cars: carIds
    });
  }

  update(id: number, data: Person): Observable<Person> {
    const carIds = data.cars ? data.cars.map(car => car.id) : [];
    
    return this.http.put<Person>(`${API_URL}/${id}`, {
      nume: data.nume,
      prenume: data.prenume,
      cnp: data.cnp,
      varsta: data.varsta,
      cars: carIds
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
} 