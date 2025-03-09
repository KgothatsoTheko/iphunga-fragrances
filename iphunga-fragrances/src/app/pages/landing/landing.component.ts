import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../modules/material/material.module';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  constructor(private router: Router){}


  items:any = 0

  goToCart(){
    this.router.navigate(['/landing/cart'])
  }

}
