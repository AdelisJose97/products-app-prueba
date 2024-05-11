import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { apiUrl, handleError } from '../utils'
import { IProduct } from './interface'

export type ProductsResponse = IProduct[]

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<ProductsResponse>(`${apiUrl}/products`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .pipe(
        catchError(handleError) // then handle the error
      )
  }

  create(productToCreate: IProduct) {
    return this.http
      .post<IProduct>(
        `${apiUrl}/products`,
        {
          ...productToCreate,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .pipe(
        catchError(handleError) // then handle the error
      )
  }

  edit(productToEdit: IProduct) {
    return this.http
      .put<IProduct>(
        `${apiUrl}/products/${productToEdit?.id}`,
        {
          ...productToEdit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .pipe(
        catchError(handleError) // then handle the error
      )
  }
  delete(productToDelete: IProduct) {
    return this.http
      .delete<IProduct>(`${apiUrl}/products/${productToDelete?.id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .pipe(
        catchError(handleError) // then handle the error
      )
  }
}
