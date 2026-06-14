import { Component, effect, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { ObservationsService } from "../../../services/observations";
import { AuthService } from "../../../services/auth";
import { observationSubmissionDTO } from "../control-panel/dtos/control-panel.dto";

interface ObservationFieldRow {
	key: string;
	label: string;
	value: string;
	isUrl: boolean;
}

@Component({
	selector: "app-observation-history",
	imports: [MatCardModule, MatDividerModule, MatExpansionModule],
	templateUrl: "./observation-history.html",
	styleUrl: "./observation-history.scss",
})
export class ObservationHistory {
	private readonly excludedFieldKeys = new Set([
		"user_id",
		"id",
		"output_filename",
	]);

	private readonly labelOverrides: Record<string, string> = {
		ra: "RA",
		dec: "DEC",
		fft_size: "FFT Size",
		csv_download_url: "CSV Download URL",
		data_download_url: "Data Download URL",
		analysis_results_url: "Analysis Results URL",
	};

	private obsService = inject(ObservationsService);
	private authService = inject(AuthService);
	private expandedObservationKeys = new Set<string>();
	observationSubmissions = this.obsService.history;
	isAuthenticated = this.authService.isAuthenticated;
	sessionLoaded = this.authService.sessionLoaded;
	isGuestDebugHistoryEnabled = this.obsService.guestHistoryDebugEnabled;

	constructor() {
		effect(() => {
			const currentObservationKeys = new Set(
				this.observationSubmissions().map((submission) =>
					this.getObservationTrackKey(submission),
				),
			);

			for (const expandedKey of Array.from(
				this.expandedObservationKeys,
			)) {
				if (!currentObservationKeys.has(expandedKey)) {
					this.expandedObservationKeys.delete(expandedKey);
				}
			}
		});
	}

	getObservationTrackKey(pastSubmission: observationSubmissionDTO): string {
		if (pastSubmission.id != null) {
			return `obs-${pastSubmission.id}`;
		}

		const target = pastSubmission.target_name ?? "untitled";
		return `obs-${target}-${pastSubmission.created_on}-${pastSubmission.ra}-${pastSubmission.dec}`;
	}

	isObservationExpanded(pastSubmission: observationSubmissionDTO): boolean {
		return this.expandedObservationKeys.has(
			this.getObservationTrackKey(pastSubmission),
		);
	}

	setObservationExpanded(
		pastSubmission: observationSubmissionDTO,
		expanded: boolean,
	): void {
		const key = this.getObservationTrackKey(pastSubmission);
		if (expanded) {
			this.expandedObservationKeys.add(key);
			return;
		}

		this.expandedObservationKeys.delete(key);
	}

	getNonNullFieldRows(
		pastSubmission: observationSubmissionDTO,
	): ObservationFieldRow[] {
		return Object.entries(pastSubmission)
			.filter(
				([key, value]) =>
					!this.excludedFieldKeys.has(key) &&
					value !== null &&
					value !== undefined,
			)
			.map(([key, value]) => {
				const valueString =
					typeof value === "boolean"
						? value
							? "Yes"
							: "No"
						: String(value);

				return {
					key,
					label: this.formatFieldLabel(key),
					value: valueString,
					isUrl: this.isUrlValue(valueString),
				};
			});
	}

	private formatFieldLabel(fieldKey: string): string {
		if (this.labelOverrides[fieldKey]) {
			return this.labelOverrides[fieldKey];
		}

		return fieldKey
			.split("_")
			.filter((part) => part.length > 0)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" ");
	}

	private isUrlValue(value: string): boolean {
		return /^https?:\/\//i.test(value);
	}
}
