//
//  KeyStoreError.swift
//  Organize
//
//  Created by Julian Tigler on 3/23/23.
//

import Foundation

/// An error we can throw when something goes wrong.
struct KeyStoreError: Error, CustomStringConvertible {
  var message: String

  init(_ message: String) {
    self.message = message
  }

  public var description: String {
    return message
  }
}

extension OSStatus {

  /// A human readable message for the status.
  var message: String {
    return (SecCopyErrorMessageString(self, nil) as String?) ?? String(self)
  }
}
