package app.getorganize.organize;

import static app.getorganize.organize.CommonCrypto.ANDROID_KEY_STORE_PROVIDER;
import static app.getorganize.organize.CommonCrypto.fromBase64;
import static app.getorganize.organize.CommonCrypto.fromPemString;
import static app.getorganize.organize.CommonCrypto.fromUtf8;
import static app.getorganize.organize.CommonCrypto.getPrivateKey;
import static app.getorganize.organize.CommonCrypto.getPublicKeyPem;
import static app.getorganize.organize.CommonCrypto.logIsKeyInsideSecureHardware;
import static app.getorganize.organize.CommonCrypto.toBase64;
import static app.getorganize.organize.CommonCrypto.toPemString;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;

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

    @ReactMethod
    public void verify(String publicKeyString, String message, String signature, Promise promise) {
        try {
            Signature s = Signature.getInstance(SIGNATURE_ALGORITHM);
            PublicKey publicKey = fromPemString(publicKeyString);
            s.initVerify(publicKey);
            s.update(fromUtf8(message));
            byte[] signatureASN1 = convertFromRStoASN1(fromBase64(signature), P256_PARAMETER_SIZE);
            boolean isValid = s.verify(signatureASN1);
            promise.resolve(isValid);
        } catch (NoSuchAlgorithmException | InvalidKeyException | InvalidKeySpecException | SignatureException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    private byte[] convertFromRStoASN1(byte[] signature, int size) {
        // Verify that the signature is the correct length for the given algorithm
        if (signature.length != (size * 2)) {
            throw new IllegalArgumentException("Invalid signature.");
        }

        // r is the first half of the signature
        BigInteger r = new BigInteger(1, Arrays.copyOfRange(signature, 0, signature.length / 2));

        // s is the second half of the signature
        BigInteger s = new BigInteger(1, Arrays.copyOfRange(signature, signature.length / 2, signature.length));

        // vr and vs are the compacted ASN.1 integer encoding, same as BigInteger encoding
        byte[] rField = encodeIntField(r);
        byte[] sField = encodeIntField(s);

        ByteArrayOutputStream asn1DerSignature = new ByteArrayOutputStream();
        asn1DerSignature.write(0x30);

        // Add the length of the fields
        writeFieldLength(asn1DerSignature, rField.length + sField.length);

        // Write the fields
        asn1DerSignature.write(rField, 0, rField.length);
        asn1DerSignature.write(sField, 0, sField.length);

        return asn1DerSignature.toByteArray();
    }


    private byte[] encodeIntField(BigInteger i) {
        ByteArrayOutputStream field = new ByteArrayOutputStream();
        field.write(0x02);

        // Get this byte array for the asn1 encoded integer
        byte[] vi = i.toByteArray();

        // Write the length of the field
        writeFieldLength(field, vi.length);

        // Write the field value
        field.write(vi, 0, vi.length);

        return field.toByteArray();
    }

    private void writeFieldLength(ByteArrayOutputStream field, int length) {
        // If the length of vi is less then 0x80 we can fit the length in one byte
        if (length < 0x80) {
            field.write(length);
        } else {
            // Get the length as a byte array
            byte[] lengthBytes = BigInteger.valueOf(length).toByteArray();

            int lengthOfLengthBytes = lengthBytes.length;

            // The byte array might have a leading zero byte. If so we need to discard it
            if (lengthBytes[0] == 0) {
                lengthOfLengthBytes--;
            }

            // Write the continuation byte containing the length of length in bytes
            field.write(0x80 | lengthOfLengthBytes);

            // Write the field length bytes
            field.write(lengthBytes, lengthBytes.length - lengthOfLengthBytes, lengthOfLengthBytes);
        }
    }
}
