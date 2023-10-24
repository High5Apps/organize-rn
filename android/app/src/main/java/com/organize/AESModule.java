package com.organize;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AESModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "AESModule";

    AESModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void encrypt(String wrappedKey, String wrapperKeyId, String message, Promise promise) {
        Log.d(getName(), wrappedKey);
        Log.d(getName(), wrapperKeyId);
        promise.resolve(message);
    }
}
