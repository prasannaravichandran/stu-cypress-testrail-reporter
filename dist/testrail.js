"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const chalk = require('chalk');
class TestRail {
    constructor(options) {
        this.options = options;
        this.base = `https://${options.domain}/index.php?/api/v2`;
    }
    createRun(name, description) {
        axios({
            method: 'post',
            url: `${this.base}/add_run/${this.options.projectId}`,
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
            data: JSON.stringify({
                suite_id: this.options.suiteId,
                name,
                description,
                include_all: true,
            }),
        })
            .then(response => {
            this.runId = response.data.id;
        })
            .catch(error => console.error(error));
    }
    updateRun(name, description) {
        axios({
            method: 'post',
            url: `${this.base}/update_run/${this.options.runId}`,
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
            data: JSON.stringify({
                suite_id: this.options.suiteId,
                name,
                description,
                include_all: true,
            }),
        })
            .then(response => {
            this.runId = response.data.id;
        })
            .catch(error => console.error(error));
    }
    deleteRun() {
        axios({
            method: 'post',
            url: `${this.base}/delete_run/${this.runId}`,
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
        }).catch(error => console.error(error));
    }
    publishResults(results) {
        axios({
            method: 'post',
            url: `${this.base}/add_results_for_cases/${this.runId}`,
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: this.options.username,
                password: this.options.password,
            },
            data: JSON.stringify({ results }),
        })
            .then(response => {
            console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
            console.log('\n', ` - Results are published to ${chalk.magenta(`https://${this.options.domain}/index.php?/runs/view/${this.runId}`)}`, '\n');
        })
            .catch(error => console.error(error));
    }
}
exports.TestRail = TestRail;
//# sourceMappingURL=testrail.js.map