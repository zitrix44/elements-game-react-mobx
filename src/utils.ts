export const env = (key: string): string => {
    return import.meta.env[key]?.trim() || '';
};
export const envString = env;
export const envNumber = (key: string): number => {
    return parseFloat(envString(key)) || 0;
};
// Bun https://github.com/oven-sh/bun/issues/9877
// FIXME: add "VITE_" prefix
export const envBroken = envString('THIS_VARIABLE_EXISTS') === '' || (envString('THIS_VARIABLE_EXISTS_IN_DEV_AND_PROD') === '' && envString('THIS_VARIABLE_EXISTS_ON_TEST') === ''); 
if (envBroken) {
    try {
        console.info(`envBroken: "${envString('THIS_VARIABLE_EXISTS')}" (at .env), "${envString('THIS_VARIABLE_EXISTS_IN_DEV_AND_PROD')}" (at .env.production / .env.development), "${envString('THIS_VARIABLE_EXISTS_ON_TEST')}" (at .env.test)`);
        console.error('envBroken');
        console.dir(import.meta);
    } catch(_er) {}
}