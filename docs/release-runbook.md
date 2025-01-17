# Release Runbook

1. Add a version bump commit
    - Similar to https://github.com/High5Apps/organize-rn/commit/b90df8b
2. Create a version tag
    - e.g. `git tag v2.1.0 && git push origin v2.1.0`
3. Disable developer settings
    1. Update `ENABLE_DEVELOPER_SETTINGS` in `.env` to be `false`
    2. Restart the metro server with `npm start -- --reset-cache`
    3. `npm run ios`, navigate to **Settings**, scroll down, and verify **Developer** section is absent
    4. `npm run android`, navigate to **Settings**, scroll down, and verify **Developer** section is absent
4. Create and upload the iOS archive
    1. Open Xcode, then click **Product > Scheme > Edit Scheme > Build Configuration > Release > Close**
    2. Click **Product > Archive**
    3. After success, if the Organizer window doesn't open automatically, click **Window > Organizer**
    4. Click **Distribute App > App Store Connect**
        - You may see "Upload Symbols Failed" warning about Hermes. This is a [known issue](https://github.com/facebook/react-native/commit/f529fe4) that should be fixed in RN77.
5. Create and upload the Android App Bundle
    1. Open **Android Studio**
    1. If needed, update the build variant from **debug** to **release**
        - If the **Build Variants** window isn't already shown, click **View > Tool Windows > Build Variants** 
    2. Click **Build > Generate Signed App Bundle / APK > Android App Bundle > Next**
    3. Enter the **Key store password** and **Key password**, then click **Next**
        - **Key store password** is saved in password manager under **Organize Upload Key**
        - **Key password** is the same as **Key store password**. They must be the same due to a [known issue](https://developer.android.com/studio/known-issues#ki-key-keystore-warning).
    4. Select **release**, then click **Create**
    5. On success, click **locate**
    6. In **Chrome**, open the [Google Play Console](https://play.google.com/console/developers/?pli=1)
    7. Click **Organize: Modern Labor Unions > Test and release > Production > Create new release**
    8. Drag-and-drop the **app-release.aab** file onto the **App bundles** input
    9. Release name should be populated automatically. If not use the format `(<versionCode>) <versionName>`
    10. For **Release notes**, click **Copy from a previous release**, select the previous release, then click **Copy notes**
        - Alternately, just enter "Minor bug fixes and improvements"
    11. Click **next > Save**
6. Access the demo mode credentials
    1. Open your local `organize-backend` repo in **VSCode**
    2. If not present already, copy/paste the **Organize production RAILS_MASTER_KEY_API** from your password manager into the `RAILS_MASTER_KEY_API` of your `.env` file
    3. Start your local `organize-backend` development server with `dc up`
    4. Click the blue **><** button in the bottom left corner, then click **Attach to a Running Container**
        - For more info see <https://code.visualstudio.com/docs/devcontainers/attach-container>
    5. Select **/organize-backend-api-1**
    6. Click **Terminal > New Terminal**
    7. Run `VISUAL="code --wait" bin/rails credentials:edit --environment production`
7. Update the Android demo mode credentials
    1. In **Chrome**, open the [Google Play Console](https://play.google.com/console/developers/?pli=1)
    2. Click **Organize: Modern Labor Unions > Monitor and improve > Policy and programs > App content**
    3. Scroll down to **App access** and click **Manage**
    4. Scroll down to **Instructions for creating an Org** and click **Manage**
    5. Update the **Username, email address or phone number** to be the *first* demo mode email
    6. Update the **Password** to be the *first* demo mode password
    7. Click the blue **Add** button in the bottom right corner, then click **Save**
8. Start the Android review process
    1. In the Google Play Console, click **Publishing overview** in the left navigation drawer
    2. Verify that all expected changes are present
    3. Click **Send \<n\> changes for review**, then click **Send changes for review**
9. Create a new iOS version in App Store Connect
    1. In **Safari**, open [App Store Connect](https://appstoreconnect.apple.com)
    2. Click **Apps > Organize: Modern Labor Unions**
    3. Click the blue **+** button in the sidebar next to **iOS App** to show the  **New Version** dialog
    4. In the **Version** input, enter the new version number (e.g. `2.1.0`), then click **Create**
    5. Scroll down to the **What's new in This Version** field and enter: "Minor bug fixes and improvements"
    6. Scroll down the the **Build** section and click **Add Build**
    7. Select the build with the expected version number, then click **Done**
        - If the expected build version isn't present, you need to wait for Apple to
      finish analyzing the newly uploaded build. This could be up to 30 minutes after completing step 4 above. You'll receive an email once it's analyzed.
10. Update the iOS demo mode credentials
    1. Scroll down to the **App Review Information** section
    2. Update the **User name** field to be the *second* demo mode email
    3. Update the **Password** to be the *second* demo mode password
    4. Click **Save** in the top right corner
11. Start the iOS review process
    1. In the top right corner, click **Add for Review**
    2. Verify that the changes look correct
    3. Click **Submit to App Review**
12. Cleanup
    1. Close the demo mode credentials file opened in step 6 above
    2. Discard any uncommitted changes (app-release.aab file and the Xcode scheme changes)
    3. Re-enable developer settings by updating `ENABLE_DEVELOPER_SETTINGS` in `.env` to `true`
13. Wait until both reviews succeed
    - You'll receive email updates
14. Release the new Android version
    1. In **Chrome**, open the [Google Play Console](https://play.google.com/console/developers/?pli=1)
    2. Click **Organize: Modern Labor Unions > Publishing Overview > Publish \<n\> changes > Publish changes**
15. Release the new iOS version
    1. Open [App Store Connect](https://appstoreconnect.apple.com/) and log in if needed
    2. Click **Apps > Organize: Modern Labor Unions > Release this version > Release**
16. Rotate the demo mode credentials
    1. Use step 6 above to open the demo mode credentials file
    2. Use the password generator of your password manager to create new emails and passwords
    3. Close the file to save your changes and re-encrypt the file
    4. Create a new commit similar to https://github.com/High5Apps/organize-backend/commit/bea238f
    5. Deploy the changes with `bin/deploy org`