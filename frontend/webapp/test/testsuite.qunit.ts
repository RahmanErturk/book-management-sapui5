export default {
	name: "QUnit test suite for the UI5 Application: buecherverwaltung.app",
	defaults: {
		page: "ui5://test-resources/buecherverwaltung/app/Test.qunit.html?testsuite={suite}&test={name}",
		qunit: {
			version: 2
		},
		sinon: {
			version: 4
		},
		ui5: {
			language: "EN",
			theme: "sap_horizon"
		},
		coverage: {
			only: "buecherverwaltung/app/",
			never: "test-resources/buecherverwaltung/app/"
		},
		loader: {
			paths: {
				"buecherverwaltung/app": "../"
			}
		}
	},
	tests: {
		"unit/unitTests": {
			title: "Unit tests for buecherverwaltung.app"
		},
		"integration/opaTests": {
			title: "Integration tests for buecherverwaltung.app"
		}
	}
};
