import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './demoawspipeline-app-stack';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';//esto hace que se haga una aprovacion manual
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //AWS CI-CD Pipeline
    //const borrar='sfg'
    const democicdpipeline = new CodePipeline(this, 'demopipeline', 
    {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sevidprogramming/democicd20231004', 'main',
        {authentication: cdk.SecretValue.secretsManager("github-token-v4",{jsonField:"github-token-v4"})}),//nombre del repo
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ],
      }),    
    });

    const testingStage = democicdpipeline.addStage(new PipelineAppStage(this, 'test',{
      env: {account:'106946045071',region: 'us-east-1'}
    }));//esto crea el stage

    testingStage.addPost(new ManualApprovalStep('approval'));

    const prodStage = democicdpipeline.addStage( new PipelineAppStage(this, 'prod',{
      env: {account:'106946045071',region: 'us-east-1'}
    }));

  }
}
