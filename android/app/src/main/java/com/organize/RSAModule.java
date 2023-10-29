package com.organize;

import static android.security.keystore.KeyProperties.DIGEST_SHA256;
import static android.security.keystore.KeyProperties.PURPOSE_DECRYPT;
import static android.security.keystore.KeyProperties.PURPOSE_ENCRYPT;

import static com.organize.CommonCrypto.ANDROID_KEY_STORE_PROVIDER;
import static com.organize.CommonCrypto.logIsKeyInsideSecureHardware;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PublicKey;

public class RSAModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RSAModule";
    private static final int KEY_SIZE = 2048;

    RSAModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    public void generateKeys(String publicKeyId, Promise promise) {
        KeyPairGenerator keyPairGenerator;
        try {
            keyPairGenerator = KeyPairGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_RSA,
                    ANDROID_KEY_STORE_PROVIDER);
            KeyGenParameterSpec rsa2048Spec = new KeyGenParameterSpec.Builder(
                    publicKeyId, PURPOSE_ENCRYPT | PURPOSE_DECRYPT)
                    .setKeySize(KEY_SIZE)
                    .setDigests(DIGEST_SHA256)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
                    .setSignaturePaddings(KeyProperties.SIGNATURE_PADDING_RSA_PKCS1)
                    .build();
            keyPairGenerator.initialize(rsa2048Spec);
        } catch (NoSuchAlgorithmException | NoSuchProviderException |
                 InvalidAlgorithmParameterException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        logIsKeyInsideSecureHardware(keyPair.getPrivate(), getName());
        promise.resolve(null);
    }
}
