//
//  RSAModule.m
//  Organize
//
//  Created by Julian Tigler on 10/29/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RSAModule, NSObject)

RCT_EXTERN_METHOD(
  decrypt: (NSString *) publicKeyId
  base64EncryptedMessage: (NSString *) base64EncryptedMessage
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  deletePrivateKey: (NSString *) publicKeyId
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  encrypt: (NSString *) publicKeyId
  message: (NSString *) message
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  generateKeys: (NSString *) publicKeyId
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

@end
