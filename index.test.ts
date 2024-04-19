import {describe, expect, test} from '@jest/globals';
import { validate } from './index';

describe('Main module', () => {

	describe('Giving invalid types', ()=>{
		test('Gives null to receive true', () => {
			expect(validate(null)).toBe(true);
		});
		test('Gives undefined to receive true', () => {
			expect(validate(undefined)).toBe(true);
		});
		test('Gives number to receive true', () => {
			expect(validate(4)).toBe(true);
		});
		test('Gives object to receive true', () => {
			expect(validate({hi: "Hello"})).toBe(true);
		});
	});
	describe('Giving invalid AWS::IAM::Role input', () => {
		test('Gives empty string to receive true', ()=>{
			expect(validate("")).toBe(true);
		});
		test('Gives empty object to receive true', ()=>{
			expect(validate("{}")).toBe(true);
		});
		test('Gives invalid policy object to receive true', ()=>{
			expect(validate('{"PolicyDocument": {}')).toBe(true);
		});
		test('Gives policy object with no Statements to receive true', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": []}}')).toBe(true);
		});
	});
	describe('Giving "valid" policy object', () => {
		test('Gives policy object with one Statement whose Resource exactly equals "*" to receive false', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "*"}]}}')).toBe(false);
		});
		test('Gives policy object with one Statement whose Resource starts with "*" to receive false', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "*test"}]}}')).toBe(false);
		});
		test('Gives policy object with one Statement whose Resource ends with "*" to receive false', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "test*"}]}}')).toBe(false);
		});
		test('Gives policy object with one Statement whose Resource contains "*" to receive false', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "te*st"}]}}')).toBe(false);
		});
		test('Gives policy object with one Statement whose Resource contains multiple "*" to receive true', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "te*s*t"}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "te**st"}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "**test"}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "test**"}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "**"}]}}')).toBe(true);
		});
		test('Gives policy object with one Statement whose Resource is an empty string to receive true', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": ""}]}}')).toBe(true);
		});
		test('Gives policy object with one Statement whose Resource is not a string to receive true', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": null}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": undefined}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": 5}]}}')).toBe(true);
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": {test: 1}}]}}')).toBe(true);
		});
		test('Gives policy object with multiple Statements and only one meets requirements to receive true', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "te*st"}, {"Resource: "**"}]}}')).toBe(true);
		});
		test('Gives policy object with multiple Statements where all meets requirements to receive false', ()=>{
			expect(validate('{"PolicyDocument": {"Statement": [{"Resource": "te*st"}, {"Resource": "*test"}]}}')).toBe(false);
		});
	});
});