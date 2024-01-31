export const isValidLimit = (value: string) => /^\d+$/.test(value);
export const isValidPage = (value: string) => /^[1-9]\d*$/.test(value);
