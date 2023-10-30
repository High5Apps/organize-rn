//
//  RSAModule.swift
//  Organize
//
//  Created by Julian Tigler on 10/29/23.
//

import Foundation

@objc(RSAModule)
class RSAModule: NSObject {
  static let KEY_SIZE = 2048
  static let RSA_ALGORITHM: SecKeyAlgorithm = .rsaEncryptionOAEPSHA256

  let MIN_PLAIN_TEXT_TO_BLOCK_SIZE_DIFFERENCE_BYTES = 130
  let RSA_ERROR_CODE = "E_RSA"

  @objc
  static func requiresMainQueueSetup() -> Bool { false }
  
  @objc
  func decrypt(_ publicKeyId: String, base64EncryptedMessage: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let message: String

    do {
      message = try Self.decrypt(publicKeyId, base64EncryptedMessage: base64EncryptedMessage)
    } catch {
      reject(RSA_ERROR_CODE, "Failed to decrypt message", error)
      return
    }

    resolve(message)
  }
  
  @objc
  static func decrypt(_ publicKeyId: String, base64EncryptedMessage: String) throws -> String {
    guard let privateKey = try? getPrivateKey(publicKeyId) else {
      throw RSAError.runtimeError("Failed to fetch RSA private key")
    }

    guard SecKeyIsAlgorithmSupported(privateKey, .decrypt, RSA_ALGORITHM) else {
      throw RSAError.runtimeError("RSA decryption algorithm not supported")
    }

    guard let cipherTextData = Data(base64Encoded: base64EncryptedMessage), cipherTextData.count == SecKeyGetBlockSize(privateKey) else {
      throw RSAError.runtimeError("Failed to decode base64EncryptedMessage into data")
    }

    var unmanagedError: Unmanaged<CFError>?
    guard let messageData = SecKeyCreateDecryptedData(privateKey, RSA_ALGORITHM, cipherTextData as CFData, &unmanagedError) as Data? else {
      let error = unmanagedError!.takeRetainedValue() as Error
      print(error)
      throw RSAError.runtimeError("Failed to decrypt message")
    }
    
    guard let message = String(data: messageData, encoding: .utf8) else {
      throw RSAError.runtimeError("Failed to encode message data into UTF-8")
    }
    
    return message
  }
  
  @objc
  func deletePrivateKey(_ publicKeyId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    guard let attributes = try? Self.queryAttributes(publicKeyId) else {
      reject(RSA_ERROR_CODE, "Failed to create query attributes", nil)
      return
    }
    
    DispatchQueue.global(qos: .userInitiated).async {
      let status : OSStatus = SecItemDelete(attributes as CFDictionary)

      guard status == errSecSuccess else {
        reject(self.RSA_ERROR_CODE, "Failed to delete RSA PrivateKey. Status: \(status)", nil)
        return
      }
      
      resolve(true)
    }
  }
  
  @objc
  func encrypt(_ publicKeyId: String, message: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let privateKey = try? Self.getPrivateKey(publicKeyId) else {
      reject(RSA_ERROR_CODE, "Failed to fetch RSA private key", nil)
      return
    }
    
    guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
      reject(RSA_ERROR_CODE, "Failed to get RSA public key from RSA private key", nil)
      return
    }

    guard SecKeyIsAlgorithmSupported(publicKey, .encrypt, Self.RSA_ALGORITHM) else {
      reject(RSA_ERROR_CODE, "RSA encryption algorithm not supported", nil)
      return
    }

    guard (message.count < (SecKeyGetBlockSize(publicKey) - MIN_PLAIN_TEXT_TO_BLOCK_SIZE_DIFFERENCE_BYTES)) else {
      reject(RSA_ERROR_CODE, "RSA plaintext was too large compared to block size", nil)
      return
    }
    
    guard let messageData = message.data(using: .utf8) else {
      reject(RSA_ERROR_CODE, "Failed to convert message into UTF-8 data", nil)
      return
    }

    var unmanagedError: Unmanaged<CFError>?
    guard let cipherText = SecKeyCreateEncryptedData(publicKey, Self.RSA_ALGORITHM, messageData as CFData, &unmanagedError) as Data? else {
      let error = unmanagedError!.takeRetainedValue() as Error
      reject(RSA_ERROR_CODE, "Failed to encrypt message", error)
      return
    }

    resolve(cipherText.base64EncodedString())
  }

  @objc
  func generateKeys(_ publicKeyId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {    
    guard let tag = publicKeyId.data(using: .utf8) else {
      reject(RSA_ERROR_CODE, "Failed to convert tag into UTF-8 data", nil)
      return
    }
    
    let attributes: [String: Any] = [
      kSecClass as String: kSecClassKey,
      kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
      kSecAttrKeySizeInBits as String: Self.KEY_SIZE,
      kSecPrivateKeyAttrs as String: [
        kSecAttrIsPermanent as String: true,
        kSecAttrApplicationTag as String: tag
      ]
    ]
    
    var unmanagedError: Unmanaged<CFError>?
    guard SecKeyCreateRandomKey(attributes as CFDictionary, &unmanagedError) != nil else {
      let error = unmanagedError!.takeRetainedValue() as Error
      reject(RSA_ERROR_CODE, "Failed to store RSA PrivateKey in Keychain", error)
      return
    }

    resolve(nil)
  }
  
  private static func queryAttributes(_ publicKeyId: String) throws -> [String: Any] {
    guard let tag = publicKeyId.data(using: .utf8) else {
      throw RSAError.runtimeError("Failed to convert tag into UTF-8 data")
    }

    return [
      kSecClass as String: kSecClassKey,
      kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
      kSecAttrKeySizeInBits as String: KEY_SIZE,
      kSecAttrApplicationTag as String: tag,
      
      // Only required by encrypt/decrypt
      kSecReturnRef as String: true,
    ]
  }
  
  private static func getPrivateKey(_ publicKeyId: String) throws -> SecKey {
    guard let attributes = try? queryAttributes(publicKeyId) else {
      throw RSAError.runtimeError("Failed to create query attributes")
    }
    
    var item: CFTypeRef?
    let status = SecItemCopyMatching(attributes as CFDictionary, &item)
    guard status == errSecSuccess else {
      throw RSAError.runtimeError("Failed to fetch RSA key")
    }

    let privateKey = item as! SecKey
    return privateKey
  }
  
  enum RSAError: Error {
      case runtimeError(String)
  }
}
