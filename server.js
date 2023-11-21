const express = require('express');
const cors = require('cors');
require('dotenv').config();
const DemonRouter = require('./routes/demon');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;


        this.basePath = '/api/v1';
        this.DemonPath = `${this.basePath}/demon`;

        this.middlewares();
        this.routes();
    }
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes (){
        this.app.use(this.DemonPath, DemonRouter);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('listening on port ${this.port}');
        });

    }
}

module.exports = Server;