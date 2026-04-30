export interface ServiceConfig {
	name: string;
	source: string;
	outputDir?: string; // Optional override, defaults to src/lib/generated/<name>
}

const buildServiceConfig = (): ServiceConfig[] => {
	const auth_spec = process.env.PUBLIC_AUTH_API_URL ?? 'http://localhost:8080';
	const team2_spec = process.env.PUBLIC_T2_API_URL ?? 'http://localhost:3003';
	const notif_spec = process.env.PUBLIC_NOTIFICATION_API_URL ?? 'http://localhost:3000';
	return [
		{
			name: 'auth',
			source: `${auth_spec}/openapi.json`,
			outputDir: './src/lib/generated/auth'
		},
		{
			name: 'administration_and_agronomy',
			source: `${team2_spec}/openapi.json`,
			outputDir: './src/lib/generated/administration_and_agronomy'
		},
		{
			name: 'notification',
			source: `${notif_spec}/openapi.json`,
			outputDir: './src/lib/generated/notification'
		}
	];
};

export const services: ServiceConfig[] = buildServiceConfig();

export const defaultConfig = {
	baseOutputDir: './src/lib/generated',
	typesFile: 'openapi.gen.d.ts',
	schemasFile: 'schemas.gen.ts'
};
