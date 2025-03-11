import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  constructor(private location: Location, private router: Router){}

  goBack(){
    this.router.navigate(['/landing/products'])
  }

  goToCheckout(){
    this.router.navigate(['/landing/checkout'])
  }

}
