const DBHelper = require('../lib/db-helper')();
const Pizza = require('../models/pizza.model');

module.exports = function APIController() {

    function _handleDbHelperResponse(res, err, data) {
        if (err) {
            res.json({
                message: 'Ups, Something happened!',
                error: err
            });
        } else {
            res.json(data);
        }
    }

    function getCrusts(req, res) {
        DBHelper.getCrusts(function(err, data) {
            _handleDbHelperResponse(res, err, data);
        });
    }

    function getToppings(req, res) {
        DBHelper.getToppings(function(err, data) {
            _handleDbHelperResponse(res, err, data);
        });
    }

    function getSauces(req, res) {
        DBHelper.getSauces(function(err, data) {
            _handleDbHelperResponse(res, err, data);
        });
    }

    function getCheeses(req, res) {
        DBHelper.getCheeses(function(err, data) {
            _handleDbHelperResponse(res, err, data);
        });
    }

    function addOrder(req, res) {
        var auth = req.get('Authorization');
        if (isUserAuthenticated(auth)) {
            var order = {};
            var ingredients = {
              crust: req.body.crust,
              toppings: req.body.toppings.split(','),
              sauce: req.body.sauce,
              cheese: req.body.cheese
            };
            order.pizza = new Pizza(req.body.size, ingredients);
            order.price = req.body.price;
            order.email = getUserEmail(auth);
            order.status = 'active';

            DBHelper.addOrder(order, function(err, result) {
                if (result.insertedCount === 1) {
                    var data = {
                        success: 'success',
                        message: 'order was successfully added!'
                    };
                    _handleDbHelperResponse(res, err, data);
                }
            });
        } else {
            res.json({
              failed: 'failed',
              errorMessage: 'User was not authenticated'
            });
        }
    }

    function getOrders(req, res) {
        DBHelper.getOrders(function(err, data) {
            _handleDbHelperResponse(res, err, data);
        });
    }

    function getOffers(req, res) {
      DBHelper.getOffers(function(err, data) {
          _handleDbHelperResponse(res, err, data);
      });
    }

    function authenticate(req, res) {
        var user = {
            email: req.body.email,
            password: req.body.password
        };
        DBHelper.getUser(user, function(err, data) {
            if (err) {
                res.json({
                    message: 'Ups, Something happened!',
                    error: err
                });
            } else {
                if (!data) {
                    res.json({
                        success: 'failed',
                        errorMessage: 'User was not found!'
                    });
                } else if (user.password === data.password) {
                    res.json({
                        success: 'success',
                        authorization: 'Basic ' + user.email + ':' + user.password
                    })
                } else {
                    res.json({
                        error: 'failed'
                    })
                }
            }
        });
    }

    function getUserEmail(auth) {
        if (auth) {
            var auth_code = auth.split(' ');
            // if contains username & password
            if (auth_code[1]) {
                var encrypt_credentials = auth_code[1].split(':');
                // desencrypt
                var credentials = encrypt_credentials;
                if (credentials[0]) {
                    var email = credentials[0];
                    return email;
                }
            }
        }
    }

    function isUserAuthenticated(auth) {
        if (auth) {
            var auth_code = auth.split(' ');

            // if contains username & password
            if (auth_code[1]) {
                var encrypt_credentials = auth_code[1].split(':');
                // desencrypt
                var credentials = encrypt_credentials;
                if (credentials[0]) {
                    var user = credentials[0];
                    return true;
                }
            }
        }
        return false;
    }

    return {
        getCrusts: getCrusts,
        getToppings: getToppings,
        getSauces: getSauces,
        getCheeses: getCheeses,
        authenticate: authenticate,
        addOrder: addOrder,
        getOrders: getOrders,
        getOffers: getOffers
    }
};
