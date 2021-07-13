"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var github = __importStar(require("@actions/github"));
var core_1 = require("@octokit/core");
var fileChecks_1 = require("./fileChecks");
var branchPermissionCheck_1 = require("./branchPermissionCheck");
var vulnerabilityBotCheck_1 = require("./vulnerabilityBotCheck");
var issueTemplateCheck_1 = require("./issueTemplateCheck");
var standardLabelsCheck_1 = require("./standardLabelsCheck");
function main() {
    var secret_token = core.getInput('GITHUB_TOKEN');
    var octokit = new core_1.Octokit({
        auth: secret_token,
    });
    var repositories = core.getInput('repositories');
    var repositories_list = repositories.split(',');
    var ownername = github.context.repo.owner;
    var repository = '';
    var validationResult = [];
    for (var i = 0; i < repositories_list.length; i++) {
        repository = repositories_list[i];
        var validationResultRepo = new Map([["repoName", repository],
            ["readmeChecks", "unknown"],
            ["codeOwnerCheck", "unknown"],
            ["nodeModulesCheck", "unknown"],
            ["branchPermissionCheck", "unknown"],
            ["releasesNodeModulesCheck", "unknown"],
            ["vulnerabilityBotCheck", "unknown"],
            ["issueTemplateCheck", "unknown"],
            ["standardLabelsCheck", "unknown"]
        ]);
        console.log('*******' + repository + '*******');
        //Check for example and Contribution in README
        validationResultRepo = Promise.resolve(fileChecks_1.readmeChecks(repository, validationResultRepo, ownername, secret_token, octokit));
        //Check for CODEOWNERS file in .github folder
        fileChecks_1.codeOwnerCheck(repository, ownername, secret_token, octokit);
        //Check if nodemodules folder is present in master branch for typescript action
        fileChecks_1.nodeModulesCheck(repository, ownername, secret_token, octokit);
        //check for branch permissions in main/master and releases/*
        branchPermissionCheck_1.branchPermissionCheck(repository, ownername, secret_token, octokit);
        //check for nodemodules folder in releases/*
        fileChecks_1.releasesNodeModulesCheck(repository, ownername, secret_token, octokit);
        //check for security/vulnerability bot
        vulnerabilityBotCheck_1.vulnerabilityBotCheck(repository, ownername, secret_token, octokit);
        //1. check whether issue-template has been set up and 2. default label is need-to-triage
        issueTemplateCheck_1.issueTemplateCheck(repository, ownername, secret_token, octokit);
        //Check whether standard labels have been set up
        standardLabelsCheck_1.standardLabelsCheck(repository, ownername, secret_token, octokit);
        validationResult.push(validationResultRepo);
    }
    console.log(Promise.resolve(validationResult));
}
main();
