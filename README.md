# organize-rn

[organize-rn](https://github.com/High5Apps/organize-rn) is a [React Native](https://reactnative.dev/) client for the [organize-backend](https://github.com/High5Apps/organize-backend) backend server.

## Screenshots

<img alt="Improve your work life" src="/docs/screenshots/ios-0-improve.png" width=19%>&nbsp;
<img alt="Connect work coworkers" src="/docs/screenshots/ios-1-connect.png" width=19%>&nbsp;
<img alt="Unite your voices" src="/docs/screenshots/ios-2-unite.png" width=19%>&nbsp;
<img alt="Vote on anything" src="/docs/screenshots/ios-3-vote.png" width=19%>&nbsp;
<img alt="Private by design" src="/docs/screenshots/ios-4-private.png" width=19%>

## Development Setup

1. Clone the repo from GitHub
   ```sh
   git clone git@github.com:High5Apps/organize-rn.git \
      && cd organize-rn
   ```
2. If you don't already have it, install the following software on your development machine. You'll need a Mac for iOS development. Android development can happen on Mac or PC.
   - [Xcode](https://developer.apple.com/support/xcode/) (Mac only)
   - [CocoaPods](https://cocoapods.org/) (Mac only)
   - [Android Studio](https://developer.android.com/studio/install)
   - [Node](https://nodejs.org)
   - [NPM](https://www.npmjs.com/)
   - [VS Code](https://code.visualstudio.com/) (consider installing the following extensions)
      - `dbaeumer.vscode-eslint`
      - `waderyan.gitblame` 
      - `pflannery.vscode-versionlens`
3. Install the dependencies
   ```sh
   npm install
   ```
   For iOS development, you'll also need to install the CocoaPods dependencies
   ```sh
   cd ios && pod install
   ```
4. Start the development server
   ```sh
   npm start
   ```
5. Start the [organize-backend](https://github.com/High5Apps/organize-backend) development server
   ```sh
   dc up
   ```
6. Install and launch the app
   ```sh
   # On an iOS simulator
   npm run ios

   # On an Android emulator
   npm run android
   ```
7. Make a change to the [TypeScript](https://www.typescriptlang.org/) code, save it, and the app will update live without needing to be reinstalled
   - You only need to reinstall the app if you make changes to native code ([Swift](https://www.swift.org/)/[Kotlin](https://kotlinlang.org/)/[Java](https://www.java.com)/[Objective-C](https://en.wikipedia.org/wiki/Objective-C)) or add/modify any dependencies
   - You don't even need to reinstall the app at the beginning of each development session. You can just launch the simulator or emulator, open the app, and it will automatically connect to the development server and be ready for live code updates

## Testing

The following command will ensure that dependencies are compatible, then type check, lint, and unit test the code:
```sh
npm test
```
To run just one part of these checks, use `npm run <command>` with one of the scripts in [`package.json`](/package.json).

### Unit testing
[Jest](https://jestjs.io/) is used as the unit testing framework. [`react-test-renderer`](https://legacy.reactjs.org/docs/test-renderer.html) is used for unit testing components.

You can run a subset of the unit tests with `npx jest path/to/directory/or/file`. For example:
```sh
# Only run tests in the model directory
npx jest __tests__/model/

# Only run tests in the App.test.tsx file
npx jest __tests__/App.test.tsx
```

To run just a subset of tests in a single file, append `.only` to the relevant `describe` in the test file. To run just one test in a single file, append `.only` to the relevant tests's `it`. For more options, see the Jest docs.

## Installing on a physical device
1. Enable developer mode on your [iPhone](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device) or [Android device](https://developer.android.com/studio/debug/dev-options)
2. Connect your device to your development machine with a physical cable, or setup wireless/remote debugging
   - For wireless debugging on iOS, you need to ensure your device is on the same wireless network as your development machine, and you likely need to disable any VPN on your development machine
   - For wireless debugging on Android, follow [these directions](https://developer.android.com/studio/run/device#wireless). Both machines must be on the same wireless network, but you can likely leave any VPN running on both machines. Running `adb devices` may help reconnect if the connection between machines drops.
3. There are multiple options to install and run the app:
   - Command line
      ```sh
      # Install for development on Android
      npm run android:device

      # Install a release build on Android
      npm run android:device:release

      # Install for development on iOS
      npm run ios:device

      # Install a release build on iOS
      npm run ios:device:release
      ```
   - Xcode
      1. Choose a debug or release build with **Product > Scheme > Edit Scheme > Info > Build Configuration > Debug or Release**
      2. Click the Play button or `cmd+R`
   - Android Studio
      1. Choose a debug or release build with **Build > Select Build Variant > :app > debug or release**
      2. Click the play button or `ctrl+R`
