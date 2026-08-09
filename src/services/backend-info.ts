import { Injectable, signal } from "@angular/core";

interface BackendVersionResponse {
	version?: string;
}

@Injectable({
	providedIn: "root",
})
export class BackendInfoService {
	private readonly backendBaseUrl = (
		import.meta.env["NG_APP_BACKEND_URL"] || ""
	).replace(/\/$/, "");
	readonly backendVersion = signal("loading...");

	constructor() {
		void this.loadBackendVersion();
	}

	private async loadBackendVersion() {
		if (!this.backendBaseUrl) {
			this.backendVersion.set("unavailable");
			return;
		}

		try {
			const response = await fetch(
				`${this.backendBaseUrl}/v1/web/version/`,
				{
					headers: {
						Accept: "application/json",
					},
					cache: "no-store",
				},
			);

			if (!response.ok) {
				throw new Error(
					`Backend version request failed with ${response.status}`,
				);
			}

			const data = (await response.json()) as BackendVersionResponse;
			this.backendVersion.set(data.version?.trim() || "unknown");
		} catch (error) {
			console.warn("Failed to load backend version", error);
			this.backendVersion.set("unavailable");
		}
	}
}
