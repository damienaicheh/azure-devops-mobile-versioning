"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("azure-pipelines-task-lib/task");
const fs = require("fs");
const MAJOR = "MAJOR";
const MINOR = "MINOR";
const PATCH = "PATCH";
const PRE_RELEASE = "PRE_RELEASE";
const NUMBER_OF_COMMITS = "NUMBER_OF_COMMITS";
const NUMBER_OF_COMMITS_SINCE_TAG = "NUMBER_OF_COMMITS_SINCE_TAG";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var projectFolderPath = task.getPathInput("projectFolderPath");
            if (!fs.existsSync(projectFolderPath)) {
                task.error(`Source directory does not exist: ${projectFolderPath}`);
                process.exit(1);
            }
            task.debug(`Moving to ${projectFolderPath}`);
            task.cd(projectFolderPath);
            let git = task.which("git", true);
            var args = ["describe", "--tags", "--abbrev=0"];
            let tagResult = task.execSync(git, args);
            if (tagResult.code !== 0) {
                if (tagResult.error != null) {
                    task.error(`${tagResult.error.name} ${tagResult.error.message}`);
                    task.error(tagResult.error.stack);
                }
                task.error("No tag found on this branch, please verify you have one in your remote repository.");
                process.exit(1);
            }
            task.debug(`Tag retreived: ${tagResult.stdout}`);
            var originalTag = tagResult.stdout;
            if (originalTag.includes("\n")) {
                originalTag = originalTag.split("\n")[0];
            }
            var tag = originalTag.toLowerCase();
            if (tag.startsWith("v")) {
                var tagSplitted = tag.split("v");
                tag = tagSplitted[1];
            }
            var versionsIndicator = tag.split(".");
            task.debug(versionsIndicator.toString());
            if (versionsIndicator.length > 2 && versionsIndicator[2].includes("-")) {
                const preSplit = versionsIndicator[2].split("-");
                // Replacing PATCH split with pre release tag split
                versionsIndicator[2] = preSplit[0];
                setVariableOrDefault(PRE_RELEASE, preSplit[1]);
            }
            else {
                // setting empty string a PRE_RELEASE
                task.setVariable(PRE_RELEASE, "");
            }
            setVariableOrDefault(MAJOR, versionsIndicator[0]);
            setVariableOrDefault(MINOR, versionsIndicator[1]);
            setVariableOrDefault(PATCH, versionsIndicator[2]);
            task.debug("Get the number of commit until this tag");
            var args = ["rev-list", "--count", "HEAD"];
            let result = task.execSync(git, args);
            var numberOfCommits = result.stdout.split("\n");
            setVariableOrDefault(NUMBER_OF_COMMITS, numberOfCommits[0]);
            var argsSinceTag = ["rev-list", `${originalTag}..HEAD`, "--count"];
            let commitsSinceTagResult = task.execSync(git, argsSinceTag);
            var numberOfCommitsSinceTag = commitsSinceTagResult.stdout.split("\n");
            setVariableOrDefault(NUMBER_OF_COMMITS_SINCE_TAG, numberOfCommitsSinceTag[0]);
            task.debug(`Major:` + task.getVariable(MAJOR));
            task.debug(`Minor:` + task.getVariable(MINOR));
            task.debug(`Patch:` + task.getVariable(PATCH));
            if (task.getVariable(PRE_RELEASE)) {
                task.debug(`Pre Release:` + task.getVariable(PRE_RELEASE));
            }
            task.debug(`Number of commits:` + task.getVariable(NUMBER_OF_COMMITS));
            task.debug(`Number of commits since tag:` +
                task.getVariable(NUMBER_OF_COMMITS_SINCE_TAG));
            task.setResult(task.TaskResult.Succeeded, "Extract version from tag succeeded");
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
function setVariableOrDefault(name, value, defaultValue = "0") {
    if (value) {
        task.setVariable(name, value);
    }
    else {
        task.setVariable(name, defaultValue);
    }
}
run();
