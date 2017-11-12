const express  = require('express');
const bcrypt   = require('bcrypt');
const passport = require('passport');

const UserModel = require('../models/user-model');

const router = express.Router();

router.post('/process-signup', (req, res, next) => {
    if (!req.body.signupFullName ||
        !req.body.signupUsername ||
        !req.body.sigupPassword) {
            res.status(400).json(
                { errorMessage: 'We need full name, username and password'}
            );
            return;
        }

        UserModel.findOne(
            {username: req.body.signupUsername},
            (err, userFromDb) => {
                if (err) {
                    console.log('User find error 🥊', err);
                    res.status(500).json({ errorMessage: "Error finding username"});
                    return;
                }
                if (userFromDb) {
                    res.status(400).json({ errorMessage: "Username was taken"});
                    return;
                }

                const salt = bcrypt.genSaltSync(10);
                const hashPass = bcrypt.hashSync(req.body.signupPassword, salt);

                const theUser = new UserModel({
                    fullName: req.body.signupFullName,
                    username: req.body.signupUsername,
                    encryptedPassword: hashPass
                });

                theUser.save((err) => {
                    if (err) {
                        console.log('User save error 👻');
                        res.status(500).json({errorMessage: 'Error saving user'});
                        return;
                    }

                    //"req.login" is a Passport method that logs in the user automatically
                    req.login(theUser, (err) => {
                        if (err) {
                            console.log("User auto-login error 👻", err);
                            res.status(500).json({ errorMessage: 'Error login in user'});
                            return;
                        }

                        // clear out the password before sending the user info
                        theUser.encryptedPassword = undefined;
                        res.status(200).json(theUser);
                    })
                })
            }
        )
})

router.post('/process-login', (req, res, next) => {
    const customAuthCallback =
    passport.authenticate('local', (err, theUser, extraInfo) => {
        if (err) {
            res.status(500).json({ errorMessage: 'Login failed 💩'});
            return;
        }

        if (!theUser) {
            res.status(401).json({ errorMessage: extraInfo.message});
            return;
        }

        req.login(theUser, (err) => {
            if (err) {
                req.status(500).json({ errorMessage: 'Login failed 💀'});
                return;
            }

            // clear out the password before sending the user info
            theUser.encryptedPassword = undefined;
            res.status(200).json(theUser);
        })
    })
    customAuthCallback(req, res, next);
})

router.delete('/logout', (req, res, next) => {
    req.logout();
    req.status(200).json({ succesMessage: "Log out succes! 🕺🏼"});
})

router.get('/checklogin', (req, res, next) => {
    let amILoggedIn = false;

    if (req.user) {
        req.user.encryptedPassword = undefined;
        amILoggedIn = true;
    }

    res.status(200).json(
        {
            isLoggedIn: amILoggedIn,
            userInfo: req.user
        }
    )
});

module.exports = router;