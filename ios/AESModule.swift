//
//  AESModule.swift
//  Organize
//
//  Created by Julian Tigler on 10/24/23.
//

import Foundation
import CryptoKit

@objc(AESModule)
class AESModule: NSObject {
  let AES_ERROR_CODE = "E_AES"
  let RETURN_KEY_ENCRYPTED_MESSAGE = "base64EncryptedMessage"
  let RETURN_KEY_INITIALIZATION_VECTOR = "base64InitializationVector"
  let RETURN_KEY_INTEGRITY_CHECK = "base64IntegrityCheck"

  @objc
  static func requiresMainQueueSetup() -> Bool { false }

  @objc
  func decrypt(_ wrappedKey: String, wrapperKeyId: String, base64EncryptedMessage: String, base64InitializationVector: String, base64IntegrityCheck: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let ciphertextData = Data(base64Encoded: base64EncryptedMessage) else {
      reject(AES_ERROR_CODE, "Failed to decode base64EncryptedMessage into data", nil)
      return
    }
    
    guard let nonceData = Data(base64Encoded: base64InitializationVector) else {
      reject(AES_ERROR_CODE, "Failed to decode base64InitializationVector", nil)
      return
    }
    
    guard let nonce = try? AES.GCM.Nonce(data: nonceData) else {
      reject(AES_ERROR_CODE, "Failed to parse nonce from base64InitializationVector", nil)
      return
    }
    
    guard let tagData = Data(base64Encoded: base64IntegrityCheck) else {
      reject(AES_ERROR_CODE, "Failed to decode base64IntegrityCheck", nil)
      return
    }
    
    guard let sealedBox = try? AES.GCM.SealedBox(nonce: nonce, ciphertext: ciphertextData, tag: tagData) else {
      reject(AES_ERROR_CODE, "Failed to create SealedBox", nil)
      return
    }
    
    guard let symmetricKey = try? getSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }
    
    guard let messageData = try? AES.GCM.open(sealedBox, using: symmetricKey) else {
      reject(AES_ERROR_CODE, "Failed to open SealedBox data", nil)
      return
    }

    guard let message = String(data: messageData, encoding: .utf8) else {
      reject(AES_ERROR_CODE, "Failed to encode message data to UTF-8", nil)
      return
    }
    
    resolve(message)
  }

  @objc
  func encrypt(_ wrappedKey: String, wrapperKeyId: String, message: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let messageData = message.data(using: .utf8) else {
      reject(AES_ERROR_CODE, "Failed to convert message into UTF-8 data", nil)
      return
    }

    guard let symmetricKey = try? getSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }

    guard let encryptedMessageData = try? AES.GCM.seal(messageData, using: symmetricKey) else {
      reject(AES_ERROR_CODE, "Failed to encrypt data", nil)
      return
    }
    
    let ciphertext = encryptedMessageData.ciphertext.base64EncodedString()
    let initializationVector = encryptedMessageData.nonce.dataRepresentation.base64EncodedString()
    let integrityCheck = encryptedMessageData.tag.base64EncodedString()
    
    resolve([
      RETURN_KEY_ENCRYPTED_MESSAGE: ciphertext,
      RETURN_KEY_INITIALIZATION_VECTOR: initializationVector,
      RETURN_KEY_INTEGRITY_CHECK: integrityCheck,
    ]);
  }
  
  private func getSymmetricKey(_ wrappedKey: String, _ wrapperKeyId: String) throws -> SymmetricKey {
    guard let symmetricKeyBase64 = try? RSAModule.decrypt(wrapperKeyId, base64EncryptedMessage: wrappedKey) else {
      throw AESError.runtimeError("Failed to decrypt wrapped key")
    }
    
    guard let symmetricKeyData = Data(base64Encoded: symmetricKeyBase64) else {
      throw AESError.runtimeError("Failed to decode base64EncryptedMessage into data")
    }
    
    return SymmetricKey(data: symmetricKeyData)
  }
  
  enum AESError: Error {
      case runtimeError(String)
  }
}
