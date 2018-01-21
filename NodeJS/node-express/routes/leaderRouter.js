const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all leaders');
    });

promoRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send the leader: ' + req.params.leaderId);
    })
    .post((req, res, next) => {
        res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Updating the leader: ' + req.params.leaderId + '\n' +
            'Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting the id leader with Id: ' + req.params.leaderId);
    });

module.exports = promoRouter;