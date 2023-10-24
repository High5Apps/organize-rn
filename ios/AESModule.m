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
  encrypt: (NSString *) wrappedKey
  wrapperKeyId: (NSString *) wrapperKeyId
  message: (NSString *) message
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

@end

