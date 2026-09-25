import { expect, test } from 'vitest';
import XorHash from './xorhash';

test('Ensure XorHash can be used to differentiate varying strings', ()=>{
	const instrings = ["apple", "banana", "apricot", "pineapple", "lemon"];
	const outhashes = instrings.map(v => XorHash(v));

	// Check each hash is distinct.
	outhashes.forEach(v=>{
		// This is done by literally summing together the amount of matched hashes in the array.
		const copies = outhashes.reduce(w=>((w == v) ? 1 : 0), 0);
		expect( copies ).toBe(0);
	});
})