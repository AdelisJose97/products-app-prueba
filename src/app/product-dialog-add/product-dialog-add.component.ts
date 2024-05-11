import { Component, Input, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms'
import * as Joi from '@hapi/joi'
import { Output, EventEmitter } from '@angular/core'

import { ProductsService } from '../products/product.service'
import { IProduct } from '../products/interface'

@Component({
  selector: 'product-dialog-add',
  templateUrl: './product-dialog-add.html',
  styleUrls: ['./product-dialog-add.component.css'],
  providers: [ProductsService],
})
export class ProductDialogAdd implements OnChanges {
  @Input() showModal: boolean = false
  @Input() productToEdit?: IProduct

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {}
  @Output() newProductEvent = new EventEmitter<IProduct>()
  @Output() modalEvent = new EventEmitter<void>()
  @Output() updateProductEvent = new EventEmitter<IProduct>()

  addNewProduct(value: IProduct) {
    this.newProductEvent.emit(value)
  }
  editProdct(value: IProduct) {
    this.updateProductEvent.emit(value)
  }

  handleTogleModal() {
    this.modalEvent.emit()
  }

  formGroupSchema = Joi.object({
    id: Joi.string().optional(),
    handle: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    sku: Joi.number().required().positive(),
    grams: Joi.number().required().positive(),
    stock: Joi.number().required().positive(),
    price: Joi.number().required().positive(),
    comparePrice: Joi.number().required().positive(),
    barCode: Joi.number().required().positive(),
  })
  formGroup = this.fb.group(
    {
      id: '',
      handle: [''],
      title: [''],
      description: [''],
      sku: [0],
      grams: [0],
      stock: [0],
      price: [0],
      comparePrice: [0],
      barCode: [0],
    },
    {
      validators: this.createValidatorFromSchema(this.formGroupSchema),
    }
  )
  get getFormControl() {
    return this.formGroup.controls
  }
  // @ts-ignore
  private createValidatorFromSchema(schema): ValidatorFn {
    // @ts-ignore
    const validator: ValidatorFn = (group: FormGroup) => {
      // This is where the validation on the values of
      // the form group is run.
      const result = schema.validate(group.value)

      if (result.error) {
        const errorObj = result.error.details.reduce(
          (
            acc: Record<string, any>,
            current: { path: string[]; message: string }
          ) => {
            const key = current.path.join('.')
            acc[key] = current.message
            return acc
          },
          {}
        )

        // Set error value on each control
        for (const key in errorObj) {
          const control = group.get(key)
          if (control) {
            control.setErrors({ [key]: errorObj[key] })
          }
        }

        // Return the error object so that we can access
        // the form’s errors via `form.errors`.
        return errorObj
      } else {
        return null
      }
    }

    return validator
  }

  getError(
    formControlName: string,
    options = { checkPristine: false }
  ): string | undefined {
    let preflight

    if (options.checkPristine) {
      preflight = true
    } else {
      preflight = !this.formGroup.get(formControlName)?.pristine
    }

    if (preflight && this.formGroup.errors) {
      return this.formGroup.errors[formControlName]
    }
    return
  }

  onSubmit(): void {
    // when action is edit
    if (this.productToEdit !== undefined && this.productToEdit.id) {
      this.productsService.edit(this.formGroup.value as IProduct).subscribe({
        next: (product) => {
          this.editProdct(product)
          this.showModal = false
          this.formGroup.reset()
        },
        error: (err) => console.log(err),
      })
    } else {
      // when action is create
      this.productsService.create(this.formGroup.value as IProduct).subscribe({
        next: (product) => {
          this.addNewProduct(product)
          this.showModal = false
          this.formGroup.reset()
        },
        error: (err) => console.log(err),
      })
    }
  }

  ngOnChanges(changes: any) {
    this.formGroup.reset()
    if (this.productToEdit !== undefined) {
      this.formGroup.patchValue({ ...changes.productToEdit.currentValue })
    }
  }
}
