//
//  AESModule.m
//  Organize
//
//  Created by Julian Tigler on 10/24/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(AESModule, NSObject)

RCT_EXTERN_METHOD(
  decrypt: (NSString *) wrappedKey
  wrapperKeyId: (NSString *) wrapperKeyId
  base64EncryptedMessage: (NSString *) base64EncryptedMessage
  base64InitializationVector: (NSString *) base64InitializationVector
  base64IntegrityCheck: (NSString *) base64IntegrityCheck
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  decryptMany: (NSString *) wrappedKey
  wrapperKeyId: (NSString *) wrapperKeyId
  encryptedMessages: (NSArray *) encryptedMessages
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  decryptWithExposedKey: (NSString *) base64Key
  base64EncryptedMessage: (NSString *) base64EncryptedMessage
  base64InitializationVector: (NSString *) base64InitializationVector
  base64IntegrityCheck: (NSString *) base64IntegrityCheck
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  encrypt: (NSString *) wrappedKey
  wrapperKeyId: (NSString *) wrapperKeyId
  message: (NSString *) message
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  encryptMany: (NSString *) wrappedKey
  wrapperKeyId: (NSString *) wrapperKeyId
  messages: (NSArray *) messages
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  generateKey: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

@end

