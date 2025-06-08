// types.js

export function getTypeName(value) {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'int';
    if (typeof value === 'boolean') return 'bool';
    if (value === undefined) return 'void';
    throw new Error('Unknown type: ' + value);
}
