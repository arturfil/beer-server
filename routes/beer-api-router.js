const express   = require('express');
const BeerModel = require('../models/beer-model');
const router    = express.Router();

// Get localhost:3000/api/beer
router.get('/beers', (req, res, next) => {
    BeerModel.find()
        .limit(20)
        .sort({_id: -1})
        .exec((err, recentBeers) => {
            if(err)  {
                console.log('Error finding the beer desired', err);
                res.status(500).json({errorMessage: 'Finding beers went wrong 💩'})
                return;
            }
            res.status(200).json(recentBeers);
        });
});

//POST localhost:3000/api/beers
router.post('/beers', (req, res, next) => {
    const theBeer = new BeerModel({
        name: req.body.beerName,
        brewery: req.body.beerBrewery,
        image: req.body.beerImage,
        origin: req.body.beerOrigin,
        type: req.body.beerType
    });

    theBeer.save((err) => {
        if (theBeer.errors) {
            res.status(400).json({
                errorMessage: 'Validation failed',
                validationErrors: theBeer.errors
            });
            return;
        }

        if (err) {
            console.log("Error posting the Beer", err);
            res.status(500).json({ errorMessage: 'New beer went wrong'});
            return;
        }

        res.status(200).json(thePhone);
    })
}) //POST / beer

// GET localhost:3000/api/beers/ID
router.get('/beers/:beerId', (req, res, next) => {
    BeerModel.findById(
        req.params.beerId,
        (err, beerFromDb) => {
            if (err) {
                console.log("Beer details ERROR", err);
                res.status(500).json({ errorMessage: "Beer details went wrong 💩"});
                return;
            }
            res.status(200).json(beerFromDb);
        }
    );
});

//PUT localhost:3000/api/beers/ID
router.put('/beers/:beerId', (req, res, next) => {
    BeerModel.findById(
        req.params.beerId,
        (err, beerFromDb) => {
            if (err) {
                console.log("Beer details Error", err);
                res.status(500).json({ errorMessage: 'Beer details went wrong'});
                return;
            }

            beerFromDb.set({
                name: req.body.beerName,
                brewery: req.body.beerBrewery,
                image: req.body.beerImage,
                origin: req.body.beerOrigin,
                type: req.body.beerType
            })
        }
    )
})