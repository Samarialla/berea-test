import { AsyncPipe, CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product';
import { Observable } from 'rxjs';
import { IProduct } from '../../interface/IProduct';
import { Spinner } from "../shared/spinner/spinner";
import { Pagination } from '../shared/pagination/pagination';
import { Product } from '../product/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgForOf, AsyncPipe, Spinner, Pagination, Product],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  products$!: Observable<IProduct[]>;
  offset = 0;
  limit = 10;
  loading = false;
  totalProducts = 50
  @ViewChild('productModalRef') productModal!: Product;


  constructor(private productService: ProductService) {
  }
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.products$ = this.productService.getProducts(this.offset, this.limit);
    this.products$.subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  onPageChange(newOffset: number) {
    this.offset = newOffset;
    this.loadProducts();
  }
  deleteProduct(productId: number) {
    console.log(`Producto con ID ${productId} eliminado`);
  }

  openModal() {
    this.productModal.open();
  }

  onProductCreated() {
    this.loadProducts();
  }

  closeModal() {
    this.loadProducts();
  }

}