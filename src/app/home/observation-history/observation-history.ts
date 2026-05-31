import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { ObservationsService } from "../../../services/observations";
import { AuthService } from "../../../services/auth";

@Component({
	selector: "app-observation-history",
	imports: [MatCardModule, MatDividerModule, MatExpansionModule],
	templateUrl: "./observation-history.html",
	styleUrl: "./observation-history.scss",
})
export class ObservationHistory {
	private obsService = inject(ObservationsService);
	private authService = inject(AuthService);
	observationSubmissions = this.obsService.history;
	isAuthenticated = this.authService.isAuthenticated;
	sessionLoaded = this.authService.sessionLoaded;
	isGuestDebugHistoryEnabled = this.obsService.guestHistoryDebugEnabled;

	constructor() {}
}
