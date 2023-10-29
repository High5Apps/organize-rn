package com.organize;

import static com.organize.CommonCrypto.ANDROID_KEY_STORE_PROVIDER;
import static com.organize.CommonCrypto.fromUtf8;
import static com.organize.CommonCrypto.getPrivateKey;
import static com.organize.CommonCrypto.getPublicKeyPem;
import static com.organize.CommonCrypto.logIsKeyInsideSecureHardware;
import static com.organize.CommonCrypto.toBase64;
import static com.organize.CommonCrypto.toPemString;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;
import java.security.spec.ECGenParameterSpec;

public class ECCModule extends ReactContextBaseJavaModule {
    private static final String P256_CURVE = "secp256r1";
    private static final String MODULE_NAME = "ECCModule";
    private static final String SIGNATURE_ALGORITHM = "SHA256withECDSA";
    private static final int P256_PARAMETER_SIZE = 32;

    ECCModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void deletePrivateKey(String publicKeyId, Promise promise) {
        try {
            CommonCrypto.deletePrivateKey(publicKeyId);
        } catch (KeyStoreException
                 | CertificateException
                 | IOException
                 | NoSuchAlgorithmException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }
        promise.resolve(true);
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
        logIsKeyInsideSecureHardware(keyPair.getPrivate(), getName());
        String publicKeyPem = toPemString(keyPair.getPublic());
        promise.resolve(publicKeyPem);
    }

    @ReactMethod
    public void getPublicKey(String publicKeyId, Promise promise) {
        String publicKeyPem;
        try {
            publicKeyPem = getPublicKeyPem(publicKeyId);
        } catch (KeyStoreException
                | CertificateException
                | IOException
                | NoSuchAlgorithmException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(publicKeyPem);
    }

    @ReactMethod
    public void sign(String publicKeyId, String message, Promise promise) {
        byte[] signature;
        try {
            PrivateKey privateKey = getPrivateKey(publicKeyId);
            Signature s = Signature.getInstance(SIGNATURE_ALGORITHM);
            s.initSign(privateKey);
            s.update(fromUtf8(message));
            byte[] signatureASN1 = s.sign();
            signature = convertFromASN1toRS(signatureASN1, P256_PARAMETER_SIZE);
        } catch (KeyStoreException
                 | CertificateException
                 | CommonCrypto.CommonCryptoException
                 | IOException
                 | NoSuchAlgorithmException
                 | UnrecoverableEntryException
                 | InvalidKeyException
                 | SignatureException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(toBase64(signature));
    }

    private static byte[] convertFromASN1toRS(byte[] signatureASN1, int size) {
        // Get start and length
        int sequenceR = 2;
        int lengthR = signatureASN1[sequenceR + 1];
        int startR = sequenceR + 2;

        int sequenceS = sequenceR + lengthR + 2;
        int lengthS = signatureASN1[sequenceS + 1];
        int startS = sequenceS + 2;

        // Get offset
        int srcOffsetR = startR;
        int countR = size;
        int dstOffsetR = 0;
        if (lengthR > size) {
            srcOffsetR += lengthR - size;
        } else if (lengthR < size) {
            dstOffsetR += size - lengthR;
            countR -= dstOffsetR;
        }

        int srcOffsetS = startS;
        int countS = size;
        int dstOffsetS = 0;
        if (lengthS > size) {
            srcOffsetS += lengthS - size;
        } else if (lengthS < size) {
            dstOffsetS += size - lengthS;
            countS -= dstOffsetS;
        }

        // Concatenate
        byte[] rs = new byte[2 * size];
        System.arraycopy(signatureASN1, srcOffsetR, rs, dstOffsetR, countR);
        System.arraycopy(signatureASN1, srcOffsetS, rs, dstOffsetR + countR + dstOffsetS, countS);

        return rs;
    }
}
