package app.getorganize.organize;

import static android.os.Build.VERSION.SDK_INT;

import android.security.keystore.KeyInfo;
import android.util.Base64;
import android.util.Log;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableEntryException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;

class CommonCrypto {
    static  final String ANDROID_KEY_STORE_PROVIDER = "AndroidKeyStore";
    private static final String PEM_PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----\n";
    private static final String PEM_PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----\n";

    static void deletePrivateKey(String publicKeyId)
            throws CertificateException, IOException, KeyStoreException, NoSuchAlgorithmException {
        KeyStore keystore = getAndroidKeyStore();
        keystore.deleteEntry(publicKeyId);
    }

    static KeyStore getAndroidKeyStore()
            throws CertificateException, IOException, KeyStoreException, NoSuchAlgorithmException {
        KeyStore keystore = KeyStore.getInstance(ANDROID_KEY_STORE_PROVIDER);
        keystore.load(null);
        return keystore;
    }

    static PrivateKey getPrivateKey(String publicKeyId)
            throws CertificateException, IOException, KeyStoreException, NoSuchAlgorithmException,
            UnrecoverableEntryException, CommonCryptoException {
        KeyStore keystore = getAndroidKeyStore();
        KeyStore.Entry entry = keystore.getEntry(publicKeyId, null);
        if (!(entry instanceof KeyStore.PrivateKeyEntry)) {
            throw new CommonCryptoException("Not an instance of a PrivateKeyEntry");
        }

        return ((KeyStore.PrivateKeyEntry) entry).getPrivateKey();
    }

    static PublicKey getPublicKey(String publicKeyId)
            throws CertificateException, IOException, KeyStoreException, NoSuchAlgorithmException {
        KeyStore keystore = getAndroidKeyStore();
        Certificate certificate = keystore.getCertificate(publicKeyId);
        return certificate.getPublicKey();
    }

    static String getPublicKeyPem(String publicKeyId)
            throws CertificateException, IOException, KeyStoreException, NoSuchAlgorithmException {
        PublicKey publicKey = getPublicKey(publicKeyId);
        return toPemString(publicKey);
    }

    static void logIsKeyInsideSecureHardware(PrivateKey privateKey, String logTag) {
        if (SDK_INT < android.os.Build.VERSION_CODES.M) {
            Log.i(logTag, "isKeyInsideSecureHardware: unknown. SDK_INT is below M: " + SDK_INT);
            return;
        }

        try {
            KeyFactory factory = KeyFactory.getInstance(privateKey.getAlgorithm(), ANDROID_KEY_STORE_PROVIDER);
            KeyInfo keyInfo = factory.getKeySpec(privateKey, KeyInfo.class);
            boolean isInsideSecureHardware = keyInfo.isInsideSecureHardware();
            Log.i(logTag, "isKeyInsideSecureHardware: " + isInsideSecureHardware);
        } catch (NoSuchAlgorithmException | NoSuchProviderException | InvalidKeySpecException e) {
            Log.e(logTag, e.toString());
            Log.i(logTag, "isKeyInsideSecureHardware: unknown. An error prevented the determination");
        }
    }

    // Base 64 encode and trim whitespace
    static String toBase64(byte[] bytes) {
        String base64 = Base64.encodeToString(bytes, Base64.DEFAULT);
        return base64.replaceAll("\\s", "");
    }

    static byte[] fromBase64(String message) {
        return Base64.decode(message, Base64.DEFAULT);
    }

    static String toUtf8(byte[] bytes) {
        return new String(bytes, StandardCharsets.UTF_8);
    }

    static byte[] fromUtf8(String message) {
        return message.getBytes(StandardCharsets.UTF_8);
    }

    static String toPemString(PublicKey publicKey) {
        byte[] keyBytes = publicKey.getEncoded();
        String publicKeyBase64 = Base64.encodeToString(keyBytes, Base64.DEFAULT);
        String publicKeyPem = PEM_PUBLIC_KEY_HEADER + publicKeyBase64 + PEM_PUBLIC_KEY_FOOTER;
        return publicKeyPem;
    }

    static class CommonCryptoException extends Exception {
        public CommonCryptoException(String message) { super(message); }
    }
}
