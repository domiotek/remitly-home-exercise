
interface IProbableInput {
	PolicyName: string
	PolicyDocument: {
		Version: string
		Statement: {
			Sid?: string
			Effect: "Allow" | "Deny"
			Action: string[]
			Resource: string
		}[]
	}
}

/**
 * If you really wanted me to return false if Resource contains a single asterisk and true in ANY other case,
 * then brute forcing through the structure and checking all Statement.Resource is the fastest way.
 * 
 * This doesn't verify other fields of AWS::IAM::Role, but it doesn't have to. In this particular case, function
 * output depends strictly on this one condition.
 * 
 * At least that's how i undestood it. If not, I'm out 🤷‍♂️
 */


/**
 * Validates given input data as AWS::IAM::Role Policy against custom requirements.
 * @param input Input to test.
 * @returns false when all Resource fields contain single asterisk, true in ANY other case.
 */
export function validate(input: any): boolean {

	try {
		const parsedInput = JSON.parse(input) as IProbableInput;
		let passedCounter = 0;

		parsedInput.PolicyDocument.Statement.forEach(val=>{ 
			passedCounter += /^[^*]*[*]{1}[^*]*$/.test(val.Resource)?0:1;
		});

		if(passedCounter===0&&parsedInput.PolicyDocument.Statement.length>0) return false;
		else return true;

	} catch (error: unknown) {
		return true;
	}
}