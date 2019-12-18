import task = require('azure-pipelines-task-lib/task');
import fs = require('fs');
import plist = require('plist');

async function run() {
    try {
        var infoPlistPath = task.getPathInput('infoPlistPath');

        if (!fs.existsSync(infoPlistPath)) {
            task.error(`The file path does not exist: ${infoPlistPath}`);
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
}

run();