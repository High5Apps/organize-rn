# Architecture

This document describes the high-level architecture of the Organize React Native client. If you want to familiarize yourself with this codebase, you're in the right place!

(This document was inspired by [Alex Kladov's ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html).)

## Bird's Eye View

This repo defines the components needed to develop, test, and build the Organize apps for Android and iOS.

[React Native](https://reactnative.dev/) is the core framework used for the project. [TypeScript](https://www.typescriptlang.org/) is used for code shared between the Android and iOS apps, while [Java](https://www.java.com) and [Swift](https://www.swift.org/) are used for functionality specific to either [Android](https://developer.android.com/) or [iOS](https://developer.apple.com/ios/) respectively.

[React Navigation](https://reactnavigation.org/) is used to define screen heirarchies and navigate among them. In-memory data is managed using [Context](https://react.dev/learn/passing-data-deeply-with-context) and [Hooks](https://react.dev/reference/react/hooks). [Async Storage](https://github.com/react-native-async-storage/async-storage) is used for state persistence across launches. [Material Icons](https://fonts.google.com/icons) are used for iconography.

## Code Map

This section talks briefly about various important directories and data structures. Pay attention to the **Architecture Invariant** sections. They often talk about things which are deliberately absent in the source code.

### `android/app/src/main/java/com/organize`

[Android native modules](https://reactnative.dev/docs/native-modules-android) and React Native boilerplate specific to Android

### `app`

Shared functionality used in both the Android and iOS apps

#### `app/components`

React Native [functional components](https://reactnative.dev/docs/intro-react-native-components)- reusable building blocks concerned with the layout and visual appearance of the user interface.

**Architecture Invariant:** The `components` layer should depend on the `model` layer. The `model` layer should not import from the `components` layer.

**Architecture Invariant:** The `components` layer should depend on the `model` layer instead of importing from the `networking` layer directly

##### `app/components/controls`

Components concerned with handling user input

##### `app/components/views`

Components unconcerned with handling user input

#### `app/model`

Code concerned with data management, and manipulation.

##### `app/model/context`

Contains subfolders for context `consumers`, context `providers`, and the `caches` used to manage shared model state across all levels of the component heirarchy

##### `app/model/formatters`

Data manipulation into strings with vaious formats

##### `app/model/keys`

Platform-independent interfaces that abstract the platform-specific cryptographic functionality in the `android` and `ios` native modules

##### `app/navigation`

Heirarchies of `screens` defined using the React Navigation framework

**Architecture Invariant:** `navigation` should depend on `screens` instead of importing from `components` directly

**Architecture Invariant:** Each screen should only appear in a single primary tab. The goal is to simplify the mental map of the (fairly expansive) screen heirarcy. For example, navigating to a candidacy anouncement discussion from an election result should switch tabs from the Vote tab to the Discuss tab, instead of pushing a discussion screen directly onto the Vote tab.

##### `app/networking`

APIs for communicating with the [organize-api](https://github.com/High5Apps/organize-api) backend server and adapting the responses so that they're easier to work with in the `model` layer

**Architecture Invariant:** The `model` layer assumes that all data is decrypted instead of encrypted, camelCase instead of snake_case, and uses `Date` objects instead of date strings. As such, all of these transformations must be handled by the `networking` layer, not the `model` layer.

##### `app/screens`

Full-screen user interfaces consumed directly by the `navigation` layer. `screens` are composed of many reusable building blocks from the `components` layer.

### `assets`

Shared static assets used in both Android and iOS apps.

**Architecture invariant:** Assets must use scale-independent formats like SVG unless otherwise required by the native platform.

### `ios`

[iOS native modules](https://reactnative.dev/docs/native-modules-ios) and React Native boilerplate specific to iOS

### `scripts`

Script files called from the NPM scripts in `package.json`.

## Cross-Cutting Concerns

This sections talks about the things which are everywhere and nowhere in particular.

### Facilitate in-person action, don't discourage it

> "We have been too quiet for too long. There comes a time when you have to say something. You have to make a little noise. **You have to move your feet.** This is the time." —[John Lewis](https://en.wikipedia.org/wiki/John_Lewis)

Organizing requires an immense amount of coordinated physical presence and legwork, which can't possibly happen within any app.

As such, the app could be a helpful tool to:
- plan in-person actions and membership drives
- discuss and come to consensus on important topics
- announce upcoming events

But it should never:
- facilitate virtual participation over in-person attendance, say, by hosting a video stream of a meeting-hall event
- be a distraction to members who are physically present, say, by sending push notifications during a picket
- promote in-app achievements over real-world effort, say, by elevating in-app karma above earned tenure

### No lock-in to a single native platform

React Native was chosen as the core framework to remove the single point of failure inherent to relying on iOS or Android alone. The motivation for this is detailed further in [this section](https://github.com/High5Apps/organize-api/blob/main/ARCHITECTURE.md#minimal-reliance-on-external-services-with-unaligned-interests) of the `organize-api` [`ARCHITECTURE.md` file](https://github.com/High5Apps/organize-api/blob/main/ARCHITECTURE.md).

Furthermore, [React Native for Web](https://necolas.github.io/react-native-web/) offers a straightforward mitigation plan if both native platforms were to abruptly end their partnerships.

### End-to-end encryption for all member-generated text

Member-generated text must remain private, even from being read by the server

**Architecture invariant:** Member-generated text must be end-to-end encrypted using the group key before it is uploaded to the backend

### No client-side analytics or logging

Client-side analytics and logging pose too much of a risk of accidentally exposing communications that were intended to be private. As such, they must not be added.

However, bugs happen and need to be fixed, so members can self-report bugs with screenshots of what went wrong. Consequently, real error messages must be displayed instead of generic error messages, so that developers can in turn see the real error messages in the screenshots.

### In-house native module wrappers for crypto

Android and iOS both offer well-documented, batteries-included APIs for [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)), [ECC](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography), and [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) cryptography.

This project's use of crypto is limited in scope compared to the large scope required by 3rd-party React Native crypto libraries. As such, in an effort to reduce the attack surface, in-house crypto native modules were developed to wrap only the required native functionality from both Android and iOS.

### Dark mode support

Dark mode and light mode theming are achieved using a combination of [semantic colors](https://developer.apple.com/documentation/uikit/appearance_customization/supporting_dark_mode_in_your_interface#2993897) in `Theme.ts` and a `useStyles` hook in each relevant component.

**Architecture invariant:** Light and dark themes must be considered for all new functionality

### Optimistic UI pattern

Where possible, the optimistic UI pattern should be used instead of showing a spinner. With this pattern, the update is optimistically assumed to work, so it's immediately reflected in the UI and only rolled back on errors.

### Testing

**Architecture invariant:** A unit test file in the `__tests__` folder structure must mirror the location of its target model in the `app` folder structure. e.g. The unit tests for `app/model/foo/bar.ts` should be located at `__tests__/model/foo/bar.test.ts`.
