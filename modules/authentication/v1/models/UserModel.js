/**
 * Created by osindex on 8/21/18.
 */
const mongoose   = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const comparePassword = (candidatePassword, hash , cb) => {
    console.log(this)
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        cb(err, isMatch);
    });
};


const userSchema = new Schema({
    uniqueIndentifier: {type: String, unique: true, required: [true, "Cannot be empty."], index: true},
    password: {type: String},
    nickname: {type: String, default: '', required: true},
    accountVerified: {type: Boolean, default: false, required: true},
    designTags : [{ type: Schema.Types.ObjectId, ref: 'DesignTag' }]
}, {timestamps: true});

userSchema.methods.comparePassword = comparePassword;


userSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);
