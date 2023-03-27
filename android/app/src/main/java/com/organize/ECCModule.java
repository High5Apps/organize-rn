package com.organize;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PublicKey;
import java.security.UnrecoverableEntryException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.spec.ECGenParameterSpec;

public class ECCModule extends ReactContextBaseJavaModule {
    private String ANDROID_KEY_STORE_PROVIDER = "AndroidKeyStore";
    private String P256_CURVE = "secp256r1";
    private String PEM_PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----\n";
    private String PEM_PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----\n";
    private String MODULE_NAME = "ECCModule";

    ECCModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    public void generateKeys(String publicKeyId, Promise promise) {
        KeyPairGenerator keyPairGenerator = null;

        try {
            keyPairGenerator = KeyPairGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_EC, ANDROID_KEY_STORE_PROVIDER);
            KeyGenParameterSpec es256Spec = new KeyGenParameterSpec.Builder(
                    publicKeyId, KeyProperties.PURPOSE_SIGN)
                    .setAlgorithmParameterSpec(new ECGenParameterSpec(P256_CURVE))
                    .setDigests(KeyProperties.DIGEST_SHA256)
                    .build();
            keyPairGenerator.initialize(es256Spec);
        } catch (NoSuchAlgorithmException
                | InvalidAlgorithmParameterException
                | NoSuchProviderException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        String publicKeyPem = toPemString(keyPair.getPublic());
        promise.resolve(publicKeyPem);
    }

    @ReactMethod
    public void deletePrivateKey(String publicKeyId, Promise promise) {
        try {
            KeyStore keystore = getAndroidKeyStore();
            keystore.deleteEntry(publicKeyId);
        } catch (KeyStoreException
                | CertificateException
                | IOException
                | NoSuchAlgorithmException e) {
            e.printStackTrace();
            promise.reject(e);
        }
        promise.resolve(true);
    }

    @ReactMethod
    public void getPublicKey(String publicKeyId, Promise promise) {
        PublicKey publicKey = null;
        try {
            KeyStore keystore = getAndroidKeyStore();
            Certificate certificate = keystore.getCertificate(publicKeyId);
            publicKey = certificate.getPublicKey();
        } catch (KeyStoreException
                | CertificateException
                | IOException
                | NoSuchAlgorithmException e) {
            e.printStackTrace();
            promise.reject(e);
        }

        String publicKeyPem = toPemString(publicKey);
        promise.resolve(publicKeyPem);
    }

    private KeyStore getAndroidKeyStore() throws KeyStoreException, CertificateException,
            IOException, NoSuchAlgorithmException {
        KeyStore keystore = KeyStore.getInstance(ANDROID_KEY_STORE_PROVIDER);
        keystore.load(null);
        return keystore;
    }

    private String toPemString(PublicKey publicKey) {
        byte[] keyBytes = publicKey.getEncoded();
        String publicKeyBase64 = Base64.encodeToString(keyBytes, Base64.DEFAULT);
        String publicKeyPem = PEM_PUBLIC_KEY_HEADER + publicKeyBase64 + PEM_PUBLIC_KEY_FOOTER;
        return publicKeyPem;
    }
}
