import { Component, inject } from "@angular/core";
import { formatDate } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_SELECT_SCROLL_STRATEGY } from "@angular/material/select";
import { Overlay } from "@angular/cdk/overlay";
import {
	ObservationFieldConfig,
	ObservationsService,
} from "../../../services/observations";
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
		MatCheckboxModule,
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
	private observationsService = inject(ObservationsService);
	private fb = inject(FormBuilder);
	public auth = inject(AuthService);
	private snackBar = inject(MatSnackBar);

	public fields;
	public form;

	constructor() {
		this.fields = this.observationsService.observation_fields;
		let controls: any = {};
		for (let field of this.fields) {
			controls[field.title] = [field.defaultValue, field.validators];
		}
		this.form = this.fb.group(controls);
	}

	formatSelectLabel(
		fieldTitle: string,
		value: string | number | boolean,
	): string {
		if (fieldTitle === "observationType" && typeof value === "string") {
			return value
				.split("_")
				.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
				.join(" ");
		}

		return String(value);
	}

	getInputType(field: ObservationFieldConfig): string {
		if (field.inputType) {
			return field.inputType;
		}

		if (field.dataType === "number") {
			return "number";
		}

		return "text";
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
					(acc as any)[field.payloadKey] =
						rawValue === "" || rawValue == null
							? null
							: Number(rawValue);
					return acc;
				}

				if (field.dataType === "boolean") {
					(acc as any)[field.payloadKey] = Boolean(rawValue);
					return acc;
				}

				if (field.dataType === "datetime") {
					const value = String(rawValue ?? "").trim();
					(acc as any)[field.payloadKey] = value
						? new Date(value).toISOString()
						: null;
					return acc;
				}

				const value = String(rawValue ?? "").trim();
				(acc as any)[field.payloadKey] =
					field.payloadKey === "target_name" && value.length === 0
						? null
						: value;

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

		try {
			const res = await this.observationsService.submitObservation(
				reqBody,
				session?.access_token,
			);

			if (!res.ok) {
				this.snackBar.open(`Request failed: ${res.status}`, "Close", {
					duration: 5000,
					horizontalPosition: "center",
					verticalPosition: "bottom",
					panelClass: ["error-snackbar"],
				});
				return;
			}

			// Keep UI as backend source-of-truth by reloading history after successful submission.
			void this.observationsService.loadHistoryFromBackend(true);

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

		const userEmail = this.auth.user()?.email;
		if (userEmail) {
			this.form.patchValue({ prefEmail: userEmail });
		}
	}
}
