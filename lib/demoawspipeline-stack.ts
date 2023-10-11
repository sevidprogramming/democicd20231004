import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //AWS CI-CD Pipeline
    const democicdpipeline = new CodePipeline(this, 'demopipeline', 
    {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sevidprogramming/democicd20231004', 'main',
        {authentication: cdk.SecretValue.secretsManager("github-token-v4")}),//nombre del repo
        commands: [
          'npm ci',
          'npm run build',
          'npm cdk synth',
        ],
      }),    
    });
  }
}
