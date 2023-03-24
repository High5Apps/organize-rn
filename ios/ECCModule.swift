//
//  ECCModule.swift
//  Organize
//
//  Created by Julian Tigler on 3/23/23.
//

import Foundation
import CryptoKit

@objc(ECCModule)
class ECCModule: NSObject {
  let ECC_ERROR_CODE = "E_ECC"

  @objc
  static func requiresMainQueueSetup() -> Bool { false }

  @objc
  func generateKeys(_ publicKeyId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let publicKeyPem: String
    if SecureEnclave.isAvailable {
      print("Generating P256 keys with SecureEnclave")

      guard let privateKey = try? SecureEnclave.P256.Signing.PrivateKey() else {
        reject(ECC_ERROR_CODE, "Failed to create SecureEnclave PrivateKey", nil)
        return
      }

      do {
        try GenericPasswordStore().storeKey(privateKey, label: publicKeyId)
      } catch {
        reject(ECC_ERROR_CODE, "Failed to store SecureEnclave PrivateKey in Keychain", error)
        return
      }

      publicKeyPem = privateKey.publicKey.pemRepresentation
    } else {
      print("Generating P256 keys without SecureEnclave")

      let privateKey = P256.Signing.PrivateKey()
      do {
        try SecKeyStore().storeKey(privateKey, label: publicKeyId)
      } catch {
        reject(ECC_ERROR_CODE, "Failed to store PrivateKey in Keychain", error)
        return
      }

      publicKeyPem = privateKey.publicKey.pemRepresentation
    }

    resolve(publicKeyPem)
  }
  
  @objc
  func deletePrivateKey(_ publicKeyId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    if SecureEnclave.isAvailable {
      print("Deleting SecureEnclave P256 private key with ID \(publicKeyId)")
      
      do {
        try GenericPasswordStore().deleteKey(label: publicKeyId)
      } catch {
        reject(ECC_ERROR_CODE, "Failed to delete SecureEnclave PrivateKey from Keychain", error)
        return
      }

    } else {
      print("Deleting P256 public key with ID \(publicKeyId)")
      
      do {
        try SecKeyStore().deleteKey(label: publicKeyId)
      } catch {
        reject(ECC_ERROR_CODE, "Failed to delete PrivateKey from Keychain", error)
        return
      }
    }
    
    resolve(true)
  }
  
  @objc
  func getPublicKey(_ publicKeyId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let publicKeyPem: String
    if SecureEnclave.isAvailable {
      print("Getting SecureEnclave P256 public key with ID \(publicKeyId)")
      
      do {
        guard let privateKey: SecureEnclave.P256.Signing.PrivateKey = try GenericPasswordStore().readKey(label: publicKeyId) else {
          reject(ECC_ERROR_CODE, "Failed to find SecureEnclave PrivateKey in Keychain", nil)
          return
        }
        publicKeyPem = privateKey.publicKey.pemRepresentation
      } catch {
        reject(ECC_ERROR_CODE, "Failed to get SecureEnclave PrivateKey from Keychain", error)
        return
      }

    } else {
      print("Getting P256 public key with ID \(publicKeyId)")
      
      do {
        guard let privateKey: P256.Signing.PrivateKey = try SecKeyStore().readKey(label: publicKeyId) else {
          reject(ECC_ERROR_CODE, "Failed to find PrivateKey in Keychain", nil)
          return
        }
        publicKeyPem = privateKey.publicKey.pemRepresentation
      } catch {
        reject(ECC_ERROR_CODE, "Failed to find PrivateKey in Keychain", error)
        return
      }
    }
    
    resolve(publicKeyPem)
  }
}
