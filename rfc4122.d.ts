declare class RFC4122 {
    constructor(prng?: Math);
	v1(): string;
	v3(namespace: string, name: string): string;
	v4(): string;
	v4f(): string;
	v5(namespace: string, name: string): string;
}

export = RFC4122;
