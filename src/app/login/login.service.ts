import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs'
import { apiUrl, handleError } from '../utils'
import { LoginResponse } from './interface'

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  login(userName: string, password: string) {
    return this.http
      .post<LoginResponse>(
        `${apiUrl}/auth/login`,
        {
          userName,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        catchError(handleError) // then handle the error
      )
  }
}
