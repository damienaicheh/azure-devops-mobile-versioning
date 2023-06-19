import task = require('azure-pipelines-task-lib/task');
import fs = require('fs');

const MAJOR: string = 'MAJOR';
const MINOR: string = 'MINOR';
const PATCH: string = 'PATCH';
const PRE_RELEASE: string = 'PRE_RELEASE';
const NUMBER_OF_COMMITS: string = 'NUMBER_OF_COMMITS';
const NUMBER_OF_COMMITS_SINCE_TAG: string = 'NUMBER_OF_COMMITS_SINCE_TAG';

async function run() {
    try {
        var projectFolderPath = task.getPathInput('projectFolderPath');
        var splitPrefix = 'v';
        var tagPrefixMatch = task.getPathInput('tagPrefixMatch');

        if (!fs.existsSync(projectFolderPath)) {
            task.error(`Source directory does not exist: ${projectFolderPath}`);
            process.exit(1);
        }

        task.debug(`Moving to ${projectFolderPath}`);
        task.cd(projectFolderPath);

        let git: string = task.which('git', true);
        var args = ["describe", "--tags", "--abbrev=0"];

        // Add prefix match if need 
        if (tagPrefixMatch !== undefined && tagPrefixMatch.trim().length !== 0) {
            task.debug(`Add match ${tagPrefixMatch}`);
            args.push(`--match=${tagPrefixMatch}*`);
            splitPrefix = tagPrefixMatch.toLowerCase();
        }

        let tagResult = task.execSync(git, args);

        if (tagResult.code !== 0) {
            if (tagResult.error != null) {
                task.error(`${tagResult.error.name} ${tagResult.error.message}`);
                task.error(tagResult.error.stack);
            }
            task.error('No tag found on this branch, please verify you have one in your remote repository.');

            process.exit(1);
        }

        task.debug(`Tag retreived: ${tagResult.stdout}`);

        var originalTag = tagResult.stdout;
        if (originalTag.includes('\n')) {
            originalTag = originalTag.split('\n')[0];
        }

        var tag = originalTag.toLowerCase();

        if (tag.startsWith(splitPrefix)) {
            var tagSplitted = tag.split(splitPrefix);
            tag = tagSplitted[1];
        }

        var versionsIndicator = tag.split('.');
        task.debug(versionsIndicator.toString());

        if (versionsIndicator.length > 2 && versionsIndicator[2].includes('-')) {
            const preSplit = versionsIndicator[2].split('-');
            // Replacing PATCH split with pre release tag split
            versionsIndicator[2] = preSplit[0];
            setVariableOrDefault(PRE_RELEASE, preSplit[1]);
        } else {
            // setting empty string a PRE_RELEASE
            task.setVariable(PRE_RELEASE, '');
        }

        setVariableOrDefault(MAJOR, versionsIndicator[0]);
        setVariableOrDefault(MINOR, versionsIndicator[1]);
        setVariableOrDefault(PATCH, versionsIndicator[2]);

        task.debug('Get the number of commit until this tag');

        var args = ["rev-list", "--count", "HEAD"];

        let result = task.execSync(git, args);

        var numberOfCommits = result.stdout.split('\n');

        setVariableOrDefault(NUMBER_OF_COMMITS, numberOfCommits[0]);

        var argsSinceTag = ["rev-list", `${originalTag}..HEAD`, "--count"];

        let commitsSinceTagResult = task.execSync(git, argsSinceTag);

        var numberOfCommitsSinceTag = commitsSinceTagResult.stdout.split('\n');

        setVariableOrDefault(NUMBER_OF_COMMITS_SINCE_TAG, numberOfCommitsSinceTag[0]);

        task.debug(`Major:` + task.getVariable(MAJOR));
        task.debug(`Minor:` + task.getVariable(MINOR));
        task.debug(`Patch:` + task.getVariable(PATCH));

        if (task.getVariable(PRE_RELEASE)) {
            task.debug(`Pre Release:` + task.getVariable(PRE_RELEASE));
        }
        task.debug(`Number of commits:` + task.getVariable(NUMBER_OF_COMMITS));
        task.debug(`Number of commits since tag:` + task.getVariable(NUMBER_OF_COMMITS_SINCE_TAG));

        task.setResult(task.TaskResult.Succeeded, "Extract version from tag succeeded");
    } catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

function setVariableOrDefault(name: string, value: string, defaultValue: any = '0') {
    if (value) {
        task.setVariable(name, value);
    } else {
        task.setVariable(name, defaultValue);
    }
}

run();
