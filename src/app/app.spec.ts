import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { signal } from "@angular/core";
import { App } from "./app";
import { AuthService } from "../services/auth";
import { BackendInfoService } from "../services/backend-info";

describe("App", () => {
	const authStub = {
		isAuthenticated: signal(false),
		signOut: async () => undefined,
	};
	const backendInfoStub = {
		backendVersion: signal("1.2.3"),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [App],
			providers: [
				provideRouter([]),
				{ provide: AuthService, useValue: authStub },
				{ provide: BackendInfoService, useValue: backendInfoStub },
			],
		}).compileComponents();
	});

	it("should create the app", () => {
		const fixture = TestBed.createComponent(App);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it("should render the app and backend versions", () => {
		const fixture = TestBed.createComponent(App);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector(".version")?.textContent).toContain(
			"FE v",
		);
		expect(compiled.querySelector(".version")?.textContent).toContain(
			"BE v1.2.3",
		);
	});
});
