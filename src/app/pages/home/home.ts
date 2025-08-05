import { CommonModule, NgForOf } from '@angular/common';
import { Component, inject, ViewChild, signal } from '@angular/core';
import { ProductService } from '../../services/product';
import { IProduct } from '../../interface/IProduct';
import { Spinner } from "../shared/spinner/spinner";
import { Pagination } from '../shared/pagination/pagination';
import { Product } from '../product/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProduct } from '../delete-product/delete-product';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { IStatus } from '../../interface/IStatus';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgForOf, Spinner, Pagination, Product, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  offset = signal(0);
  limit = signal(10);
  totalProducts = 50;
  refresh = signal(0);

  productsResource = httpResource<IProduct[]>(() => ({
    method: 'GET',
    url: `${environment.apiUrl}/products`,
    params: {
      offset: this.offset(),
      limit: this.limit(),
      refresh: this.refresh()
    }
  }));

  get loading() {
    return this.productsResource.status() === IStatus.LOADING;
  }

  get reloading() {
    return this.productsResource.status() === IStatus.REL;
  }

  get error() {
    return this.productsResource.status() === IStatus.ERROR ? this.productsResource.error() : null;
  }

  get products() {
    return this.productsResource.value() ?? [];
  }

  @ViewChild('productModalRef') productModal!: Product;
  private modalService = inject(NgbModal);
  private productService = inject(ProductService);

  openModal() {
    this.productModal.open();
  }

  onProductCreated() {
    this.offset.set(this.offset());
  }

  closeModal() {
    this.offset.set(this.offset());
  }

  onPageChange(newOffset: number) {
    this.offset.set(newOffset);
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
            if (result) {
              this.refresh.update(v => v + 1);
            }
          }).catch(() => { });
        },
        error: (err) => {
          alert('Error al eliminar producto');
          console.error(err);
        }
      });
    }
  }
}
