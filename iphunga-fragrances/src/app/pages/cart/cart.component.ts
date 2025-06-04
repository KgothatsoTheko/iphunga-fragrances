import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cart:any
  allItems:any

  constructor(private location: Location, private shared: SharedService, private router: Router){}

  ngOnInit() {
    this.cart = this.shared.get('cart', 'session')
    console.log('cart:', this.cart)
    this.allItems = [...this.cart]
    console.log("all items", this.allItems);
    
  }

  goBack(){
    this.router.navigate(['/landing/products'])
  }

  goToCheckout(){
    this.router.navigate(['/landing/checkout'])
  }

}
