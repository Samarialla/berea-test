import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../interface/ICategory';

@Injectable({
  providedIn: 'root'
})
export class Category {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.escuelajs.co/api/v1/categories';

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.apiUrl);
  }
}
