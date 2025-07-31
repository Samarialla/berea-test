import { AfterViewInit, Component, EventEmitter, inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product';
import { IProduct } from '../../interface/IProduct';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

import Modal from 'bootstrap/js/dist/modal';
import { Category } from '../../services/category';
import { map, Observable, startWith } from 'rxjs';
import { ICategory } from '../../interface/ICategory';


@Component({
  selector: 'app-product',
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,],
  templateUrl: './product.html',
  standalone: true,
  styleUrl: './product.scss'
})
export class Product implements OnInit, AfterViewInit {
  @Output() productCreated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<boolean>();
  private platformId = inject(PLATFORM_ID);

  private fb = inject(FormBuilder);
  private categoryService = inject(Category);
  private productService = inject(ProductService);
  categoryControl = new FormControl('');
  categories: ICategory[] = [];
  filteredCategories$!: Observable<ICategory[]>;

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required],
    categoryId: [32, [Validators.required, Validators.min(1)]],
    images: ['', Validators.required],
  });

  private modalInstance?: Modal;

  ngOnInit(): void {
    this.getCategories();
  }
  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const { default: Modal } = await import('bootstrap/js/dist/modal');
      const modalEl = document.getElementById('productModal');
      if (modalEl) {
        this.modalInstance = new Modal(modalEl);
      }
    }
  }

  private _filter(value: string): ICategory[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(cat => cat.name.toLowerCase().includes(filterValue));
  }

  onCategorySelected(selectedName: string) {
    const selectedCat = this.categories.find(c => c.name === selectedName) || 0;
    if (selectedCat) {
      this.productForm.controls['categoryId'].setValue(selectedCat?.id);
    }
  }

  open() {
    this.modalInstance?.show();
  }

  close() {
    this.modalInstance?.hide();
    this.closeModal.emit(true);
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
      title: this.productForm.value.title || '',
      price: this.productForm.value.price || 0,
      description: this.productForm.value.description || '',
      categoryId: this.productForm.value.categoryId || 0,
      images: [this.productForm.value.images || ''],
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

  getCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
      //console.log(cats)
      this.filteredCategories$ = this.categoryControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value|| ''))
      );
    });
  }
}
