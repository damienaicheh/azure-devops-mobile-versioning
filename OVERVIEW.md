# Mobile Versioning

## Quick overview

The tasks available in this extension ares:

- ExtractVersionFromTag
- UpdateiOSVersionInfoPlist
- UpdateAndroidVersionManifest
- UpdateAndroidVersionGradle

Check the [Github](https://github.com/damienaicheh/azure-devops-mobile-versioning) repository for more informations!

## Usage

Dynamically get the version from the Git tag:

```yml
- task: ExtractVersionFromTag@1
  inputs:
    projectFolderPath: '$(Build.SourcesDirectory)' # Optional. Default is: $(Build.SourcesDirectory)
```

For iOS to update the `Info.plist`:

```yaml
- task: UpdateiOSVersionInfoPlist@1
  inputs:
    infoPlistPath: 'your_project/Info.plist'
    bundleShortVersionString: '$(MAJOR).$(MINOR).$(PATCH)' # Optional. Default is: $(MAJOR).$(MINOR).$(PATCH)
    bundleVersion: '$(NUMBER_OF_COMMITS)' # Optional. Default is: $(NUMBER_OF_COMMITS)
```

For Android:

If you need to update the `AndroidManifest.xml`:

```yaml
- task: UpdateAndroidVersionManifest@1
  inputs:
    androidManifestPath: 'your_project/AndroidManifest.xml'
    versionName: '$(MAJOR).$(MINOR).$(PATCH)' # Optional. Default is: $(MAJOR).$(MINOR).$(PATCH)
    versionCode: '$(NUMBER_OF_COMMITS)' # Optional. Default is: $(NUMBER_OF_COMMITS)
```

If you need to update the `build.gradle` inside the `app` folder:

```yaml
- task: UpdateAndroidVersionGradle@1
  inputs:
    buildGradlePath: 'your_project/app/build.gradle'
    versionName: '$(MAJOR).$(MINOR).$(PATCH)' # Optional. Default is: $(MAJOR).$(MINOR).$(PATCH)
    versionCode: '$(NUMBER_OF_COMMITS)' # Optional. Default is: $(NUMBER_OF_COMMITS)
```