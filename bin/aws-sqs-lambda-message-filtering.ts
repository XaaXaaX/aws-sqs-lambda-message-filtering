#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsSqsLambdaMessageFilteringStack } from '../lib/aws-sqs-lambda-message-filtering-stack';

const app = new cdk.App();
new AwsSqsLambdaMessageFilteringStack(app, 'AwsSqsLambdaMessageFilteringStack', {});