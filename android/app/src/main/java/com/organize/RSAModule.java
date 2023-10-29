package com.organize;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RSAModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RSAModule";

    RSAModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void generateKeys(String publicKeyId, Promise promise) {
        promise.resolve(publicKeyId);
    }
}
