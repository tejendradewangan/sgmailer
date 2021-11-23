

const User = require('../models/user.model.js');
const mailSender = require('./mail.sender.js')

// mail shedule interval
// const shedulerInSecond = 1 * 1000; 
const shedulerInMinute = 1 * 60000 ;

// Configuring the database
const dbConfig = require('../../config/database.config.js');
const mongoose = require('mongoose');
const {from, mail_limit} = dbConfig
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
    // ,useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Error while connecting to database...', err);
    process.exit();
});


// exports.find = (req, res) => {
function sendNotification() {
    console.log("========Job Started========")
    User.find({ "is_processed": false, notification_time: { $lte: new Date() } }).limit(mail_limit)
        .then(users => {
            // res.send(users);
            // console.log(users)
            if (users.length === 0) {
                 console.log("Record not found")
                 return console.log("========Job Stopped========")
            }
            prepareMsgBody(users, function(err, result) {
                if (!err) {
                    // res.send(result)
                    console.log("final result")
                    console.log(result)
                } else {
                    // res.send(err)
                    console.error("final error")
                    console.error(err)
                }
            })
            console.log("========Job Stoped========")
        }).catch(err => {
            /*res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });*/

            console.error(err)
            console.log("========Job Stoped========")
        });
}
// };

function prepareMsgBody(users, cb) {
    // console.log(users)
    users.forEach((user) => {
        // console.log("user" + user)
        const msgBody = {
            _id: user._id,
            to: user.email_address,
            text: user.email_msg,
            from: from,
            subject: user.email_subject
        }
        mailSender.sendMail(msgBody, (result) => {
            updateNotificationDetails(result, cb)
        })
    })
}

function updateNotificationDetails(mailResult, cb) {

    User.findByIdAndUpdate(mailResult._id, {
            is_mail_sent: mailResult.is_mail_sent,
            is_processed: mailResult.is_processed,
            status: mailResult.status,
            status_code: mailResult.status_code
        }, { new: true })
        .then(user => {
            if (!user) {
                // console.log({
                //     message: "User not found with id " + mailResult._id
                // });
                cb({ message: "User not found with id " + mailResult._id }, null)
            }
            // console.log(user);

            cb(null, user.status)
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                // console.log({
                //     message: "User not found with id " + mailResult._id
                // });
                cb({ message: "User not found with id " + mailResult._id }, null)
            }
            // console.log({
            //     message: "Error updating user with id " + mailResult._id
            // });
            cb({ message: "Error updating user with id " + mailResult._id }, null)
        });
}

// sendNotification();

setInterval(() => {
    sendNotification();
}, shedulerInMinute)

// 