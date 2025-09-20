export interface IMigrationColumn {
    name: string,
    type: string,
    options?: {
        unique?: boolean,
        primary?: boolean,
        nullable?: boolean,
        default?: any,
    }
}