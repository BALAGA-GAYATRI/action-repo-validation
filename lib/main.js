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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    return __awaiter(this, void 0, void 0, function () {
        var secret_token, octokit, repositories, repositories_list, ownername, repository, validationResult, i, validationResultRepo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secret_token = core.getInput('GITHUB_TOKEN');
                    octokit = new core_1.Octokit({
                        auth: secret_token,
                    });
                    repositories = core.getInput('repositories');
                    repositories_list = repositories.split(',');
                    ownername = github.context.repo.owner;
                    repository = '';
                    validationResult = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < repositories_list.length)) return [3 /*break*/, 11];
                    repository = repositories_list[i];
                    validationResultRepo = { "repoName": repository,
                        "readmeChecks": "unknown",
                        "codeOwnerCheck": "unknown",
                        "nodeModulesCheck": "unknown",
                        "branchPermissionCheck": "unknown",
                        "releasesNodeModulesCheck": "unknown",
                        "vulnerabilityBotCheck": "unknown",
                        "issueTemplateCheck": "unknown",
                        "standardLabelsCheck": "unknown"
                    };
                    // new Map([["repoName",repository], 
                    // 	["readmeChecks","unknown"] ,
                    // 	["codeOwnerCheck","unknown"], 
                    // 	["nodeModulesCheck","unknown"], 
                    // 	["branchPermissionCheck","unknown"],
                    // 	["releasesNodeModulesCheck","unknown"],
                    // 	["vulnerabilityBotCheck","unknown"],
                    // 	["issueTemplateCheck","unknown"],
                    // 	["standardLabelsCheck","unknown"]
                    // ]);
                    console.log('*******' + repository + '*******');
                    return [4 /*yield*/, fileChecks_1.readmeChecks(repository, validationResultRepo, ownername, secret_token, octokit)];
                case 2:
                    //Check for example and Contribution in README
                    validationResultRepo = _a.sent();
                    //Check for CODEOWNERS file in .github folder
                    return [4 /*yield*/, fileChecks_1.codeOwnerCheck(repository, ownername, secret_token, octokit)];
                case 3:
                    //Check for CODEOWNERS file in .github folder
                    _a.sent();
                    //Check if nodemodules folder is present in master branch for typescript action
                    return [4 /*yield*/, fileChecks_1.nodeModulesCheck(repository, ownername, secret_token, octokit)];
                case 4:
                    //Check if nodemodules folder is present in master branch for typescript action
                    _a.sent();
                    //check for branch permissions in main/master and releases/*
                    return [4 /*yield*/, branchPermissionCheck_1.branchPermissionCheck(repository, ownername, secret_token, octokit)];
                case 5:
                    //check for branch permissions in main/master and releases/*
                    _a.sent();
                    //check for nodemodules folder in releases/*
                    return [4 /*yield*/, fileChecks_1.releasesNodeModulesCheck(repository, ownername, secret_token, octokit)];
                case 6:
                    //check for nodemodules folder in releases/*
                    _a.sent();
                    //check for security/vulnerability bot
                    return [4 /*yield*/, vulnerabilityBotCheck_1.vulnerabilityBotCheck(repository, ownername, secret_token, octokit)];
                case 7:
                    //check for security/vulnerability bot
                    _a.sent();
                    //1. check whether issue-template has been set up and 2. default label is need-to-triage
                    return [4 /*yield*/, issueTemplateCheck_1.issueTemplateCheck(repository, ownername, secret_token, octokit)];
                case 8:
                    //1. check whether issue-template has been set up and 2. default label is need-to-triage
                    _a.sent();
                    //Check whether standard labels have been set up
                    return [4 /*yield*/, standardLabelsCheck_1.standardLabelsCheck(repository, ownername, secret_token, octokit)];
                case 9:
                    //Check whether standard labels have been set up
                    _a.sent();
                    validationResult.push(validationResultRepo);
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 1];
                case 11:
                    console.log(JSON.parse(JSON.stringify(validationResult)));
                    return [2 /*return*/];
            }
        });
    });
}
main();
