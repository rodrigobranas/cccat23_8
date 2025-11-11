import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as Hapi from "@hapi/hapi";
import * as restify from "restify";

export default interface HttpServer {
    route (method: "get" | "post", url: string, callback: Function): void;
    listen (port: number): void;
}

export class ExpressAdapter implements HttpServer {
    app: Express;

    constructor () {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
    }

    route(method: "get" | "post", url: string, callback: Function): void {
        this.app[method](url.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (e: any) {
                console.error(e);
                res.status(422).json({
                    message: e.message
                });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
    }

}

export class HapiAdapter implements HttpServer {
    server: Hapi.Server;

    constructor() {
        this.server = Hapi.server({
            port: 3000,
            host: 'localhost',
            routes: {
                cors: {
                    origin: ['*'],
                    headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            }
        });
    }

    route(method: "get" | "post", url: string, callback: Function): void {
        this.server.route({
            method: method.toUpperCase() as 'GET' | 'POST',
            path: url.replace(":", ""),
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                try {
                    const output = await callback(request.params, request.payload);
                    return h.response(output).code(200);
                } catch (e: any) {
                    return h.response({
                        message: e.message
                    }).code(422);
                }
            }
        });
    }

    async listen(port: number): Promise<void> {
        this.server.settings.port = port;
        await this.server.start();
        console.log(`Hapi server running on port ${port}`);
    }
}

export class RestifyAdapter implements HttpServer {
    server: restify.Server;

    constructor() {
        this.server = restify.createServer();
        this.server.use(restify.plugins.bodyParser());
        this.server.use(restify.plugins.queryParser());
        
        // CORS setup
        this.server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            if (req.method === 'OPTIONS') {
                res.send(200);
                return;
            }
            return next();
        });
    }

    route(method: "get" | "post", url: string, callback: Function): void {
        this.server[method](url.replace(/\{|\}/g, ""), async (req: restify.Request, res: restify.Response, next: restify.Next) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
                return next();
            } catch (e: any) {
                res.json(422, {
                    message: e.message
                });
                return next();
            }
        });
    }

    listen(port: number): void {
        this.server.listen(port, () => {
            console.log(`Restify server running on port ${port}`);
        });
    }
}
