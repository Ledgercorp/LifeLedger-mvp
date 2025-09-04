export const newToken = () => crypto.randomUUID().replace(/-/g,'');
export const newSlug = () => Math.random().toString(36).slice(2,8);
