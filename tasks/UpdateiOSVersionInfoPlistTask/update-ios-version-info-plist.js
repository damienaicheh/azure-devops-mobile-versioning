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
const plist = require("plist");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var infoPlistPath = task.getPathInput('infoPlistPath');
            if (!fs.existsSync(infoPlistPath)) {
                task.error(`The file path for the info.plist does not exist or is not found: ${infoPlistPath}`);
                process.exit(1);
            }
            task.debug(`Running task with ${infoPlistPath}`);
            var bundleShortVersionString = task.getInput('bundleShortVersionString');
            task.debug(`BundleShortVersionString: ${bundleShortVersionString}`);
            var bundleVersion = task.getInput('bundleVersion');
            task.debug(`BundleVersion: ${bundleVersion}`);
            if (!bundleShortVersionString) {
                task.error(`Bundle Short Version String has no value: ${bundleShortVersionString}. Please, define it manually or use the ExtractVersionFromTagTask before to automatically set it.`);
                process.exit(1);
            }
            if (!bundleVersion) {
                task.error(`Bundle Version has no value: ${bundleVersion}`);
                process.exit(1);
            }
            var fileContent = fs.readFileSync(infoPlistPath, 'UTF8');
            task.debug(JSON.stringify(fileContent));
            var obj = plist.parse(fileContent);
            obj['CFBundleShortVersionString'] = bundleShortVersionString;
            obj['CFBundleVersion'] = bundleVersion;
            fs.chmodSync(infoPlistPath, "600");
            fs.writeFileSync(infoPlistPath, plist.build(obj));
            task.setResult(task.TaskResult.Succeeded, `Info.plist updated successfully with CFBundleShortVersionString: ${bundleShortVersionString} and CFBundleVersion: ${bundleVersion}`);
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
run();
