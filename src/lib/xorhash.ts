// Fast, simple string hasher function. Possibly prone to collisions
export default function XorHash(subject : string) : number {
	let o = 0;
	for (let i = 0; i < subject.length; i++) {
		o ^= subject.codePointAt(i) ?? 0;
	}
	return o;
}