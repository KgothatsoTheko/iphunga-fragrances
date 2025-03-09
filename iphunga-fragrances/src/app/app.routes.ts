import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

export const routes: Routes = [
    {path: '', redirectTo: 'landing/home', pathMatch: 'full'},
    {path: 'landing', component: LandingComponent, children: [
    {path: 'home', component: HomeComponent},
    {path: 'products', component: ProductListComponent},
    {path: 'product-detail', component: ProductDetailsComponent},
    {path: 'track-order', component: TrackOrderComponent},
    {path: 'cart', component: CartComponent},
    {path: 'checkout', component: CheckoutComponent},
    ]},
];
