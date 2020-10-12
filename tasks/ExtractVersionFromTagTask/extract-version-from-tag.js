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
exports.__esModule = true;
var task = require("azure-pipelines-task-lib/task");
var fs = require("fs");
var MAJOR = 'MAJOR';
var MINOR = 'MINOR';
var PATCH = 'PATCH';
var PRE_RELEASE = 'PRE_RELEASE';
var NUMBER_OF_COMMITS = 'NUMBER_OF_COMMITS';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var projectFolderPath, git, args, tagResult, tag, tagSplitted, versionsIndicator, preSplit, args, result, numberOfCommits;
        return __generator(this, function (_a) {
            try {
                projectFolderPath = task.getPathInput('projectFolderPath');
                if (!fs.existsSync(projectFolderPath)) {
                    task.error("Source directory does not exist: " + projectFolderPath);
                    process.exit(1);
                }
                task.debug("Moving to " + projectFolderPath);
                task.cd(projectFolderPath);
                git = task.which('git', true);
                args = ["describe", "--tags", "--abbrev=0"];
                tagResult = task.execSync(git, args);
                if (tagResult.code !== 0) {
                    if (tagResult.error != null) {
                        task.error(tagResult.error.name + " " + tagResult.error.message);
                        task.error(tagResult.error.stack);
                    }
                    task.error('No tag found on this branch, please verify you have one in your remote repository.');
                    process.exit(1);
                }
                task.debug("Tag retreived: " + tagResult.stdout);
                tag = tagResult.stdout;
                if (tag.includes('v')) {
                    tagSplitted = tag.split('v');
                    tag = tagSplitted[1];
                }
                if (tag.includes('\n')) {
                    tag = tag.split('\n')[0];
                }
                versionsIndicator = tag.split('.');
                task.debug(versionsIndicator.toString());
                if (versionsIndicator[2].includes('-')) {
                    preSplit = versionsIndicator[2].split('-');
                    // Replacing PATCH split with pre release tag split
                    versionsIndicator[2] = preSplit[0];
                    setVariableOrDefault(PRE_RELEASE, preSplit[1]);
                }
                else {
                    // setting empty string a PRE_RELEASE
                    task.setVariable(PRE_RELEASE, '');
                }
                setVariableOrDefault(MAJOR, versionsIndicator[0]);
                setVariableOrDefault(MINOR, versionsIndicator[1]);
                setVariableOrDefault(PATCH, versionsIndicator[2]);
                task.debug('Get the number of commit until this tag');
                args = ["rev-list", "--count", "HEAD"];
                result = task.execSync(git, args);
                numberOfCommits = result.stdout.split('\n');
                setVariableOrDefault(NUMBER_OF_COMMITS, numberOfCommits[0]);
                task.debug("Major:" + task.getVariable(MAJOR));
                task.debug("Minor:" + task.getVariable(MINOR));
                task.debug("Patch:" + task.getVariable(PATCH));
                if (task.getVariable(PRE_RELEASE)) {
                    task.debug("Pre Release:" + task.getVariable(PRE_RELEASE));
                }
                task.debug("Number of commits:" + task.getVariable(NUMBER_OF_COMMITS));
                task.setResult(task.TaskResult.Succeeded, "Extract version from tag succeeded");
            }
            catch (err) {
                task.setResult(task.TaskResult.Failed, err.message);
            }
            return [2 /*return*/];
        });
    });
}
function setVariableOrDefault(name, value, defaultValue) {
    if (defaultValue === void 0) { defaultValue = '0'; }
    if (value) {
        task.setVariable(name, value);
    }
    else {
        task.setVariable(name, defaultValue);
    }
}
run();
