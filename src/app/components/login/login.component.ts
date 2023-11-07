import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  signInSuccess = false;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async signIn() {
    this.spinner.show();
    console.log('Use rsigned In ', this.email, this.password);
    const result = await this.authService.signInUserWithEmailAndPassword(
      this.email,
      this.password
    );
    this.spinner.hide();
    if (result) {
      this.signInSuccess = true;
      this.router.navigateByUrl('/workspace', { replaceUrl: true });
    } else {
      alert('Could not sign in');
    }
  }
}
