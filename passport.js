var localStrategy=require('passport-local').Strategy
var User=require('./models/user')
module.exports=function(passport){
    passport.serializeUser(function(user,done){
        done(null,user);
    })
    passport.deserializeUser(function(user,done){
        done(null,user);
    })
    passport.use(new localStrategy({passReqToCallback:true},function(req,username,password,done){
        User.findOne({username:username},function(err,doc){
            if(err){
                done(err);
            }
            else{
                if(doc){
                    var valid=doc.comparePassword(password,doc.password);
                    if(valid){
                        done(null,{
                            username:doc.username,
                            email:doc.email,
                            password:doc.password,

                        })
                    }
                    else{
                        done(null,false,req.flash('error','Incorrect Password'))
                    }
                }
                else{
                    done(null,false,req.flash('error','No such username exists'))
                }
            }
        })
    }))
}