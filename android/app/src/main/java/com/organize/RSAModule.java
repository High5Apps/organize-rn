package com.organize;

import static android.security.keystore.KeyProperties.DIGEST_SHA256;
import static android.security.keystore.KeyProperties.PURPOSE_DECRYPT;
import static android.security.keystore.KeyProperties.PURPOSE_ENCRYPT;
import static com.organize.CommonCrypto.ANDROID_KEY_STORE_PROVIDER;
import static com.organize.CommonCrypto.fromBase64;
import static com.organize.CommonCrypto.fromUtf8;
import static com.organize.CommonCrypto.getPrivateKey;
import static com.organize.CommonCrypto.getPublicKey;
import static com.organize.CommonCrypto.logIsKeyInsideSecureHardware;
import static com.organize.CommonCrypto.toBase64;
import static com.organize.CommonCrypto.toUtf8;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class RSAModule extends ReactContextBaseJavaModule {
    private static final String CIPHER_TRANSFORMATION_NAME = "RSA/NONE/PKCS1Padding";
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

    @ReactMethod
    public void decrypt(String publicKeyId, String base64Ciphertext, Promise promise) {
        String message = null;
        try {
            message = decrypt(publicKeyId, base64Ciphertext);
        } catch (RSAException | IllegalBlockSizeException | BadPaddingException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }
        promise.resolve(message);
    }

    static String decrypt(String publicKeyId, String base64Ciphertext)
            throws RSAException, IllegalBlockSizeException, BadPaddingException {
        Cipher cipher = getCipher(Cipher.DECRYPT_MODE, publicKeyId);
        byte[] cipherBytes = fromBase64(base64Ciphertext);
        byte[] messageBytes = cipher.doFinal(cipherBytes);
        String message = toUtf8(messageBytes);
        return message;
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

    @ReactMethod
    public void encrypt(String publicKeyId, String message, Promise promise) {
        Cipher cipher;
        try {
            cipher = getCipher(Cipher.ENCRYPT_MODE, publicKeyId);
        } catch (RSAException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        byte[] ciphertextBytes;
        try {
            ciphertextBytes = cipher.doFinal(fromUtf8(message));
        } catch (BadPaddingException | IllegalBlockSizeException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        String ciphertext = toBase64(ciphertextBytes);
        promise.resolve(ciphertext);
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

    private static Cipher getCipher(int operationalMode, String publicKeyId) throws RSAException {
        if (operationalMode != Cipher.ENCRYPT_MODE && operationalMode != Cipher.DECRYPT_MODE) {
            throw new RSAException("Unsupported operational mode: " + operationalMode);
        }

        Key key;
        if (operationalMode == Cipher.ENCRYPT_MODE) {
            try {
                key = getPublicKey(publicKeyId);
            } catch (CertificateException
                     | IOException
                     | KeyStoreException
                     | NoSuchAlgorithmException e) {
                throw new RSAException("Failed to get public key for publicKeyId: " + publicKeyId);
            }
        } else {
            try {
                key = getPrivateKey(publicKeyId);
            } catch (CertificateException
                     | IOException
                     | KeyStoreException
                     | NoSuchAlgorithmException
                     | UnrecoverableEntryException
                     | CommonCrypto.CommonCryptoException e) {
                throw new RSAException("Failed to get private key for publicKeyId: " + publicKeyId);
            }
        }

        Cipher cipher;
        try {
            cipher = Cipher.getInstance(CIPHER_TRANSFORMATION_NAME);
            cipher.init(operationalMode, key);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException e) {
            throw new RSAException("Failed to initialize RSA cipher with operational mode: " + operationalMode);
        }

        return cipher;
    }

    static class RSAException extends Exception {
        public RSAException(String message) { super(message); }
    }
}
