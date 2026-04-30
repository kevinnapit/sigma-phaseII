import { z } from 'zod';

type SameKeys<TBase extends z.ZodRawShape, TNext extends z.ZodRawShape> =
	Exclude<keyof TBase, keyof TNext> extends never
		? Exclude<keyof TNext, keyof TBase> extends never
			? TNext
			: never
		: never;

export function extendSchemaShape<
	TShape extends z.ZodRawShape,
	TNext extends z.ZodRawShape
>(
	schema: z.ZodObject<TShape>,
	buildShape: (shape: Readonly<TShape>) => SameKeys<TShape, TNext>
) {
	return schema.extend(buildShape(schema.shape));
}
