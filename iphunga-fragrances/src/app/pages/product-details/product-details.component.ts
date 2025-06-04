import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';

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
  products:any

  constructor(private location: Location, private shared: SharedService, private api: ApiService, private router: Router, private route: ActivatedRoute){}

  ngOnInit() {
    const product = this.route.snapshot.paramMap.get('id');
    if (product) {
      this.api.genericGet(`products/${product}`).subscribe(
        (res) => {
          this.products = res;
          console.log(this.products)
        },
        (error) => {
          console.error('Error fetching product details:', error);
        }
      );
    }
  }

  goBack(){
    this.location.back()
  }

  goToCart(){
    const newProduct = {
      ...this.products,
      size: this.fontStyleControl.value
    }
    this.shared.set('cart', [newProduct], 'session')
    this.router.navigate(['/landing/cart'])
  }
}
