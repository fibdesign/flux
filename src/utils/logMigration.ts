import { COLORS } from "../constants/COLORS";

export const logMigration = {
    start: (migrationName: string) => {
        console.log(`${COLORS.Cyan}Migrating: ${migrationName}${COLORS.Reset}`);
    },
    success: (message: string) => {
        console.log(`   ${COLORS.Green}✓ ${message}${COLORS.Reset}`);
    },
    info: (message: string) => {
        console.log(`   ${COLORS.Yellow}ℹ ${message}${COLORS.Reset}`);
    },
    error: (message: string) => {
        console.log(`   ${COLORS.Red}✗ ${message}${COLORS.Reset}`);
    }
};
