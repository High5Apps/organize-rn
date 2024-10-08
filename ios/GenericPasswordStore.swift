//
//  GenericPasswordStore.swift
//  Organize
//
//  Created by Julian Tigler on 3/23/23.
//

import Foundation
import CryptoKit
import Security

struct GenericPasswordStore {

  /// Stores a CryptoKit key in the keychain as a generic password.
  func storeKey<T: GenericPasswordConvertible>(_ key: T, label: String) throws {

    // Treat the key data as a generic password.
    let query = [
      kSecClass: kSecClassGenericPassword,
      kSecAttrAccount: label,
      kSecAttrAccessible: kSecAttrAccessibleWhenUnlocked,
      kSecUseDataProtectionKeychain: true,
      kSecValueData: key.rawRepresentation
    ] as [String: Any]

    // Add the key data.
    let status = SecItemAdd(query as CFDictionary, nil)
    guard status == errSecSuccess else {
      throw KeyStoreError("Unable to store item: \(status.message)")
    }
  }

  /// Reads a CryptoKit key from the keychain as a generic password.
  func readKey<T: GenericPasswordConvertible>(label: String) throws -> T? {

      // Seek a generic password with the given account.
      let query = [
        kSecClass: kSecClassGenericPassword,
        kSecAttrAccount: label,
        kSecUseDataProtectionKeychain: true,
        kSecReturnData: true,
      ] as [String: Any]

      // Find and cast the result as data.
      var item: CFTypeRef?
      switch SecItemCopyMatching(query as CFDictionary, &item) {
      case errSecSuccess:
        guard let data = item as? Data else { return nil }
        return try T(rawRepresentation: data)  // Convert back to a key.
      case errSecItemNotFound: return nil
      case let status: throw KeyStoreError("Keychain read failed: \(status.message)")
      }
  }

  /// Removes any existing key with the given account.
  func deleteKey(label: String) throws {
      let query = [
        kSecClass: kSecClassGenericPassword,
        kSecUseDataProtectionKeychain: true,
        kSecAttrAccount: label,
      ] as [String: Any]
      switch SecItemDelete(query as CFDictionary) {
      case errSecItemNotFound, errSecSuccess: break // Okay to ignore
      case let status:
        throw KeyStoreError("Unexpected deletion error: \(status.message)")
      }
  }
}
