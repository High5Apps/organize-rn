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
}
