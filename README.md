# Mobile Versioning for Azure DevOps

## Example of variable export for developing the project on a Mac:

For the `ExtractVersionFromTagTask`:

```
export INPUT_ProjectFolderPath="../../../Demo.Xamarin.Pipeline.Release"
```

For the `UpdateAndroidVersionGradleTask` and `UpdateAndroidVersionManifestTask`:

```
export INPUT_BuildGradlePath="../../../MyApplication/app/build.gradle"

export INPUT_AndroidManifestPath="../../../MyApplication/app/src/main/AndroidManifest.xml"

export INPUT_VersionCode=2
export INPUT_VersionName=1.2.5
```

For the `UpdateiOSVersionInfoPlistTask`: 
```
export INPUT_InfoPlistPath="../../../testVersion/testVersion/Info.plist"
export INPUT_BundleShortVersionString=22
export INPUT_BundleVersion=1.2.3
```