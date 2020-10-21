import task = require('azure-pipelines-task-lib/task');
import fs = require('fs');

async function run() {
    try {
        var buildGradlePath = task.getPathInput('buildGradlePath');

        if (!fs.existsSync(buildGradlePath)) {
            task.error(`The file path for the build.gradle does not exist or is not found: ${buildGradlePath}`);
            process.exit(1);
        }

        task.debug(`Running task with ${buildGradlePath}`);

        var versionCode = task.getInput('versionCode');
        task.debug(`VersionCode: ${versionCode}`);

        if (versionCode == null) {
            task.error(`Version Code has no value: ${versionCode}`);
            process.exit(1);
        } else if (parseInt(versionCode, 0) <= 0 && parseInt(versionCode, 10) >= 2100000000) {
            task.error(`The Version Code you set: ${versionCode} is not valid, to submit your application to the Google Play Store the value must 
            be greater then 0 and below 2100000000 of ${versionCode}`);
            process.exit(1);
        }

        var versionName: string = task.getInput('versionName');
        task.debug(`VersionName: ${versionName}`);

        var filecontent = fs.readFileSync(buildGradlePath).toString();
        fs.chmodSync(buildGradlePath, "600");

        filecontent = filecontent.replace(/versionCode\s*(\d+(?:\.\d)*)/mg, `versionCode ${versionCode}`);
        filecontent = filecontent.replace(/versionName\s"\s*(\d+(?:\.\d+)*)"/mg, `versionName \"${versionName}\"`);

        fs.writeFileSync(buildGradlePath, filecontent);

        task.setResult(task.TaskResult.Succeeded, `build.gradle updated successfully with  versionCode: ${versionCode} and versionName: ${versionName}. Please, define it manually or use the ExtractVersionFromTagTask before to automatically set it.`);
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();