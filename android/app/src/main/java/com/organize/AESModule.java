package com.organize;

import static com.organize.CommonCrypto.fromBase64;
import static com.organize.CommonCrypto.fromUtf8;
import static com.organize.CommonCrypto.toBase64;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

public class AESModule extends ReactContextBaseJavaModule {
    private static final String CIPHER_ALGORITHM_NAME = "AES";
    private static final String CIPHER_TRANSFORMATION_NAME = "AES/GCM/NoPadding";
    private static final String MODULE_NAME = "AESModule";
    private static final String RETURN_KEY_ENCRYPTED_MESSAGE = "base64EncryptedMessage";
    private static final String RETURN_KEY_INITIALIZATION_VECTOR = "base64InitializationVector";
    private static final String RETURN_KEY_INTEGRITY_CHECK = "base64IntegrityCheck";

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
    public void encrypt(String wrappedKey, String wrapperKeyId, String message, Promise promise) {
        Cipher cipher;
        try {
            cipher = getCipher(Cipher.ENCRYPT_MODE, wrappedKey, wrapperKeyId);
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
        resultMap.putString(RETURN_KEY_ENCRYPTED_MESSAGE, toBase64(ciphertext));
        resultMap.putString(RETURN_KEY_INITIALIZATION_VECTOR, toBase64(initializationVector));
        resultMap.putString(RETURN_KEY_INTEGRITY_CHECK, toBase64(integrityCheck));
        promise.resolve(resultMap);
    }

    private Cipher getCipher(int operationalMode, String wrappedKey, String wrapperKeyId)
            throws AESException {
        String symmetricKeyBase64;
        try {
            symmetricKeyBase64 = RSAModule.decrypt(wrapperKeyId, wrappedKey);
        } catch (RSAModule.RSAException | IllegalBlockSizeException | BadPaddingException e) {
            throw new AESException("Failed to decrypt wrappedKey " + wrappedKey);
        }

        byte[] symmetricKey = fromBase64(symmetricKeyBase64);
        SecretKey secretKey = new SecretKeySpec(symmetricKey, CIPHER_ALGORITHM_NAME);

        Cipher cipher;
        try {
            cipher = Cipher.getInstance(CIPHER_TRANSFORMATION_NAME);
            cipher.init(operationalMode, secretKey);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException e) {
            Log.e(getName(), e.toString());
            throw new AESException("Failed to initialize AES cipher");
        }

        return cipher;
    }

    private static class AESException extends Exception {
        public AESException(String message) { super(message); }
    }
}
