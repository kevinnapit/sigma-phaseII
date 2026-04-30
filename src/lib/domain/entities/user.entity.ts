// User entity - pure business logic
export class UserEntity {
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly email?: string,
		public readonly name?: string
	) {}

	get displayName(): string {
		return this.name || this.username;
	}

	get initials(): string {
		if (this.name) {
			return this.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		return this.username.slice(0, 2).toUpperCase();
	}
}
