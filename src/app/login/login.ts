import { Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {

  hide = true
  loading = false
  private snackBar = inject(MatSnackBar);

  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  async emailLogin() {
    this.loading = true
    var email = this.form.value.email;
    if (!email) { email = '' }
    var password = this.form.value.password;
    if (!password) { password = '' }
    const { error } = await this.auth.signInEmail(email, password);
    if (error) {
      this.snackBar.open(error.message, "Close", {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['warn-snackbar']
      });
    } else {
      this.done();
    }
    this.loading = false
  }

  private done() {
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/home';
    this.router.navigateByUrl(redirectTo);
  }

  logout() {
    this.auth.signOut();
  }

}
