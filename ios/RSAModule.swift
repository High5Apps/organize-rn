//
//  RSAModule.swift
//  Organize
//
//  Created by Julian Tigler on 10/29/23.
//

import Foundation

@objc(RSAModule)
class RSAModule: NSObject {
  let KEY_SIZE = 2048
  let RSA_ERROR_CODE = "E_RSA"

  @objc
  static func requiresMainQueueSetup() -> Bool { false }

  @objc
  func generateKeys(_ publicKeyId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {    
    guard let tag = publicKeyId.data(using: .utf8) else {
      reject(RSA_ERROR_CODE, "Failed to convert tag into UTF-8 data", nil)
      return
    }
    
    let attributes: [String: Any] = [
      kSecClass as String: kSecClassKey,
      kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
      kSecAttrKeySizeInBits as String: KEY_SIZE,
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
}
