import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../services/auth";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import portalPackage from "../../package.json";
import { BackendInfoService } from "../services/backend-info";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	private router = inject(Router);
	public auth = inject(AuthService);
	private backendInfo = inject(BackendInfoService);
	public appVersion = portalPackage.version;
	public backendVersion = this.backendInfo.backendVersion;

	async logout() {
		this.auth.signOut();
		this.router.navigateByUrl("/login");
	}

	login() {
		this.router.navigateByUrl("/login");
	}

	register() {
		this.router.navigateByUrl("/register");
	}
}
