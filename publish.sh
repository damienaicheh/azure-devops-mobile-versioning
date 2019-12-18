echo "Publish"

cd tasks/ExtractVersionFromTagTask/
npm install
tsc

cd ../UpdateAndroidVersionGradleTask
npm install
tsc

cd ../UpdateAndroidVersionManifestTask
npm install
tsc

cd ../UpdateiOSVersionInfoPlistTask
npm install
tsc

cd ../../

tfx extension create --manifest-globs vss-extension.json