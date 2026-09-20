# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## SDK 57 development

This project uses Expo SDK 57, React Native 0.86.3, and React 19.2.3.
Use Node.js 22.13 or newer. Native iOS builds require Xcode 26.4 or newer
and target iOS 16.4 or newer.

Install the locked dependencies with `npm ci`. After an SDK upgrade, rebuild
any existing development client; an SDK 54 client cannot run this project.
Use a native development build to test the Didit integration and background
location tracking, which cannot be fully tested in Expo Go.

Run the migration checks with:

```bash
npm run typecheck
npm run lint
npx expo install --check
npx expo-doctor
npx expo export --platform ios --platform android
```

On a physical device, also verify login/session restoration, image picking,
date selection, maps, foreground/background location permissions and tracking,
and the payment WebView against your test backend before release.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
