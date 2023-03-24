//
//  ECCModule.m
//  Organize
//
//  Created by Julian Tigler on 3/23/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ECCModule, NSObject)

RCT_EXTERN_METHOD(
  generateKeys: (NSString *) publicKeyId
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

RCT_EXTERN_METHOD(
  getPublicKey: (NSString *) publicKeyId
  resolver: (RCTPromiseResolveBlock) resolve
  rejecter: (RCTPromiseRejectBlock) reject
);

@end
