import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  constructor(private router: Router){}

  goToProduct(){
    this.router.navigate(['/landing/product-detail'])
  }
}
