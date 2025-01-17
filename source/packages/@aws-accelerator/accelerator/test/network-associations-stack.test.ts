/**
 *  Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import * as path from 'path';

import { AcceleratorStackNames } from '../lib/accelerator';
import { AcceleratorStage } from '../lib/accelerator-stage';
import { AcceleratorStackProps } from '../lib/stacks/accelerator-stack';
import { NetworkAssociationsStack } from '../lib/stacks/network-associations-stack';
import {
  ACCOUNT_CONFIG,
  GLOBAL_CONFIG,
  IAM_CONFIG,
  NETWORK_CONFIG,
  ORGANIZATION_CONFIG,
  SECURITY_CONFIG,
} from './configs/test-config';

const testNamePrefix = 'Construct(NetworkAssociationsStack): ';

/**
 * NetworkAssociationsStack
 */
const app = new cdk.App({
  context: { 'config-dir': path.join(__dirname, 'configs') },
});
const configDirPath = app.node.tryGetContext('config-dir');

const env = {
  account: '333333333333',
  region: 'us-east-1',
};

const props: AcceleratorStackProps = {
  env,
  configDirPath,
  accountsConfig: ACCOUNT_CONFIG,
  globalConfig: GLOBAL_CONFIG,
  iamConfig: IAM_CONFIG,
  networkConfig: NETWORK_CONFIG,
  organizationConfig: ORGANIZATION_CONFIG,
  securityConfig: SECURITY_CONFIG,
  partition: 'aws',
};

const stack = new NetworkAssociationsStack(
  app,
  `${AcceleratorStackNames[AcceleratorStage.NETWORK_ASSOCIATIONS]}-${env.account}-${env.region}`,
  props,
);

/**
 * NetworkAssociationsStack construct test
 */
describe('NetworkAssociationsStack', () => {
  /**
   * Number of Lambda function resource test
   */
  test(`${testNamePrefix} Lambda function resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
  });

  /**
   * Number of Lambda function IAM role resource test
   */
  test(`${testNamePrefix} Lambda function IAM role resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
  });

  /**
   * Number of SSM parameter resource test
   */
  test(`${testNamePrefix} SSM parameter resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::SSM::Parameter', 2);
  });

  /**
   * Number of TransitGatewayRouteTablePropagation resource test
   */
  test(`${testNamePrefix} TransitGatewayRouteTablePropagation resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::EC2::TransitGatewayRouteTablePropagation', 3);
  });

  /**
   * Number of TransitGatewayRouteTableAssociation resource test
   */
  test(`${testNamePrefix} TransitGatewayRouteTablePropagation resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::EC2::TransitGatewayRouteTableAssociation', 1);
  });

  /**
   * Number of GetTransitGatewayAttachment custom resource test
   */
  test(`${testNamePrefix} GetTransitGatewayAttachment custom resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('Custom::GetTransitGatewayAttachment', 1);
  });

  /**
   * Cloudformation parameters resource configuration test
   */
  test(`${testNamePrefix} Cloudformation parameters resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValueacceleratornetworktransitGatewaysMainidC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Default: '/accelerator/network/transitGateways/Main/id',
          Type: 'AWS::SSM::Parameter::Value<String>',
        },
        SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablescoreidC96584B6F00A464EAD1953AFF4B05118Parameter:
          {
            Default: '/accelerator/network/transitGateways/Main/routeTables/core/id',
            Type: 'AWS::SSM::Parameter::Value<String>',
          },
        SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablessegregatedidC96584B6F00A464EAD1953AFF4B05118Parameter:
          {
            Default: '/accelerator/network/transitGateways/Main/routeTables/segregated/id',
            Type: 'AWS::SSM::Parameter::Value<String>',
          },
        SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablessharedidC96584B6F00A464EAD1953AFF4B05118Parameter:
          {
            Default: '/accelerator/network/transitGateways/Main/routeTables/shared/id',
            Type: 'AWS::SSM::Parameter::Value<String>',
          },
        SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablesstandaloneidC96584B6F00A464EAD1953AFF4B05118Parameter:
          {
            Default: '/accelerator/network/transitGateways/Main/routeTables/standalone/id',
            Type: 'AWS::SSM::Parameter::Value<String>',
          },
      },
    });
  });

  /**
   * Lambda function CustomGetTransitGatewayAttachmentCustomResourceProviderHandler resource configuration test
   */
  test(`${testNamePrefix} Lambda function CustomGetTransitGatewayAttachmentCustomResourceProviderHandler resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        CustomGetTransitGatewayAttachmentCustomResourceProviderHandler7E079354: {
          Type: 'AWS::Lambda::Function',
          DependsOn: ['CustomGetTransitGatewayAttachmentCustomResourceProviderRoleA6A22C3D'],
          Properties: {
            Code: {
              S3Bucket: 'cdk-hnb659fds-assets-333333333333-us-east-1',
            },
            Handler: '__entrypoint__.handler',
            MemorySize: 128,
            Role: {
              'Fn::GetAtt': ['CustomGetTransitGatewayAttachmentCustomResourceProviderRoleA6A22C3D', 'Arn'],
            },
            Runtime: 'nodejs14.x',
            Timeout: 900,
          },
        },
      },
    });
  });

  /**
   * Lambda function IAM role CustomGetTransitGatewayAttachmentCustomResourceProviderRole resource configuration test
   */
  test(`${testNamePrefix} Lambda function IAM role CustomGetTransitGatewayAttachmentCustomResourceProviderRole resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        CustomGetTransitGatewayAttachmentCustomResourceProviderRoleA6A22C3D: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'lambda.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
            ManagedPolicyArns: [
              {
                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              },
            ],
            Policies: [
              {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: ['sts:AssumeRole'],
                      Effect: 'Allow',
                      Resource: '*',
                    },
                  ],
                  Version: '2012-10-17',
                },
                PolicyName: 'Inline',
              },
            ],
          },
        },
      },
    });
  });

  /**
   * SSM parameter SsmParamStackId resource configuration test
   */
  test(`${testNamePrefix} SSM parameter SsmParamStackId resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        SsmParamStackId521A78D3: {
          Type: 'AWS::SSM::Parameter',
          Properties: {
            Name: '/accelerator/AWSAccelerator-NetworkAssociationsStack-333333333333-us-east-1/stack-id',
            Type: 'String',
            Value: {
              Ref: 'AWS::StackId',
            },
          },
        },
      },
    });
  });

  /**
   * TransitGatewayRouteTablePropagation TestCorePropagation resource configuration test
   */
  test(`${testNamePrefix} TransitGatewayRouteTablePropagation TestCorePropagation resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        TestCorePropagationB97A6DBD: {
          Type: 'AWS::EC2::TransitGatewayRouteTablePropagation',
          Properties: {
            TransitGatewayAttachmentId: {
              Ref: 'TestVpcTransitGatewayAttachmentA903FB56',
            },
            TransitGatewayRouteTableId: {
              Ref: 'SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablescoreidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
          },
        },
      },
    });
  });

  /**
   * TransitGatewayRouteTablePropagation TestSegregatedPropagation resource configuration test
   */
  test(`${testNamePrefix} TransitGatewayRouteTablePropagation TestSegregatedPropagation resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        TestSegregatedPropagationCA3F8CD1: {
          Type: 'AWS::EC2::TransitGatewayRouteTablePropagation',
          Properties: {
            TransitGatewayAttachmentId: {
              Ref: 'TestVpcTransitGatewayAttachmentA903FB56',
            },
            TransitGatewayRouteTableId: {
              Ref: 'SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablessegregatedidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
          },
        },
      },
    });
  });

  /**
   * TransitGatewayRouteTableAssociation TestSharedAssociation resource configuration test
   */
  test(`${testNamePrefix} TransitGatewayRouteTableAssociation TestSharedAssociation resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        TestSharedAssociation1890469B: {
          Type: 'AWS::EC2::TransitGatewayRouteTableAssociation',
          Properties: {
            TransitGatewayAttachmentId: {
              Ref: 'TestVpcTransitGatewayAttachmentA903FB56',
            },
            TransitGatewayRouteTableId: {
              Ref: 'SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablessharedidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
          },
        },
      },
    });
  });

  /**
   * TransitGatewayRouteTablePropagation TestSharedPropagation resource configuration test
   */
  test(`${testNamePrefix} TransitGatewayRouteTablePropagation TestSharedPropagation resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        TestSharedPropagation66A144ED: {
          Type: 'AWS::EC2::TransitGatewayRouteTablePropagation',
          Properties: {
            TransitGatewayAttachmentId: {
              Ref: 'TestVpcTransitGatewayAttachmentA903FB56',
            },
            TransitGatewayRouteTableId: {
              Ref: 'SsmParameterValueacceleratornetworktransitGatewaysMainrouteTablessharedidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
          },
        },
      },
    });
  });

  /**
   * GetTransitGatewayAttachment TestVpcTransitGatewayAttachment resource configuration test
   */
  test(`${testNamePrefix} GetTransitGatewayAttachment TestVpcTransitGatewayAttachment resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        TestVpcTransitGatewayAttachmentA903FB56: {
          Type: 'Custom::GetTransitGatewayAttachment',
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
          Properties: {
            ServiceToken: {
              'Fn::GetAtt': ['CustomGetTransitGatewayAttachmentCustomResourceProviderHandler7E079354', 'Arn'],
            },
            name: 'Test',
            roleArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::222222222222:role/AWSAccelerator-DescribeTgwAttachRole-us-east-1',
                ],
              ],
            },
            transitGatewayId: {
              Ref: 'SsmParameterValueacceleratornetworktransitGatewaysMainidC96584B6F00A464EAD1953AFF4B05118Parameter',
            },
          },
        },
      },
    });
  });
});
