![Schema](./icon.png)

# Mobile Versioning for Azure DevOps

## Install

Available on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=DamienAicheh.mobile-versioning-task&ssr=false#overview)

## Features

Here is the list of tasks available in this extension:

- ExtractVersionFromTag
- UpdateiOSVersionInfoPlist
- UpdateAndroidVersionManifest
- UpdateAndroidVersionGradle

## Tutorial
You will find a complete tutorial here:

##### English version :
[https://damienaicheh.github.io/azure/devops/2019/12/19/manage-your-application-version-automatically-using-git-and-azure-devops-en](https://damienaicheh.github.io/azure/devops/2019/12/19/manage-your-application-version-automatically-using-git-and-azure-devops-en)

##### French version :
[https://damienaicheh.github.io/azure/devops/2019/12/19/manage-your-application-version-automatically-using-git-and-azure-devops-fr](https://damienaicheh.github.io/azure/devops/2019/12/19/manage-your-application-version-automatically-using-git-and-azure-devops-fr)


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
