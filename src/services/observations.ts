import { Injectable } from "@angular/core";
import { Validators } from "@angular/forms";
import { inject, signal, effect } from "@angular/core";
import {
	observationBodyDTO,
	ObservationCreateDTO,
	observationSubmissionDTO,
} from "../app/home/control-panel/dtos/control-panel.dto";
import {
	BANDWIDTH_VALUES,
	CENTRAL_FREQUENCY_VALUES,
	OBSERVATION_CREATE_DEFAULTS,
	OBSERVATION_TYPE_VALUES,
	REFERENCE_FRAME_VALUES,
} from "../api/backend-openapi.runtime";
import { AuthService } from "./auth";

type FieldType = "text" | "select" | "checkbox";
type FieldDataType = "string" | "number" | "boolean" | "datetime";
type FieldInputType = "text" | "number" | "email" | "datetime-local";

export interface ObservationFieldConfig {
	title: string;
	alias: string;
	type: FieldType;
	placeholder?: string;
	defaultValue?: string | number | boolean | null;
	values?: Array<string | number | boolean>;
	validators: unknown[];
	payloadKey?: keyof ObservationCreateDTO;
	dataType?: FieldDataType;
	inputType?: FieldInputType;
}

@Injectable({
	providedIn: "root",
})
export class ObservationsService {
	private auth = inject(AuthService);
	private loaded = false;
	private loading = false;
	private loadedScope: string | null = null;
	private readonly historyRefreshMs = Number(
		import.meta.env["NG_APP_OBSERVATION_HISTORY_REFRESH_MS"] ?? 30000,
	);
	private historyRefreshTimer: ReturnType<typeof setInterval> | null = null;
	private backendBaseUrl = (
		import.meta.env["NG_APP_BACKEND_URL"] || ""
	).replace(/\/$/, "");
	private observationsUrl = `${this.backendBaseUrl}/v1/observations/`;
	private submitUrl = this.observationsUrl;
	private historyUrl = this.observationsUrl;
	readonly guestHistoryDebugEnabled =
		String(
			import.meta.env["NG_APP_DEBUG_GUEST_HISTORY"] ?? "false",
		).toLowerCase() === "true";

	constructor() {
		if (!import.meta.env["NG_APP_BACKEND_URL"]) {
			throw new Error("NG_APP_BACKEND_URL is not set");
		}

		// Keep history in sync with auth transitions.
		this.auth.supabase.auth.onAuthStateChange((event, _session) => {
			if (event === "SIGNED_IN") {
				this.loaded = false;
				this.loadedScope = null;
				this.deleteHistoryInstance();
				void this.loadHistoryFromBackend(true);
			}

			if (event === "SIGNED_OUT") {
				this.deleteHistoryInstance();
				this.loaded = false;
				this.loadedScope = null;
				if (this.guestHistoryDebugEnabled) {
					void this.loadHistoryFromBackend(true);
				}
			}
		});

		// Wait for session to be loaded before attempting to load history
		// This prevents race conditions where the token isn't available yet
		effect(() => {
			if (this.auth.sessionLoaded()) {
				void this.loadHistoryFromBackend();
			}
		});

		this.startHistoryAutoRefresh();
	}

	observation_fields: ObservationFieldConfig[] = [
		{
			title: "targetName",
			alias: "Target Name",
			type: "text",
			placeholder: "Enter target name...",
			validators: [],
			payloadKey: "target_name",
			dataType: "string",
			inputType: "text",
		},
		{
			title: "observationType",
			alias: "Observation Type",
			type: "select",
			defaultValue: (OBSERVATION_CREATE_DEFAULTS.observation_type ??
				"TARGET_OBSERVATION") as ObservationCreateDTO["observation_type"],
			values: [...OBSERVATION_TYPE_VALUES] as Array<
				ObservationCreateDTO["observation_type"]
			>,
			validators: [Validators.required],
			payloadKey: "observation_type",
			dataType: "string",
		},
		{
			title: "velocityFrame",
			alias: "Velocity Frame",
			type: "select",
			defaultValue: (OBSERVATION_CREATE_DEFAULTS.velocity_frame ??
				"LSRK") as ObservationCreateDTO["velocity_frame"],
			values: [...REFERENCE_FRAME_VALUES] as Array<
				ObservationCreateDTO["velocity_frame"]
			>,
			validators: [Validators.required],
			payloadKey: "velocity_frame",
			dataType: "string",
		},
		{
			title: "bandwidth",
			alias: "Bandwidth (MHz)",
			type: "select",
			defaultValue: (OBSERVATION_CREATE_DEFAULTS.bandwidth ??
				1.5) as ObservationCreateDTO["bandwidth"],
			values: [...BANDWIDTH_VALUES] as Array<
				ObservationCreateDTO["bandwidth"]
			>,
			validators: [Validators.required],
			payloadKey: "bandwidth",
			dataType: "number",
		},
		{
			title: "cFreq",
			alias: "Center Frequency (MHz)",
			type: "select",
			defaultValue: (OBSERVATION_CREATE_DEFAULTS.center_frequency ??
				1420) as ObservationCreateDTO["center_frequency"],
			values: [...CENTRAL_FREQUENCY_VALUES] as Array<
				ObservationCreateDTO["center_frequency"]
			>,
			validators: [Validators.required],
			payloadKey: "center_frequency",
			dataType: "number",
		},
		{
			title: "fftSize",
			alias: "FFT Size",
			type: "text",
			defaultValue: OBSERVATION_CREATE_DEFAULTS.fft_size ?? 1024,
			validators: [
				Validators.required,
				Validators.min(64),
				Validators.max(32768),
			],
			payloadKey: "fft_size",
			dataType: "number",
			inputType: "number",
		},
		{
			title: "ra",
			alias: "RA",
			type: "text",
			defaultValue: 0,
			validators: [
				Validators.required,
				Validators.min(0),
				Validators.max(359.999999),
			],
			payloadKey: "ra",
			dataType: "number",
			inputType: "number",
		},
		{
			title: "dec",
			alias: "DEC",
			type: "text",
			defaultValue: 0,
			validators: [
				Validators.required,
				Validators.min(-90),
				Validators.max(90),
			],
			payloadKey: "dec",
			dataType: "number",
			inputType: "number",
		},
		{
			title: "integrationTime",
			alias: "Integration Time (seconds)",
			type: "text",
			defaultValue: 600,
			placeholder: "Enter integration time in seconds...",
			validators: [
				Validators.required,
				Validators.min(1),
				Validators.max(86400),
			],
			payloadKey: "integration_time",
			dataType: "number",
			inputType: "number",
		},
		{
			title: "plannedStart",
			alias: "Planned Start (optional)",
			type: "text",
			defaultValue: "",
			validators: [],
			payloadKey: "planned_start",
			dataType: "datetime",
			inputType: "datetime-local",
		},
		{
			title: "receiveCsv",
			alias: "Receive CSV",
			type: "checkbox",
			defaultValue: OBSERVATION_CREATE_DEFAULTS.receive_csv ?? false,
			validators: [],
			payloadKey: "receive_csv",
			dataType: "boolean",
		},
		{
			title: "performDataAnalysis",
			alias: "Perform Data Analysis",
			type: "checkbox",
			defaultValue:
				OBSERVATION_CREATE_DEFAULTS.perform_data_analysis ?? true,
			validators: [],
			payloadKey: "perform_data_analysis",
			dataType: "boolean",
		},
		{
			title: "prefEmail",
			alias: "Preferred Email",
			type: "text",
			defaultValue: "",
			validators: [Validators.required, Validators.email],
			inputType: "email",
		},
	];

	readonly history = signal<observationSubmissionDTO[] | []>([]);

	deleteHistoryInstance() {
		this.history.update(() => {
			return [];
		});
	}

	private startHistoryAutoRefresh() {
		if (
			this.historyRefreshTimer ||
			!Number.isFinite(this.historyRefreshMs) ||
			this.historyRefreshMs <= 0
		) {
			return;
		}

		this.historyRefreshTimer = setInterval(() => {
			void this.loadHistoryFromBackend(true);
		}, this.historyRefreshMs);
	}

	async submitObservation(reqBody: observationBodyDTO, accessToken?: string) {
		if (!this.submitUrl) {
			throw new Error(
				"Submission URL is not configured. Please set NG_APP_BACKEND_URL environment variable.",
			);
		}
		return fetch(this.submitUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(accessToken
					? { Authorization: `Bearer ${accessToken}` }
					: {}),
			},
			body: JSON.stringify(reqBody),
		});
	}

	async loadHistoryFromBackend(forceReload = false) {
		const userId = this.auth.getCurrentUserId();
		const currentScope = userId
			? `user:${userId}`
			: this.guestHistoryDebugEnabled
				? "guest"
				: null;

		if (!currentScope) {
			return;
		}

		if (!this.historyUrl) {
			// Observation list endpoint is optional until backend connectivity is configured.
			return;
		}

		if (
			!forceReload &&
			(this.loading || (this.loaded && this.loadedScope === currentScope))
		) {
			return;
		}

		try {
			this.loading = true;
			const accessToken = this.auth.getAccessToken();
			const res = await fetch(this.historyUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...(accessToken
						? { Authorization: `Bearer ${accessToken}` }
						: {}),
				},
			});

			if (!res.ok) {
				console.error(
					`Failed to fetch observation history: ${res.status}`,
				);
				return;
			}

			const payload = await res.json();
			const items = Array.isArray(payload)
				? payload
				: Array.isArray(payload?.data)
					? payload.data
					: [];

			// If auth context changed while awaiting network, do not commit stale results.
			const latestUserId = this.auth.getCurrentUserId();
			const latestScope = latestUserId
				? `user:${latestUserId}`
				: this.guestHistoryDebugEnabled
					? "guest"
					: null;
			if (latestScope !== currentScope) {
				return;
			}

			this.history.update(() => items as observationSubmissionDTO[]);
			this.loaded = true;
			this.loadedScope = currentScope;
		} catch (error) {
			console.error(
				"Failed to load observation history from backend",
				error,
			);
		} finally {
			this.loading = false;
		}
	}
}
