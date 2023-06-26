const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false

    },
    isActive:{
      type:Boolean,
      default:true
    },
    lastLoginAt:{
      type:Date,
    },
    userType:{
      type:String,
      default:'user',
      enum:['user','admin'],
    },
    twitterProvider: {
      type: {
        id: String,
        token: String
      },
      select: false
    }
})

userSchema.pre('save',async function (next){
    try {
    let newPassword=await bcrypt.hash(this.password,10);
    this.password=newPassword;
    next()
        
    } catch (error) {
        next(error)
    }
})

userSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
    var that = this;
    return this.findOne({
      'twitterProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
          email: profile.emails[0].value,
          twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    });
};
module.exports= mongoose.model('users',userSchema);