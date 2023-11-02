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
    guard let symmetricKey = try? getSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }
    
    let encryptedMessage = EncryptedMessage(base64EncryptedMessage, base64InitializationVector, base64IntegrityCheck)
    
    let message: String
    do {
      message = try decrypt(encryptedMessage, with: symmetricKey)
    } catch {
      reject(AES_ERROR_CODE, error.localizedDescription, error)
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
  
  private func decrypt(_ message: EncryptedMessage, with symmetricKey: SymmetricKey) throws -> String {
    guard let ciphertextData = Data(base64Encoded: message.base64EncryptedMessage) else {
      throw AESError.runtimeError("Failed to decode base64EncryptedMessage into data")
    }
    
    guard let nonceData = Data(base64Encoded: message.base64InitializationVector) else {
      throw AESError.runtimeError("Failed to decode base64InitializationVector")
    }
    
    guard let nonce = try? AES.GCM.Nonce(data: nonceData) else {
      throw AESError.runtimeError("Failed to parse nonce from base64InitializationVector")
    }
    
    guard let tagData = Data(base64Encoded: message.base64IntegrityCheck) else {
      throw AESError.runtimeError("Failed to decode base64IntegrityCheck")
    }
    
    guard let sealedBox = try? AES.GCM.SealedBox(nonce: nonce, ciphertext: ciphertextData, tag: tagData) else {
      throw AESError.runtimeError("Failed to create SealedBox")
    }
    
    guard let messageData = try? AES.GCM.open(sealedBox, using: symmetricKey) else {
      throw AESError.runtimeError("Failed to open SealedBox data")
    }

    guard let message = String(data: messageData, encoding: .utf8) else {
      throw AESError.runtimeError("Failed to encode message data to UTF-8")
    }
    
    return message
  }
  
  enum AESError: Error {
      case runtimeError(String)
  }
  
  private struct EncryptedMessage: Codable {
    let base64EncryptedMessage: String
    let base64InitializationVector: String
    let base64IntegrityCheck: String
    
    init(_ base64EncryptedMessage: String, _ base64InitializationVector: String, _ base64IntegrityCheck: String) {
      self.base64EncryptedMessage = base64EncryptedMessage
      self.base64InitializationVector = base64InitializationVector
      self.base64IntegrityCheck = base64IntegrityCheck
    }
  }
}
