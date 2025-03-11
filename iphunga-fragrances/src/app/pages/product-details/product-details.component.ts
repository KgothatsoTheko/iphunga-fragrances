import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private location: Location, private router: Router){}

  goBack(){
    this.location.back()
  }

  goToCart(){
    this.router.navigate(['/landing/cart'])
  }
}
