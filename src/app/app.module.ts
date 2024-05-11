import { NgModule, importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'

import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { ProductsComponent } from './products/products.component'
import { ProductDialogAdd } from './product-dialog-add/product-dialog-add.component'
import { AuthGuard } from './auth.guard'

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'login', component: LoginComponent },
    ]),
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ProductsComponent,
    ProductDialogAdd,
  ],
  providers: [importProvidersFrom(HttpClientModule)],
  bootstrap: [AppComponent],
})
export class AppModule {}
