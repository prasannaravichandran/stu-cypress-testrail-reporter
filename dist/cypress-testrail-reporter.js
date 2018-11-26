"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const moment = require("moment");
const testrail_1 = require("./testrail");
const shared_1 = require("./shared");
const testrail_interface_1 = require("./testrail.interface");
const chalk = require('chalk');
class CypressTestRailReporter extends mocha_1.reporters.Spec {
    constructor(runner, options) {
        super(runner);
        this.results = [];
        let reporterOptions = options.reporterOptions;
        this.testRail = new testrail_1.TestRail(reporterOptions);
        this.validate(reporterOptions, 'domain');
        this.validate(reporterOptions, 'username');
        this.validate(reporterOptions, 'password');
        this.validate(reporterOptions, 'projectId');
        this.validate(reporterOptions, 'suiteId');
        this.validate(reporterOptions, 'runId');
        runner.on('start', () => {
            const executionDateTime = moment().format('MMM Do YYYY, HH:mm (Z)');
            const name = `${reporterOptions.runName || 'Automated test run'} ${executionDateTime}`;
            const description = 'For the Cypress run visit https://dashboard.cypress.io/#/projects/runs';
            this.testRail.createRun(name, description);
        });
        runner.on('pass', test => {
            const caseIds = shared_1.titleToCaseIds(test.title);
            if (caseIds.length > 0) {
                const results = caseIds.map(caseId => {
                    return {
                        case_id: caseId,
                        status_id: testrail_interface_1.Status.Passed,
                        comment: `Execution time: ${test.duration}ms`,
                    };
                });
                this.results.push(...results);
            }
        });
        runner.on('fail', test => {
            const caseIds = shared_1.titleToCaseIds(test.title);
            if (caseIds.length > 0) {
                const results = caseIds.map(caseId => {
                    return {
                        case_id: caseId,
                        status_id: testrail_interface_1.Status.Failed,
                        comment: `${test.err.message}`,
                    };
                });
                this.results.push(...results);
            }
        });
        runner.on('end', () => {
            if (this.results.length == 0) {
                console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
                console.warn('\n', 'No testcases were matched. Ensure that your tests are declared correctly and matches Cxxx', '\n');
                this.testRail.deleteRun();
                return;
            }
            this.testRail.publishResults(this.results);
        });
    }
    validate(options, name) {
        if (options == null) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        if (options[name] == null) {
            throw new Error(`Missing ${name} value. Please update reporterOptions in cypress.json`);
        }
    }
}
exports.CypressTestRailReporter = CypressTestRailReporter;
//# sourceMappingURL=cypress-testrail-reporter.js.map