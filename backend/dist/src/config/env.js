import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.preprocess((val) => {
        if (typeof val === 'string')
            return parseInt(val, 10);
        if (typeof val === 'number')
            return val;
        return 3003;
    }, z.number().int().min(1)),
    DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL est requis' }),
    JWT_SECRET: z.string().min(1, { message: 'JWT_SECRET est requis' }),
    JWT_REFRESH_SECRET: z.string().min(1, { message: 'JWT_REFRESH_SECRET est requis' }),
});
export const config = (() => {
    try {
        return envSchema.parse(process.env);
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            // Affiche toutes les erreurs de validation
            console.error('Erreur de configuration des variables d\'environnement :');
            for (const issue of err.issues) {
                console.error(`- ${issue.path.join('.')} : ${issue.message}`);
            }
            process.exit(1);
        }
        throw err;
    }
})();
//# sourceMappingURL=env.js.map