function omit(key: string, obj: Record<string, any>) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

export const ObjectUtils = {
  omit,
};