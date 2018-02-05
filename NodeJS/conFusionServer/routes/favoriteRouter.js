const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/favorites');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes._id')
            .then((fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav) {

                    req.body.map((dish) => {
                        if (fav.dishes.indexOf(dish) == -1) {
                            fav.dishes.push(dish);
                        }
                    });
                    fav.save();
                    console.log('Favorites Updated ', fav);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                } else {
                    Favorites.create({ user: req.user._id, dishes: req.body })
                        .then((newFav) => {
                            console.log('Favorites Created ', newFav);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(newFav);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                fav.remove({})
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }, (err) => next(err))
                    .catch((err) => next(err));

            }, (err) => next(err))
            .catch((err) => next(err));
    });


favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "exists": false, "favorites": favorites });
                }
                else {
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": false, "favorites": favorites });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": true, "favorites": favorites });
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav) {
                    if (fav.dishes.indexOf({ _id: req.params.dishId }) == -1) {
                        fav.dishes.push({ _id: req.params.dishId });
                    }
                    fav.save();
                    console.log('Favorites Updated ', fav);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                } else {
                    err = new Error('Your favorite dish does not exist!');
                    err.status = 404;
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err));


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/:dishId');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                fav.dishes = fav.dishes.filter(dish => {
                    if (dish._id != req.params.dishId) { return true } else { return false }
                });
                fav.save()
                    .then((fav) => {
                        Favorites.findById(fav._id)
                            .populate('user')
                            .populate('dishes._id')
                            .then((favorite) => {
                                console.log('Favorite Dish Deleted!', fav);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(fav);
                            })
                    });
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;