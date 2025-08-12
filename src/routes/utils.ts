export const parametrizeRouterURL = (url: string, params: Record<string, string>): string =>
    Object.keys(params).reduce((result, key) => result.replace(`:${key}`, params[key]), url);
