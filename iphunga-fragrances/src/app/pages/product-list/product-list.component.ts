import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  allProducts: any

  constructor(private router: Router, private api: ApiService, private snackbar: MatSnackBar){
    this.loadProducts()
  }

  private loadProducts(){
      this.api.genericGet(`get-products`).subscribe(
            (resposnse:any)=> {
              this.allProducts = resposnse
              this.snackbar.open(`Success: ${resposnse}`, 'Ok', {duration: 3000})
              console.log("res", this.allProducts);
            },
            (error:any)=> {
              return this.snackbar.open(`Error: ${error}`, 'Ok', {duration: 3000})
            }
          )
    }

  goToProduct(item:any){
    this.router.navigate([`/landing/product-detail`, item._id])
  }
}
