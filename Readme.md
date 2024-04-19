# Remitly Home exercise
#### Internship 2024


### Description
Write a method verifying the input JSON data. Input data format is defined as AWS::IAM::Role Policy - definition and example [(AWS IAM Role JSON definition and example)](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-role-policy.html). Input JSON might be read from a file. 

Method should return logical false if an input JSON Resource field contains a single asterisk and true in any other case.


### How to run
Repository comes with the tests written to evaluate results of the method calls.

To run them, execute all commands below in given order inside root of repository:

###### Install dependencies
`npm i`

###### Run tests
`npm test`