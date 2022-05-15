const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: String,
    plate_num: String,
    hce_id: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true
    },
    images: [],
    init_km: String,
    curr_km: String,
    automatic: Boolean,
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    brand: String,
    model: String,
    manf_year: String,
    num_of_door: Number,
    engine: {
        fuel: String,
        manufacturer: String,
        drive: String,
        model: String,
        c_type: String,
        cylinder: String,
        power: String,
        ecu: String 
    },
    meta: {
        notes: [],
        comment: String
    },
    created: {
        type: Date, 
        default: Date.now
    },
 })


 carSchema.statics.setHceId = function(compid, suffix, callback) {
    let possibleId = compid + (suffix || 100);
    this.findOne({
        hce_id: possibleId
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

 
module.exports = mongoose.model('Vehicle', carSchema);