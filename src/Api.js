// @flow

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import ProduceRouter from './routers/ProduceRouter';

export default class Api {
  // annotate with the express $application type
  // //we create a field reference for the api.express property and tell flow that it will be an object of type express$application from express.
  // $FlowFixMe: express libdef issue
  express: express$Application;

  // create the express instance, attach app-level middleware, attach routers
  constructor() {
    this.express = express();          //instantiating express.
    this.middleware();
    this.routes();
  }

  //register middlewares
  middleware(): void {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
  }

  // connect resource routers
  routes(): void {
    // create an instance of ProduceRouter
    const produceRouter = new ProduceRouter();

    this.express.use(produceRouter.path, produceRouter.router)
  }
}
