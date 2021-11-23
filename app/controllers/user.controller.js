
const User = require('../models/user.model.js');

// Create and Save a new User

exports.create = (req, res) => {

    let { name, email, msg, subject, notification_time } = req.body;

    if (!email || !msg) {
        return res.status(400).send({
            message: "Required parameter missing"
        });
    }
    if (!subject) {
        subject = "Greeting from SendGrid."
    }

    // "Nov 11, 2021 16:55:00"

    if (!notification_time) {
        notification_time = new Date();
    } else {
        notification_time = new Date(notification_time)
        console.log("notification_time==" + notification_time)
    }

    // Create a User
    let userInfo = {
        name: name,
        email_address: email,
        email_msg: msg,
        email_subject: subject,
        notification_time,
    }

    console.log(userInfo)
    const user = new User(userInfo);
    // Save User in the database

    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    console.log(req.params)
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId
            });
        });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

    let { notification_time } = req.body;

    if (!notification_time) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    } else {
        console.log(notification_time)
        notification_time = new Date(notification_time)
        console.log("notification_time" + notification_time)

    }

    // Find user and update it with the request body
    const userObj = {
        notification_time,
        is_processed: false,
        is_mail_sent: false,
        status: ""
    }
    // updateUsers(userObj, req, res)
    User.findByIdAndUpdate(req.params.userId, {
            notification_time,
            is_processed,
            is_mail_sent,
            status
        }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
};

exports.updateNotificationDetails = (mailResult) => {

        User.findByIdAndUpdate(mailResult._id,
            {   
                is_mail_sent:mailResult.is_mail_sent,
                is_processed: mailResult.is_processed,
                status:mailResult.status
            }, { new: true })
        .then(user => {
            if (!user) {
                console.log({
                    message: "User not found with id " + mailResult._id
                });
            }
            console.log(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                console.log({
                    message: "User not found with id " + mailResult._id
                });
            }
            console.log({
                message: "Error updating user with id " + req.params.userId
            });
        });
}



function updateUsers(userObj, req, res) {
    console.log(userObj)
    User.findByIdAndUpdate(req.params.userId,
            userObj, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
}

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });
};


// Retrive user details by mail  status
exports.mailStatus = (req, res) => {
    // console.log(req.url)
    let query = {status:"success"};

    if(req.url.endsWith("failure")){
        query = {status:"fail"};
    }
    
    User.find(query)
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};
