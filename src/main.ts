import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';
import { readmeChecks, codeOwnerCheck, nodeModulesCheck, releasesNodeModulesCheck } from './fileChecks'
import { branchPermissionCheck } from './branchPermissionCheck'
import { vulnerabilityBotCheck } from './vulnerabilityBotCheck'
import { issueTemplateCheck } from './issueTemplateCheck'
import { standardLabelsCheck } from './standardLabelsCheck'
import { AnyARecord } from 'dns';

async function main() {

	var secret_token = core.getInput('GITHUB_TOKEN');
	const octokit = new Octokit({
		auth: secret_token,
	});
	var repositories = core.getInput('repositories');
	var repositories_list = repositories.split(',');
	const ownername =  github.context.repo.owner;
	var repository = '';
	var validationResult = [];
	for (var i = 0; i < repositories_list.length; i++) {
		repository = repositories_list[i];
		var validationResultRepo: any = {"repoName":repository, 
										 "readmeChecks":"unknown", 
										 "codeOwnerCheck":"unknown", 
										 "nodeModulesCheck":"unknown", 
										 "branchPermissionCheck":"unknown",
										 "releasesNodeModulesCheck":"unknown",
										 "vulnerabilityBotCheck":"unknown",
										 "issueTemplateCheck":"unknown",
										 "standardLabelsCheck":"unknown"
										}
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
		//Check for example and Contribution in README
		validationResultRepo = await readmeChecks(repository, validationResultRepo, ownername, secret_token, octokit);
		//Check for CODEOWNERS file in .github folder
		await codeOwnerCheck(repository, ownername, secret_token, octokit);
		//Check if nodemodules folder is present in master branch for typescript action
		await nodeModulesCheck(repository, ownername, secret_token, octokit);
		//check for branch permissions in main/master and releases/*
		await branchPermissionCheck(repository, ownername, secret_token, octokit);
		//check for nodemodules folder in releases/*
		await releasesNodeModulesCheck(repository, ownername, secret_token, octokit);
		//check for security/vulnerability bot
		await vulnerabilityBotCheck(repository, ownername, secret_token, octokit);
		//1. check whether issue-template has been set up and 2. default label is need-to-triage
		await issueTemplateCheck(repository, ownername, secret_token, octokit);
		//Check whether standard labels have been set up
		await standardLabelsCheck(repository, ownername, secret_token, octokit)
		validationResult.push(validationResultRepo);
	}
	console.log(JSON.parse(JSON.stringify(validationResult)));
	var result =  JSON.parse(JSON.stringify(validationResult, null,'\t'));
	core.setOutput("validationResult", result);

}

main();