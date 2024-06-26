import { HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs'
import { Router } from '@angular/router'

export function handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error)
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    if (error.status === 401) {
      localStorage.removeItem('access_token')
    }
    console.error(
      `Backend returned code ${error.status}, body was: `,
      error.error
    )
  }
  // Return an observable with a user-facing error message.
  return throwError(
    () => new Error('Something bad happened; please try again later.')
  )
}

export const apiUrl = 'http://localhost:3000'
