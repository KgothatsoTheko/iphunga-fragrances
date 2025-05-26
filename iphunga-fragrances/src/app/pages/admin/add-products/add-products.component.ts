import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent {

  adminForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', Validators.required)
  })

  category: any[] = [
    {value: 'Male', viewValue: 'Male'},
    {value: 'Female', viewValue: 'Female'},
  ]

  constructor(private dialog:MatDialogRef<AddProductsComponent>, private location: Location, private api: ApiService, private router: Router, private snackbar: MatSnackBar) {

  }

  login() {
    const adminData = this.adminForm.value
    console.log("admin form", adminData);
    // this.api.genericPost('add-product', adminData).subscribe(
    //   (res:any) => {
    //     this.snackbar.open("Registered New Admin", "Ok", {duration: 3000})
    //     this.dialog.close()
    //   },
    //   (error:any) => {
    //     return this.snackbar.open(`Error: ${error}`, 'Ok', { duration: 3000 });
    //   }
    // )
  }

  cancel() {
    this.dialog.close()
  }

}
