//
//  AESModule.swift
//  Organize
//
//  Created by Julian Tigler on 10/24/23.
//

import Foundation

@objc(AESModule)
class AESModule: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool { false }

  @objc
  func encrypt(_ wrappedKey: String, wrapperKeyId: String, message: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    print("wrappedKey: \(wrappedKey)")
    print("wrapperKeyId: \(wrapperKeyId)")
    resolve(message)
  }
}
