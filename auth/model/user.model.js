/****************************************************************
 * Model that will be used for authentication, authorization and 
 * more stuff that is related to people that will be registerd
 * in the platform - Index has been set to email
 ****************************************************************/
 const mongoose = require('mongoose');
 const crypto = require('crypto');

 const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    address: {
        city: String,
        kebele: String,
        house_num: String,
        near_by: String,
        center_point: {
            lat: String,
            lng: String
        }
    },
    hce_id: {
        type: String,
        unique: true
    },
    email: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
       // index: true,
       // match: [/.+\@.+\..+/, "Please fill a valid e-mail address"] // regex for the email 
    }, 
    password: {
        type: String, 
        required: true,
      //  minlength: 8,
       // maxlength: 20
       validate: [
        (password) =>{
            return password.length > 6;
        }, 
        'Password should be longer'
         ]
    }, 
    phone: {
        type: String,
        required: true,
        minlength: 10,
       // maxlength: 15
     },
     second_phone: {
        type: String,         
     },
     secondary_email: {
        type: String,
     
    },
     salt: {
        type: String
      }, 
    role: {
        type: String,
        enum: [ 'Staff', 
                'Admin',
                'User',
                'Owner',  
                'Guest'   
            ],
        required: true
    }, 
    bank: {
        fullname: String,
        branch_code: String,
        branch_name: String,
        acc_number: String,
        bank_name: String,
        bank_address: String
    },
    start_date: String,
    gender: String,
    nin: String,
    tax_code: String,
    department: String,
    profImg: {
        type: String,
        default: ""
    }, 
    emergency_contact: {
      fullname: String,
      phone: String,
      email: String, 
      address: {}
    },
    metadata : [],
    kyc_docs: [],
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    created: {
        type: Date, 
        default: Date.now
    },
    accessToken: Number,
    tokenExpiry: Date
}, {
    collection: 'moged_users'
});

userSchema.pre('save', function(next) {
    if(this.password) {
        this.salt = new  Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
}
    next();
});

userSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
}

userSchema.methods.isValidPassword = function(password) {
    return this.password === this.hashPassword(password);
}

userSchema.statics.setHceId = function(compid, suffix, callback) {
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


module.exports = mongoose.model('User', userSchema);