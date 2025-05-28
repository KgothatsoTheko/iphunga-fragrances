import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  allProducts: any

  constructor(private dialog:MatDialog, private location: Location, private api: ApiService, private router: Router, private snackbar: MatSnackBar) {
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

}
