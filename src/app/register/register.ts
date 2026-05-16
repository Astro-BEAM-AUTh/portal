import { Component, inject, signal } from "@angular/core";

import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-register",
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
	],
	templateUrl: "./register.html",
	styleUrl: "./register.scss",
})
export class Register {
	hide = true;
	loading = false;
	private snackBar = inject(MatSnackBar);

	private fb = inject(FormBuilder);

	passwordsMatchValidator(formGroup: FormGroup) {
		const password = formGroup.get("password")?.value;
		const confirmPassword = formGroup.get("confirmPassword")?.value;
		return password === confirmPassword
			? null
			: { passwordsMismatch: true };
	}

	form = this.fb.group(
		{
			email: ["", [Validators.required, Validators.email]],
			password: [
				"",
				[
					Validators.required,
					Validators.minLength(8),
					Validators.pattern(
						"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$",
					),
				],
			],
			confirmPassword: ["", Validators.required],
		},
		{ validators: this.passwordsMatchValidator },
	);

	private auth = inject(AuthService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);

	async emailRegister() {
		this.loading = true;
		var email = this.form.value.email;
		if (!email) {
			email = "";
		}
		var password = this.form.value.password;
		if (!password) {
			password = "";
		}
		const { error } = await this.auth.register(email, password);
		if (error) {
			this.snackBar.open(error.message, "Close", {
				duration: 3000,
				horizontalPosition: "center",
				verticalPosition: "bottom",
				panelClass: ["warn-snackbar"],
			});
		} else {
			this.done();
		}
		this.loading = false;
	}

	guestLogin() {
		this.done();
	}

	private done() {
		const redirectTo =
			this.route.snapshot.queryParamMap.get("redirectTo") || "";
		this.router.navigateByUrl(redirectTo);
	}

	logout() {
		this.auth.signOut();
	}
}
