import { Input, Component } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { LoginService } from './login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService],
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) {}
  form: FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  })

  onSubmit() {
    if (this.form.valid) {
      this.loginService
        .login(
          this.form.get('userName')?.value,
          this.form.get('password')?.value
        )
        .subscribe((response) => {
          const { access_token } = response
          localStorage.setItem('access_token', access_token)
          this.router.navigate(['/products'])
        })
    }
  }
}
