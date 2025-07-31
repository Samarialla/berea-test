import { AfterViewInit, Component, EventEmitter, inject, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product';
import { IProduct } from '../../interface/IProduct';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';


@Component({
  selector: 'app-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.html',
  standalone: true,
  styleUrl: './product.scss'
})
export class Product implements AfterViewInit {
  @Output() productCreated = new EventEmitter<void>();
  private platformId = inject(PLATFORM_ID);

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required],
    categoryId: [null, [Validators.required, Validators.min(1)]],
    images: ['', Validators.required],
  });

  private modalInstance?: Modal;

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const { default: Modal } = await import('bootstrap/js/dist/modal');
      const modalEl = document.getElementById('productModal');
      if (modalEl) {
        this.modalInstance = new Modal(modalEl);
      }
    }
  }

  open() {
    this.modalInstance?.show();
  }

  close() {
    this.modalInstance?.hide();
  }

  get title() { return this.productForm.get('title')!; }
  get price() { return this.productForm.get('price')!; }
  get description() { return this.productForm.get('description')!; }
  get categoryId() { return this.productForm.get('categoryId')!; }
  get images() { return this.productForm.get('images')!; }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: IProduct = {
      title: this.title.value || '',
      price: this.price.value || 0,
      description: this.description.value || '',
      categoryId: this.categoryId.value || 0,
      images: [this.images.value || ''],
    };

    this.productService.createProduct(productData).subscribe({
      next: () => {
        alert('Producto creado correctamente!');
        this.productCreated.emit();
        this.close();
        this.productForm.reset();
      },
      error: (err) => {
        alert('Error al crear producto');
        console.error(err);
      }
    });
  }
}
