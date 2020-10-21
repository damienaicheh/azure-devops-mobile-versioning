import task = require('azure-pipelines-task-lib/task');
import fs = require('fs');

async function run() {
    try {
        var androidManifestPath = task.getPathInput('androidManifestPath');

        if (!fs.existsSync(androidManifestPath)) {
            task.error(`The file path for the AndroidManifest.xml does not exist or is not found: ${androidManifestPath}`);
            process.exit(1);
        }

        task.debug(`Running task with ${androidManifestPath}`);

        var versionCode = task.getInput('versionCode');
        task.debug(`VersionCode: ${versionCode}`);

        if (!versionCode) {
            task.error(`Version Code has no value: ${versionCode}`);
            process.exit(1);
        } else if (parseInt(versionCode, 0) <= 0 && parseInt(versionCode, 10) >= 2100000000) {
            task.error(`The Version Code you set: ${versionCode} is not valid, to submit your application to the Google Play Store the value must 
            be greater then 0 and below 2100000000 of ${versionCode}`);
            process.exit(1);
        }

        var versionName: string = task.getInput('versionName');
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
}

run();