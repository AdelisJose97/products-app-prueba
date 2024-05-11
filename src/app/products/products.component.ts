import { Component, OnInit } from '@angular/core'
import { ProductsService } from './product.service'
import { Router } from '@angular/router'
import { IProduct } from './interface'

@Component({
  selector: 'products-component',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductsService],
})
export class ProductsComponent implements OnInit {
  errorMessage = ''
  products: IProduct[] = []
  showModal = false
  productToEdit?: IProduct

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  toggleModal() {
    this.showModal = !this.showModal
    if (!this.showModal) {
      this.productToEdit = undefined
    }

    if (this.showModal) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }

  addProduct(newItem: IProduct) {
    this.products.push(newItem)
  }

  hanldeEditProduct(product: IProduct) {
    this.setProductToEdit(product)
    this.toggleModal()
  }
  setProductToEdit(product?: IProduct) {
    this.productToEdit = product
    console.log('se ejecuto setProductToEdit', this.productToEdit)
  }

  editProduct(editedProduct: IProduct) {
    const index = this.products.findIndex(
      (product) => product.id === editedProduct.id
    )
    if (index !== -1) {
      this.products[index] = editedProduct
    }
  }

  deleteProduct(deletedProduct: IProduct) {
    this.productsService.delete(deletedProduct).subscribe({
      next: (product) => {
        const filterProducts = this.products.filter(
          (product) => product.id !== deletedProduct.id
        )
        this.products = filterProducts
      },
      error: (err) => (this.errorMessage = err),
    })
  }

  signOut() {
    localStorage.removeItem('access_token')
    this.router.navigate(['/login'])
  }

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products
      },
      error: (err) => {
        const token = localStorage.getItem('access_token')
        if (!token) this.signOut()
        this.errorMessage = err
      },
    })
  }
}
