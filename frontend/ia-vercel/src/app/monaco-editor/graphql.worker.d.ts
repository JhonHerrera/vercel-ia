// graphql.worker.d.ts
declare module 'monaco-graphql/esm/graphql.worker.js' {
    class GraphQLWorker extends Worker {
        constructor();
    }

    export = GraphQLWorker;
}
