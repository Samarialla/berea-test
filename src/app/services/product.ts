import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../interface/IProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';

  getProducts(offset = 0, limit = 10): Observable<IProduct[]> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;
    return this.http.get<IProduct[]>(url);
  }

  createProduct(product: IProduct) {
    return this.http.post('https://api.escuelajs.co/api/v1/products/', product);
  }
}
