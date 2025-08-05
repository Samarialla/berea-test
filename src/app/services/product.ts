import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../interface/IProduct';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(offset = 0, limit = 10): Observable<IProduct[]> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;
    return this.http.get<IProduct[]>(url);
  }

  createProduct(product: IProduct) {
    return this.http.post(this.apiUrl, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }


  getRelatedProductsBySlug(slug: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/slug/${slug}/related`);
  }
}
