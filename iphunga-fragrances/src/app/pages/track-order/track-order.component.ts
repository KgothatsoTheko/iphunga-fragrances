import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss'
})
export class TrackOrderComponent {

  show:Boolean = false
  status = 'Order Recieved'

  constructor(private snackbar: MatSnackBar) {}

  trackForm = new FormGroup({
    invoiceNumber: new FormControl('',Validators.required)
  })

  trackOrder(){
    if(this.trackForm.invalid) {
      this.snackbar.open('Enter a valid invoice number', 'Ok', {duration: 3000})
    } else {
      this.show = true
    }
  }

}
