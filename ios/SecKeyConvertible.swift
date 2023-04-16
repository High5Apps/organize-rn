//
//  SecKeyConvertible.swift
//  Organize
//
//  Created by Julian Tigler on 3/23/23.
//

import Foundation
import CryptoKit

/// The interface needed for SecKey conversion.
protocol SecKeyConvertible: CustomStringConvertible {

  /// Creates a key from an X9.63 representation.
  init<Bytes>(x963Representation: Bytes) throws where Bytes: ContiguousBytes

  /// An X9.63 representation of the key.
  var x963Representation: Data { get }
}

extension SecKeyConvertible {

  /// A string version of the key for visual inspection.
  /// IMPORTANT: Never log the actual key data.
  public var description: String {
    return self.x963Representation.withUnsafeBytes { bytes in
      return "Key representation contains \(bytes.count) bytes."
    }
  }
}

// Assert that the NIST keys are convertible.
extension P256.Signing.PrivateKey: SecKeyConvertible {}