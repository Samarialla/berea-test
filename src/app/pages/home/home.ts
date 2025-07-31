import { AsyncPipe, CommonModule, NgForOf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product';
import { Observable } from 'rxjs';
import { IProduct } from '../../interface/IProduct';
import { Spinner } from "../shared/spinner/spinner";
import { Pagination } from '../shared/pagination/pagination';
import { Product } from '../product/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProduct } from '../delete-product/delete-product';

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
    private modalService = inject(NgbModal);



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


  openModal() {
    this.productModal.open();
  }

  onProductCreated() {
    this.loadProducts();
  }

  closeModal() {
    this.loadProducts();
  }

  trackByProductId(index: number, product: IProduct) {
    return product?.id;
  }

  deleteProduct(id: number) {
    if (id) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
           const modalRef = this.modalService.open(DeleteProduct);
        modalRef.result.then((result) => {
          if (result === true) {
            this.loadProducts();
          }
        }).catch(() => {
        });
        },
        error: (err) => {
          alert('Error al eliminar producto');
          console.error(err);
        },
        
      }
      )
    }
  }


}