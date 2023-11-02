package com.organize;

import static com.organize.CommonCrypto.fromBase64;
import static com.organize.CommonCrypto.fromUtf8;
import static com.organize.CommonCrypto.toBase64;
import static com.organize.CommonCrypto.toUtf8;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.AlgorithmParameterSpec;
import java.util.Arrays;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AESModule extends ReactContextBaseJavaModule {
    private static final String CIPHER_ALGORITHM_NAME = "AES";
    private static final String CIPHER_TRANSFORMATION_NAME = "AES/GCM/NoPadding";
    private static final String KEY_ENCRYPTED_MESSAGE = "base64EncryptedMessage";
    private static final String KEY_INITIALIZATION_VECTOR = "base64InitializationVector";
    private static final String KEY_INTEGRITY_CHECK = "base64IntegrityCheck";
    private static final String MODULE_NAME = "AESModule";

    private static final int INTEGRITY_CHECK_LENGTH_BYTES = 16;

    AESModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void decrypt(
            String wrappedKey,
            String wrapperKeyId,
            String base64EncryptedMessage,
            String base64InitializationVector,
            String base64IntegrityCheck,
            Promise promise) {
        SecretKey secretKey;
        try {
            secretKey = unwrapSecretKey(wrappedKey, wrapperKeyId);
        } catch (IllegalBlockSizeException | RSAModule.RSAException | BadPaddingException e) {
            Log.e(getName(), e.toString());
            promise.reject(e);
            return;
        }

        String message;
        try {
            message = decrypt(secretKey, base64EncryptedMessage, base64InitializationVector, base64IntegrityCheck);
        } catch (IllegalBlockSizeException | BadPaddingException | AESException e) {
            Log.e(getName(), e.toString());
            promise.reject(e);
            return;
        }
        promise.resolve(message);
    }

    @ReactMethod
    public void encrypt(String wrappedKey, String wrapperKeyId, String message, Promise promise) {
        SecretKey secretKey;
        try {
            secretKey = unwrapSecretKey(wrappedKey, wrapperKeyId);
        } catch (IllegalBlockSizeException | RSAModule.RSAException | BadPaddingException e) {
            Log.e(getName(), e.toString());
            promise.reject(e);
            return;
        }

        Cipher cipher;
        try {
            cipher = getCipher(Cipher.ENCRYPT_MODE, secretKey);
        } catch (AESException e) {
            Log.e(getName(), e.toString());
            promise.reject(e);
            return;
        }

        byte[] messageBytes = fromUtf8(message);
        byte[] ciphertextAndIntegrityCheck;
        try {
            ciphertextAndIntegrityCheck = cipher.doFinal(messageBytes);
        } catch (BadPaddingException | IllegalBlockSizeException e) {
            Log.e(getName(), e.toString());
            promise.reject(new AESException("Failed to encrypt message: " + message));
            return;
        }

        int totalLength = ciphertextAndIntegrityCheck.length;
        int ciphertextLength = totalLength - INTEGRITY_CHECK_LENGTH_BYTES;
        byte[] ciphertext = Arrays.copyOfRange(ciphertextAndIntegrityCheck, 0, ciphertextLength);
        byte[] integrityCheck = Arrays.copyOfRange(ciphertextAndIntegrityCheck, ciphertextLength, totalLength);

        byte[] initializationVector = cipher.getIV();

        WritableMap resultMap = new WritableNativeMap();
        resultMap.putString(KEY_ENCRYPTED_MESSAGE, toBase64(ciphertext));
        resultMap.putString(KEY_INITIALIZATION_VECTOR, toBase64(initializationVector));
        resultMap.putString(KEY_INTEGRITY_CHECK, toBase64(integrityCheck));
        promise.resolve(resultMap);
    }

    private GCMParameterSpec getSpec(String base64InitializationVector) {
        byte[] initializationVector = fromBase64(base64InitializationVector);
        return new GCMParameterSpec(INTEGRITY_CHECK_LENGTH_BYTES * 8, initializationVector);
    }

    private Cipher getCipher(
            int operationalMode,
            SecretKey secretKey,
            AlgorithmParameterSpec maybeSpec)
            throws AESException {
        Cipher cipher;
        try {
            cipher = Cipher.getInstance(CIPHER_TRANSFORMATION_NAME);
            cipher.init(operationalMode, secretKey, maybeSpec);
        } catch (NoSuchAlgorithmException
                 | NoSuchPaddingException
                 | InvalidKeyException
                 | InvalidAlgorithmParameterException e) {
            Log.e(getName(), e.toString());
            throw new AESException("Failed to initialize AES cipher");
        }

        return cipher;
    }

    private Cipher getCipher(int operationalMode, SecretKey secretKey)
            throws AESException {
        return getCipher(operationalMode, secretKey, null);
    }

    private SecretKey unwrapSecretKey(String wrappedKey, String wrapperKeyId)
            throws IllegalBlockSizeException, RSAModule.RSAException, BadPaddingException {
        String symmetricKeyBase64 = RSAModule.decrypt(wrapperKeyId, wrappedKey);
        byte[] symmetricKey = fromBase64(symmetricKeyBase64);
        return new SecretKeySpec(symmetricKey, CIPHER_ALGORITHM_NAME);
    }

    private String decrypt(
            SecretKey secretKey,
            String base64EncryptedMessage,
            String base64InitializationVector,
            String base64IntegrityCheck)
            throws IllegalBlockSizeException, BadPaddingException, AESException {
        byte[] ciphertext = fromBase64(base64EncryptedMessage);
        byte[] integrityCheck = fromBase64(base64IntegrityCheck);
        byte[] ciphertextAndIntegrityCheck = concatenate(ciphertext, integrityCheck);

        GCMParameterSpec gcmSpec = getSpec(base64InitializationVector);
        Cipher cipher = getCipher(Cipher.DECRYPT_MODE, secretKey, gcmSpec);
        byte[] messageBytes = cipher.doFinal(ciphertextAndIntegrityCheck);
        return toUtf8(messageBytes);
    }

    private byte[] concatenate(byte[] a, byte[] b) {
        byte[] result = new byte[a.length + b.length];
        System.arraycopy(a, 0, result, 0, a.length);
        System.arraycopy(b, 0, result, a.length, b.length);
        return result;
    }

    private static class AESException extends Exception {
        public AESException(String message) { super(message); }
    }
}
