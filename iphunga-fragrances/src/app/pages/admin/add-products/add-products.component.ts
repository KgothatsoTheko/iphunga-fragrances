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

  adminForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', Validators.required),
    volume: new FormControl('', Validators.required)
     
  })

  category: any[] = [
    {value: 'Male', viewValue: 'Male'},
    {value: 'Female', viewValue: 'Female'},
  ]

  valume: any[] = [
    {value: '50ml', viewValue: '100ml'},
    {value: '50ml', viewValue: '100ml'},
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
          console.log(formData);
          // this.api.genericPost(`upload2/${addedMentor.fullName}`, formData).subscribe(
          //   (resposnse:any)=> {
          //     this.snackbar.open(`Success: ${resposnse}`, 'Ok', {duration: 3000})
          //     console.log("res", resposnse);
          //     this.dialog.close(true)
          //   },
          //   (error:any)=> {
          //     return this.snackbar.open(`Error: ${error}`, 'Ok', {duration: 3000})
          //   }
          // )
        }
      }
    )}
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
