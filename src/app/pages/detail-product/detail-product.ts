import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';
import { IProduct } from '../../interface/IProduct';
import { Spinner } from '../shared/spinner/spinner';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, Spinner, RouterLink],
  templateUrl: './detail-product.html',
  styleUrls: ['./detail-product.scss']
})
export class DetailProduct {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private currentIndex = signal(0);

  readonly productId = computed(() => {
    const idParam = this.route.snapshot.paramMap.get('id');
    return idParam ? Number(idParam) : 0;
  });

  readonly product = toSignal<IProduct | undefined>(this.productService.getProductById(this.productId()));
  readonly relatedProducts = toSignal(this.productService.getRelatedProducts(this.productId()));

  readonly selectedImage = computed(() => {
    const images = this.product()?.images || [];
    return images.length ? images[this.currentIndex()] : '';
  });

  prevImage() {
    const images = this.product()?.images || [];
    if (!images.length) return;

    this.currentIndex.set((this.currentIndex() - 1 + images.length) % images.length);
  }

  nextImage() {
    const images = this.product()?.images || [];
    if (!images.length) return;
    this.currentIndex.set((this.currentIndex() + 1) % images.length);
  }


}
