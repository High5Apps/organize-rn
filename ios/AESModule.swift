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
  static let AES_ERROR_CODE = "E_AES"
  static let KEY_ENCRYPTED_MESSAGE = "base64EncryptedMessage"
  static let KEY_INITIALIZATION_VECTOR = "base64InitializationVector"
  static let KEY_INTEGRITY_CHECK = "base64IntegrityCheck"
  static let KEY_STRENGTH_256_BIT_IN_BYTES = 256 / 8
  static let MESSAGE_DECRYPTION_FAILED = "[Unable to decrypt]"

  @objc
  static func requiresMainQueueSetup() -> Bool { false }

  @objc
  func decrypt(_ wrappedKey: String, wrapperKeyId: String, base64EncryptedMessage: String, base64InitializationVector: String, base64IntegrityCheck: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let symmetricKey = try? unwrapSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(Self.AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }
    
    let encryptedMessage = EncryptedMessage(base64EncryptedMessage, base64InitializationVector, base64IntegrityCheck)
    
    let message: String
    do {
      message = try decrypt(encryptedMessage, with: symmetricKey)
    } catch {
      reject(Self.AES_ERROR_CODE, error.localizedDescription, error)
      return
    }
    
    resolve(message)
  }
  
  @objc
  func decryptMany(_ wrappedKey: String, wrapperKeyId: String, encryptedMessages: NSArray, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let symmetricKey = try? unwrapSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(Self.AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }
    
    let messages: [String?] = encryptedMessages.map { element in
      guard nil == element as? NSNull else {
        return nil
      }

      guard let dictionary = element as? NSDictionary else {
        return Self.MESSAGE_DECRYPTION_FAILED
      }
      
      guard let encryptedMessage = EncryptedMessage(from: dictionary) else {
        return Self.MESSAGE_DECRYPTION_FAILED
      }
      
      guard let message = try? decrypt(encryptedMessage, with: symmetricKey) else {
        return Self.MESSAGE_DECRYPTION_FAILED
      }
      
      return message
    }
    
    resolve(messages)
  }
  
  @objc
  func decryptWithExposedKey(_ base64Key: String, base64EncryptedMessage: String, base64InitializationVector: String, base64IntegrityCheck: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let symmetricKey = try? getSymmetricKey(base64Key) else {
      reject(Self.AES_ERROR_CODE, "Failed to decode symmetric key", nil)
      return
    }
    
    let encryptedMessage = EncryptedMessage(base64EncryptedMessage, base64InitializationVector, base64IntegrityCheck)
    
    let message: String
    do {
      message = try decrypt(encryptedMessage, with: symmetricKey)
    } catch {
      reject(Self.AES_ERROR_CODE, error.localizedDescription, error)
      return
    }
    
    resolve(message)
  }

  @objc
  func encrypt(_ wrappedKey: String, wrapperKeyId: String, message: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let symmetricKey = try? unwrapSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(Self.AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }
    
    let encryptedMessage: EncryptedMessage
    do {
      encryptedMessage = try encrypt(message, with: symmetricKey)
    } catch {
      reject(Self.AES_ERROR_CODE, error.localizedDescription, error)
      return
    }
    
    resolve(encryptedMessage.dictionary)
  }
  
  @objc
  func encryptMany(_ wrappedKey: String, wrapperKeyId: String, messages: NSArray, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    guard let symmetricKey = try? unwrapSymmetricKey(wrappedKey, wrapperKeyId) else {
      reject(Self.AES_ERROR_CODE, "Failed to unwrap symmetric key", nil)
      return
    }
    
    let encryptedMessages: [EncryptedMessage]
    do {
      encryptedMessages = try messages.map { element in
        guard let message = element as? String else {
          throw AESError.runtimeError("Failed to convert message to String")
        }
        
        let encryptedMessage = try encrypt(message, with: symmetricKey)
        return encryptedMessage
      }
    } catch {
      reject(Self.AES_ERROR_CODE, error.localizedDescription, error)
      return
    }
    
    resolve(encryptedMessages.map({ encryptedMessage in
      encryptedMessage.dictionary
    }))
  }
  
  @objc
  func generateKey(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let data = Data((0 ..< Self.KEY_STRENGTH_256_BIT_IN_BYTES).map { _ in .random(in: .min ... .max) })
    resolve(data.base64EncodedString())
  }
  
  private func encrypt(_ message: String, with symmetricKey: SymmetricKey) throws -> EncryptedMessage {
    guard let messageData = message.data(using: .utf8) else {
      throw AESError.runtimeError("Failed to convert message into UTF-8 data")
    }

    guard let encryptedMessageData = try? AES.GCM.seal(messageData, using: symmetricKey) else {
      throw AESError.runtimeError("Failed to encrypt data")
    }
    
    let ciphertext = encryptedMessageData.ciphertext.base64EncodedString()
    let initializationVector = encryptedMessageData.nonce.dataRepresentation.base64EncodedString()
    let integrityCheck = encryptedMessageData.tag.base64EncodedString()
    
    return EncryptedMessage(ciphertext, initializationVector, integrityCheck)
  }
  
  private func unwrapSymmetricKey(_ wrappedKey: String, _ wrapperKeyId: String) throws -> SymmetricKey {
    guard let symmetricKeyBase64 = try? RSAModule.decrypt(wrapperKeyId, base64EncryptedMessage: wrappedKey) else {
      throw AESError.runtimeError("Failed to decrypt wrapped key")
    }
    
    guard let symmetricKey = try? getSymmetricKey(symmetricKeyBase64) else {
      throw AESError.runtimeError("Failed to create SymmetricKey from unwrapped key")
    }
    
    return symmetricKey
  }
  
  private func getSymmetricKey(_ base64Key: String) throws -> SymmetricKey {
    guard let symmetricKeyData = Data(base64Encoded: base64Key) else {
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
    
    var dictionary: [String: Any]? {
      guard let data = try? JSONEncoder().encode(self) else { return nil }
      return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap { $0 as? [String: Any] }
    }
    
    init(_ base64EncryptedMessage: String, _ base64InitializationVector: String, _ base64IntegrityCheck: String) {
      self.base64EncryptedMessage = base64EncryptedMessage
      self.base64InitializationVector = base64InitializationVector
      self.base64IntegrityCheck = base64IntegrityCheck
    }
    
    init?(from dictionary: NSDictionary) {
      guard let base64EncryptedMessage = dictionary.value(forKey: KEY_ENCRYPTED_MESSAGE) as? String,
            let base64InitializationVector = dictionary.value(forKey: KEY_INITIALIZATION_VECTOR) as? String,
            let base64IntegrityCheck = dictionary.value(forKey: KEY_INTEGRITY_CHECK) as? String else {
        return nil
      }
      self.init(base64EncryptedMessage, base64InitializationVector, base64IntegrityCheck)
    }
  }
}
