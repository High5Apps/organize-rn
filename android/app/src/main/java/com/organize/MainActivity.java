package com.organize;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Organize";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Required by React Navigation 6
    super.onCreate(null);
  }
}
