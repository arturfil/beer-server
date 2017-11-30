const express   = require('express');
const BeerModel = require('../models/beer-model');
const m = require('../config/multer-config');

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
router.post('/beers', m.uploader.single('beerImage'), (req, res, next) => {
    if(!req.user) {
        es.status(401).json({ errorMessage: 'Not logged in'});
        return;
    }

    const theBeer = new BeerModel({
        name: req.body.beerName,
        brewery: req.body.beerBrewery,
        origin: req.body.beerOrigin,
        type: req.body.beerType,
        user: req.user._id
    });

    if (req.file) {
        theBeer.image = m.getUrl(req);
    }

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

        res.status(200).json(theBeer);
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
            });

            beerFromDb.save((err) => {
                if (beerFromDb.errors) {
                    res.status(400).json({
                        errorMessage: "Update validation failed 💀",
                        validationErrors: beerFromDb.errors
                    });
                    return;
                }
                if (err) {
                    console.log('Beer Error update', err);
                    res.status(500).json({ errorMessage: 'Beer update went wrong'});
                    return;
                }

                res.status(200).json(beerFromDb);
            });

        }
    )
});

// DELETE/api/items/ID
router.delete('/beers/:beerId', (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ errorMessage: 'Not logged in'});
        return;
    }
    BeerModel.findById(
        req.params.beerId,
        (err, beerFromDb) => {
            if (err) {
                console.log('Beer owner confirm ERROR', err);
                res.status(500).json(
                    { errorMessage: 'Beer owner confirm went wrong'}
                );
                return;
            }

            if (beerFromDb.user.toString() !== req.user._id.toString()) {
                res.status(403).json({ errorMessage: 'This beer is not yours 👹'});
                return;
            }

            BeerModel.findByIdAndRemove(
                req.params.beerId,
                (err, beerFromDb) => {
                    if (err) {
                        console.log('Beer delete error', err);
                        res.status(500).json({ errorMessage: 'Beer delete went wrong'});
                    }
                    res.status(200).json(beerFromDb);
                }
            );
        }
    );
});

// GET/api/mybeers
router.get('/mybeers', (req, res, next) => {
    if(!req.user) {
        res.status(401).json({ errorMessasge: 'Not logged in 💀'});
        return;
    }
    BeerModel.find({ user: req.user._id })
    .sort({ _id: -1 })
    .exec((err, myBeerResults) => {
        if (err) {
            res.status(500).json(
                {errorMessage: 'My items went wrong 🤠'}
            );
            return;
        }
        res.status(200).json(myBeerResults);
    })
})

module.exports = router;