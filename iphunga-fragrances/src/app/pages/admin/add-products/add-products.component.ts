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

  fileName:any | string="No Image"
  upload:any
  fileChoosen:any
  uploadForm: FormGroup

  FormData:any


  adminForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', Validators.required),
    volume: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
     
  })

  category: any[] = [
    {value: 'male', viewValue: 'male'},
    {value: 'female', viewValue: 'female'},
  ]

  valume: any[] = [
    {value: '50ml', viewValue: '50ml'},
    {value: '100ml', viewValue: '100ml'},
  ]

  constructor(private dialog:MatDialogRef<AddProductsComponent>, private location: Location, private api: ApiService, private router: Router, private snackbar: MatSnackBar) {

    this.uploadForm = new FormGroup({
      file: new FormControl('')
  })
  }

  uploadFile(){
    this.upload = document.getElementById('upload') as HTMLInputElement;
    this.fileChoosen = document.getElementById('file-choosen');
    if (this.upload && this.fileChoosen) {
      this.upload.addEventListener('change', (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.fileChoosen.textContent = input.files[0].name;
          this.fileName = input.files[0].name
      
          const formData = new FormData();
          formData.append('file', input.files[0], input.files[0].name)
          this.FormData = input.files[0]
          console.log(this.FormData);
        }
      }
    )}
  }

  login() {
    const productData = {
      name: this.adminForm.value.name,
      description: this.adminForm.value.description,
      category: this.adminForm.value.category,
      image: this.FormData,
      sizes: [
        {price: this.adminForm.value.price,
          volume: this.adminForm.value.volume,
          quantity: this.adminForm.value.quantity,
        }
      ]
    }
    console.log("admin form", productData);
    this.api.genericPost('add-product', productData).subscribe(
      (res:any) => {
        this.snackbar.open("New Product Added", "Ok", {duration: 3000})
        const formData = new FormData();
        formData.append('file', this.FormData, this.FormData.name)
        this.api.genericPost(`upload/${productData.name}`, formData).subscribe(
            (resposnse:any)=> {
              this.snackbar.open(`Success: ${resposnse}`, 'Ok', {duration: 3000})
              console.log("res", resposnse);
              productData.image = resposnse.file;
              this.api.genericUpdate(`/update-product/${res._id}`, productData).subscribe(
                (response1:any) => {
                  this.snackbar.open(`Success: ${response1}`, 'Ok', {duration: 3000})
                  console.log("res", response1);
                },
                (error:any)=> {
              return this.snackbar.open(`Error: ${error}`, 'Ok', {duration: 3000})
              }
              )
              this.dialog.close(true)
            },
            (error:any)=> {
              return this.snackbar.open(`Error: ${error}`, 'Ok', {duration: 3000})
            }
          )
      },
      (error:any) => {
        return this.snackbar.open(`Error: ${error}`, 'Ok', { duration: 3000 });
      }
    )
  }

  cancel() {
    this.dialog.close()
  }

}
