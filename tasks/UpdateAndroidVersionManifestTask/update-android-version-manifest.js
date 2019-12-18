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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var androidManifestPath = task.getPathInput('androidManifestPath');
            if (!fs.existsSync(androidManifestPath)) {
                task.error(`The file path does not exist:: ${androidManifestPath}`);
                process.exit(1);
            }
            task.debug(`Running task with ${androidManifestPath}`);
            var versionCode = task.getInput('versionCode');
            task.debug(`VersionCode: ${versionCode}`);
            if (!versionCode) {
                task.error(`Version Code has no value: ${versionCode}`);
                process.exit(1);
            }
            else if (parseInt(versionCode, 0) <= 0 && parseInt(versionCode, 10) >= 2100000000) {
                task.error(`The Version Code you set: ${versionCode} is not valid, to submit your application to the Google Play Store the value must 
            be greater then 0 and below 2100000000 of ${versionCode}`);
                process.exit(1);
            }
            var versionName = task.getInput('versionName');
            task.debug(`VersionName: ${versionName}`);
            var filecontent = fs.readFileSync(androidManifestPath).toString();
            fs.chmodSync(androidManifestPath, "600");
            filecontent = filecontent.replace(/versionCode\s*=\s*"(\d+(?:\.\d)*)"/mg, `versionCode=\"${versionCode}\"`);
            filecontent = filecontent.replace(/versionName\s*=\s*"(\d+(?:\.\d+)*)"/mg, `versionName=\"${versionName}\"`);
            fs.writeFileSync(androidManifestPath, filecontent);
            task.setResult(task.TaskResult.Succeeded, `AndroidManifest.xml updated successfully with versionCode: ${versionCode} and versionName: ${versionName}`);
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
run();
