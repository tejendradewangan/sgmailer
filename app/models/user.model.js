const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email_address: String,
    email_msg:String,
    email_subject:String,
    notification_time:Date,
    is_processed:{type:Boolean,default:false},
    is_mail_sent:{type:Boolean,default:false},
    status :{type:String,default:null},
    status_code :{type:Number,default:null}
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

