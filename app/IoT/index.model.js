const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    device_id: String,
    device_name: String,
    device_group: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true
    },
    device_meta: [],
    device_port: String,
    device_ip: String,
    automatic: Boolean,
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    device_mac: String,
    device_img_src: String,
    status: String,
    status_id: Number,
    metadata: {
        resolution: String,
        vid_record: String,
        can_stream: String,
        can_record: String,
    },
    password: {
        type: Number, 
        minlength: 4,
        maxlength: 4,
       validate: [
        (password) =>{
            return password.length == 4;
        }, 
        'Password length is four'
         ]
    }, 
    salt: {
        type: String
      }, 
    role: {
        type: String,
        enum: [ 'Camera', 
                'Node',
                'Server',
                'Other'   
            ],
        default: 'Node'
    }, 
    meta: {
        notes: [],
        comment: String
    },
    created: {
        type: Date, 
        default: Date.now
    },
    accessToken: Number,
    tokenExpiry: Date
 }, {
    collection: 'hce_iot_devices'
})


 deviceSchema.pre('save', function(next) {
    if(this.password) {
        this.salt = new  Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
}
    next();
});

deviceSchema.statics.setHceId = function(compid, suffix, callback) {
    let possibleId = compid + (suffix || 100);
    this.findOne({
        device_id: possibleId
    }, (err, user) => {
        if (!err) {
            if(!user) {
                callback(possibleId);
            } else {
                return this.setHceId(compid, (suffix || 100) + 1, callback)
            }
        } else {
            callback(null);
        }
    })
}

 
module.exports = mongoose.model('HCE_IOT_DEVICE', deviceSchema);