import { Component, inject, } from '@angular/core';
import {  NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-product',
  imports: [NgbDatepickerModule],
  standalone: true,
  templateUrl: './delete-product.html',
  styleUrl: './delete-product.scss'
})
export class DeleteProduct {
  activeModal = inject(NgbActiveModal);

  close() {
   this.activeModal.close(true);
  }

}
