import {IFunctionNode, IMigrationNode, IRouteEnv, TFluxASTNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {executeEmit} from "./execute.emit";
import {executeType} from "./execute.type";
import {executeAssignment} from "./execute.assignment";
import {evaluateLiteral} from "./evaluate.literal";
import {evaluateBinaryExpression} from "./evaluate.binary.expression";
import {evaluateIdentifier} from "./evaluate.identifier";
import {HTTPServer} from "../../utils/server/HTTPServer";
import {IFluxVariable} from "../../types/IFluxVariable";
import {TFluxValue} from "../../types/TFluxValue";
import {evaluateFunctionCall} from "./evaluate.function.call";
import {executeFunction} from "./execute.function";
import {executeFluxFunction} from "./execute.flux.function";
import {evaluateTemplate} from "./evaluate.template";
import {executeRouter} from "./execute.router";
import {evaluateObjectLiteral} from "./evaluate.object.literal";
import {customTypesRegistry} from "../../utils/customTypesRegistry";
import {IMacro} from "../../types/IMacro";
import {evaluateMacro} from "./evaluate.macro";
import {evaluateMacroCall} from "./evaluate.macro.call";
import {evaluateMemberExpression} from "./evaluate.member.expression";
import {Database} from "../../database";
import {executeMigration} from "./execute.migration";
import {IMigration} from "../../types/IMigration";

export class Interpreter {
    private AST: TFluxASTNode[] = []
    public ENV: Record<string, IFluxVariable> = {}
    public Functions: Record<string, IFunctionNode> = {};
    public Routes: IRouteEnv[] = [];
    public Macros: IMacro;
    public Database: Database | undefined;
    public Migrations: IMigration[] = [];

    constructor() {
        this.ENV = {};
        this.Functions = {};
        this.Routes = [];
        this.Macros = {
            current_request: null,
        }
    }

    run(ast: TFluxASTNode[]) {
        this.AST = ast;
        for (const node of this.AST) {
            this.execute(node)
        }
    }
    async initDatabase(){
        this.Database = new Database();
        await this.Database.init();
    }

    async serve() {
        if ('boot' in this.Functions){
            executeFluxFunction(this, 'boot');
        }

        await this.initDatabase()

        if ('beforeServe' in this.Functions){
            executeFluxFunction(this, 'beforeServe');
        }

        const server = new HTTPServer(this)
        await server.listen()

        if ('ready' in this.Functions){
            executeFluxFunction(this, 'ready');
        }
    }

    execute(node: TFluxASTNode) {
        switch (node.type) {
            case AST_TYPES.EMIT: executeEmit(this, node);break;
            case AST_TYPES.EXPRESSION_STATEMENT: this.evaluate(node.expression);break;
            case AST_TYPES.TYPE: executeType(this, node);break;
            case AST_TYPES.ASSIGNMENT: executeAssignment(this, node);break;
            case AST_TYPES.FUNCTION: executeFunction(this,node);break;
            case AST_TYPES.ROUTER: executeRouter(this,node);break;
            case AST_TYPES.MIGRATION: executeMigration(this,node);break;
            case AST_TYPES.RETURN: return {__fluxReturn: this.evaluate(node.value)}
        }
    }

    evaluate(expression: TFluxASTNode): TFluxValue {
        if (expression.type === AST_TYPES.LITERAL) {
            return evaluateLiteral(expression)
        }
        if (expression.type === AST_TYPES.BINARY_EXPRESSION) {
            return evaluateBinaryExpression(this,expression)
        }
        if (expression.type === AST_TYPES.IDENTIFIER) {
            return evaluateIdentifier(this,expression)
        }
        if (expression.type === AST_TYPES.FUNCTION_CALL){
            return evaluateFunctionCall(this,expression)
        }
        if (expression.type === AST_TYPES.TEMPLATE_LITERAL){
            return evaluateTemplate(this, expression)
        }
        if (expression.type === 'fluxReq'){
            return expression;
        }
        if (expression.type === AST_TYPES.OBJECT_LITERAL){
            return evaluateObjectLiteral(this,expression)
        }
        if (expression.type === AST_TYPES.MACRO){
            return evaluateMacro(this, expression)
        }
        if (expression.type === AST_TYPES.MACRO_CALL){
            return evaluateMacroCall(this, expression)
        }
        if (expression.type === AST_TYPES.MEMBER_EXPRESSION){
            return evaluateMemberExpression(this,expression)
        }
        FluxErrorHandler.error(`Unknown expression type: ${expression.type}`)
    }

    checkTypeMatch(actualValue: TFluxValue, declared: IFluxVariable): boolean {
        const expected = declared.type.value;

        if (actualValue === null){
            return declared.nullable;
        }

        if (customTypesRegistry[expected]) {
            return customTypesRegistry[expected](actualValue);
        }

        if (typeof actualValue === 'object' && expected === 'object') return true;
        if (typeof actualValue === 'string' && expected === 'string') return true;
        if (typeof actualValue === 'number' && expected === 'int') return true;
        if (typeof actualValue === 'boolean' && expected === 'bool') return true;

        return false;
    }

    private getSortedMigrations(): IMigration[] {
        const executed = new Set<string>();
        const sorted: IMigration[] = [];
        const migrationsMap: Record<string, IMigration> = {};

        // 1. Build a name → node map
        for (const migration of this.Migrations) {
            migrationsMap[migration.name] = migration;
        }

        // 2. Recursive visit function
        const visit = (migration: IMigration, visiting = new Set<string>()) => {
            if (executed.has(migration.name)) return; // already added
            if (visiting.has(migration.name)) {
                throw new Error(`Circular dependency detected at migration: ${migration.name}`);
            }

            visiting.add(migration.name);

            for (const depName of migration.dependencies) {
                const depMigration = migrationsMap[depName];
                if (!depMigration) {
                    throw new Error(`Missing dependency: ${depName} for migration ${migration.name}`);
                }
                visit(depMigration, visiting);
            }

            visiting.delete(migration.name);
            executed.add(migration.name);
            sorted.push(migration);
        };

        // 3. Visit all migrations
        for (const migration of this.Migrations) {
            visit(migration);
        }

        return sorted;
    }
    async runDBMigrations(): Promise<void> {
        if (!this.Database) {
            await this.initDatabase();
        }

        const migrations = this.getSortedMigrations();
        await this.Database!.runMigrations(migrations)
    }

    runDBSeeders(): void {

    }

}