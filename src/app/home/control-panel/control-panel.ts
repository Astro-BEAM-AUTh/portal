import { Component, inject } from "@angular/core";
import { formatDate } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_SELECT_SCROLL_STRATEGY } from "@angular/material/select";
import { Overlay } from "@angular/cdk/overlay";
import { ObservationsService } from "../../../services/observations";
import {
	observationBodyDTO,
	ObservationCreateDTO,
} from "./dtos/control-panel.dto";
import { AuthService } from "../../../services/auth";

@Component({
	selector: "app-control-panel",
	imports: [
		MatCardModule,
		MatDividerModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatSnackBarModule,
	],
	templateUrl: "./control-panel.html",
	styleUrl: "./control-panel.scss",
	providers: [
		{
			provide: MAT_SELECT_SCROLL_STRATEGY,
			useFactory: (overlay: Overlay) => () =>
				overlay.scrollStrategies.noop(),
			deps: [Overlay],
		},
	],
})
export class ControlPanel {
	private ObservationsService = inject(ObservationsService);
	private fb = inject(FormBuilder);
	public auth = inject(AuthService);
	private snackBar = inject(MatSnackBar);

	public fields;
	public form;

	constructor() {
		this.fields = this.ObservationsService.observation_fields;
		let controls: any = {};
		for (let field of this.fields) {
			controls[field.title] = [field.defaultValue, field.validators];
		}
		this.form = this.fb.group(controls);
	}

	formatSelectLabel(fieldTitle: string, value: string | number): string {
		if (fieldTitle === "observationType" && typeof value === "string") {
			return value
				.split("_")
				.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
				.join(" ");
		}

		return String(value);
	}

	async run() {
		const user = this.auth.user();
		const session = this.auth.session();

		const formValue = this.form.value as Record<string, unknown>;

		const observationData = this.fields.reduce(
			(acc: Partial<ObservationCreateDTO>, field: any) => {
				if (!field.payloadKey) {
					return acc;
				}

				const rawValue = formValue[field.title];
				if (field.dataType === "number") {
					(acc as any)[field.payloadKey] = Number(rawValue ?? 0);
				} else {
					(acc as any)[field.payloadKey] = String(rawValue ?? "");
				}

				return acc;
			},
			{} as Partial<ObservationCreateDTO>,
		);

		observationData.output_filename =
			"Observation_" +
			formatDate(Date.now(), "yyyy-MM-dd-HH-mm-ss", "en-US");

		let reqBody: observationBodyDTO;
		if (user) {
			reqBody = {
				observation: observationData as ObservationCreateDTO,
			};
		} else {
			const preferredEmail = String(
				this.form.value["prefEmail"] || "guest@astrobeam.gr",
			);
			const guestId = `guest_${preferredEmail.toLowerCase()}`;
			reqBody = {
				observation: observationData as ObservationCreateDTO,
				requestor: {
					email: preferredEmail,
					username: preferredEmail.split("@")[0] || guestId,
					user_id: guestId,
					auth_provider: "guest",
				},
			};
		}

		const pendingSubmission = {
			...reqBody.observation,
			observation_id: "pending_local",
			user_id: -1,
			status: "pending" as const,
			submitted_at: new Date().toISOString(),
			completed_at: null,
		};

		// Guests can submit but should keep an empty local history.
		if (user) {
			this.ObservationsService.addSubmission(pendingSubmission);
		}

		try {
			const res = await this.ObservationsService.submitObservation(
				reqBody,
				session?.access_token,
			);

			if (!res.ok) {
				if (user) {
					this.ObservationsService.updateSubmissionStatus(
						pendingSubmission,
						"failed",
					);
				}
				this.snackBar.open(`Request failed: ${res.status}`, "Close", {
					duration: 5000,
					horizontalPosition: "center",
					verticalPosition: "bottom",
					panelClass: ["error-snackbar"],
				});
				return;
			}

			// Submission is accepted by backend and remains pending until backend processing updates it.
			if (user) {
				this.ObservationsService.updateSubmissionStatus(
					pendingSubmission,
					"pending",
				);
			}

			this.snackBar.open(
				"Observation submitted and accepted for processing.",
				"Close",
				{
					duration: 5000,
					horizontalPosition: "center",
					verticalPosition: "bottom",
					panelClass: ["success-snackbar"],
				},
			);
		} catch (e) {
			// error handling
			if (user) {
				this.ObservationsService.updateSubmissionStatus(
					pendingSubmission,
					"failed",
				);
			}
			console.error(e);
			this.snackBar.open(`Error submitting request.`, "Close", {
				duration: 5000,
				horizontalPosition: "center",
				verticalPosition: "bottom",
				panelClass: ["error-snackbar"],
			});
		}
	}

	async ngOnInit() {
		while (!this.auth.sessionLoaded()) {
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}
}
