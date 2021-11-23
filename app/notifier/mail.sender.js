const sgMail = require('@sendgrid/mail')
const ka = process.env.SENDGRID_API_KEY || " your sendgrid key";

sgMail.setApiKey(ka)

exports.sendMail = (msg, cb) => {
    if (msg) {
        sgMail
            .send(msg)
            .then((response) => {
                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                updateMsgFields(msg);
                msg.status = "success"
                msg.status_code = response[0].statusCode
                cb(msg)
                // cb(null, msg)
            })
            .catch((error) => {
                // msg =
                updateMsgFields(msg);
                msg.status = "fail"
                msg.status_code = error.code

                cb(msg)
                // cb(msg, null)
            })
    }
}

function updateMsgFields(msg) {
    delete msg.to
    delete msg.from
    delete msg.subject
    delete msg.text
    msg.is_processed = true
    msg.is_mail_sent = true
    // return msg
}