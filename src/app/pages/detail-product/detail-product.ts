import { Component, inject, computed, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';
import { Spinner } from '../shared/spinner/spinner';
import { switchMap } from 'rxjs';

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

  readonly productId = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return [id ? +id : 0];
      })
    ),
    { initialValue: 0 }
  );

  readonly product = toSignal(
    toObservable(this.productId).pipe(
      switchMap((id) => this.productService.getProductById(id))
    ),
    { initialValue: undefined }
  );

  readonly selectedImage = computed(() => {
    const images = this.product()?.images || [];
    return images.length ? images[this.currentIndex()] : '';
  });

  readonly relatedProducts = toSignal(
    toObservable(this.product).pipe(
      switchMap((product) =>
        product?.slug
          ? this.productService.getRelatedProductsBySlug(product.slug)
          : []
      )
    ),
    { initialValue: [] }
  );

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
