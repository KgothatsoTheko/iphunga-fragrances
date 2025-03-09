import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  fontStyleControl = new FormControl('');
  fontStyle?: string;
}
