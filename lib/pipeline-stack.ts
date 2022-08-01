import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { WorkshopPipelineStage } from './pipeline-stage';

export class WorkshopPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        
        const repo = new codecommit.Repository(this, 'WorkshopRepo', {
            repositoryName: "WorkshopRepo"
        });
        
        //basic pipeline declaration. This sets initial struture of pipeline
        const pipeline = new CodePipeline(this, 'Pipeline', {
           pipelineName: 'WorkshopPipeline',
           synth: new CodeBuildStep('SynthStep', {
               input: CodePipelineSource.codeCommit(repo, 'master'),
               installCommands: [
                    'npm install -g aws-cdk'   
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
           })
        });
        
        const deploy = new WorkshopPipelineStage(this, 'Deploy');
        const deployStage = pipeline.addStage(deploy);
    }
}