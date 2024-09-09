import express from 'express'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'  
import { createHandler } from 'graphql-http/lib/use/http';
import { buildSchema } from 'graphql' 


const schema = buildSchema(`
    type Query {
        hello: String
    }    
`)

const root = {
    hello() {
        return "Hello World!"
    }
}

const app = express()

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.all("/graphql", createHandler({ schema: schema, rootValue: root }))

app.listen(4000, "0.0.0.0" ,() => {
    console.log("Running Server port 4000")
})

