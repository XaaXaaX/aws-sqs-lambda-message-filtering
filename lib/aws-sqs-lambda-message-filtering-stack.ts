import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaFunction } from './lambda-reource';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { join, resolve } from 'path';
import { FilterCriteria, FilterRule } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class AwsSqsLambdaMessageFilteringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new Queue(this, 'FirstQueue', {
      visibilityTimeout: cdk.Duration.seconds(30)
    });

    const firstFunc = new LambdaFunction(this, 'FirstLambdaFunction', {
      entry: resolve(join(__dirname, './handler/index2.ts'))
    });

    const secondFunc = new LambdaFunction(this, 'SecondLambdaFunction', {
      entry: resolve(join(__dirname, './handler/index.ts'))
    });

    const thirdFunc = new LambdaFunction(this, 'ThirdLambdaFunction', {
      entry: resolve(join(__dirname, './handler/index.ts'))
    });

    queue.grantConsumeMessages(firstFunc);
    queue.grantConsumeMessages(secondFunc);
    queue.grantConsumeMessages(thirdFunc);

    firstFunc.addEventSource(new SqsEventSource(queue, {
      batchSize: 5,
      enabled: true,
      filters: [
        FilterCriteria.filter({ 
          body: {
            isProductSynchroEvent: FilterRule.isEqual('true'),
            // type: FilterRule.isEqual("product.synchro")

          }
        }),
      ],
    }));

    secondFunc.addEventSource(new SqsEventSource(queue, {
      batchSize: 5,
      enabled: true,
      filters: [
        FilterCriteria.filter({ 
          body: {
            isProductStockEvent: FilterRule.isEqual('true'),
            // type: FilterRule.isEqual("product.stock")
          }
        }),
      ],
    }));

    thirdFunc.addEventSource(new SqsEventSource(queue, {
      batchSize: 5,
      enabled: true,
      filters: [
        FilterCriteria.filter({ 
          body: {
            isProductTransitEvent: FilterRule.isEqual('true'),
            // type: FilterRule.isEqual("product.transited")
          }
        }),
      ],
    }));
  }
}
