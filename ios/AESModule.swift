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
  func encrypt(_ wrappedKey: String, wrapperKeyId: String, message: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let symmetricKeyBase64 = try? RSAModule.decrypt(wrapperKeyId, base64EncryptedMessage: wrappedKey) else {
      reject(AES_ERROR_CODE, "Failed to decrypt wrapped key", nil)
      return
    }
    
    guard let symmetricKeyData = Data(base64Encoded: symmetricKeyBase64) else {
      reject(AES_ERROR_CODE, "Failed to decode base64EncryptedMessage into data", nil)
      return
    }
    
    guard let messageData = message.data(using: .utf8) else {
      reject(AES_ERROR_CODE, "Failed to convert message into UTF-8 data", nil)
      return
    }

    let symmetricKey = SymmetricKey(data: symmetricKeyData)
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
}
