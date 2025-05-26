import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { SharedService } from '../../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProductsComponent } from '../add-products/add-products.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private dialog: MatDialog,private shared: SharedService, private router: Router) {}

  addProduct(){
    this.dialog.open(AddProductsComponent, {
      disableClose: true,
    })
  }

}
