const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    user:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
})

adminSchema.pre('save', async function(next) {
    const user = this

    if(!user.isModified('password')){
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
})

adminSchema.methods.comparePassword = async function(candidatePassword){
    const user = this
    return bcrypt.compare(candidatePassword, user.password)
}


module.exports = mongoose.model('Admin', adminSchema)
