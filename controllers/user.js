
const User = require("../models/user.js");





module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
 };



module.exports.signup= async (req, res) => { // Wrapped the handler with wrapAsync
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // Used await since it's an asynchronous operation
        
        
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("sucess", "Welcome to Wanderlust"); // Corrected the typo in flash message
            res.redirect("/listings");
        });
      
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};



module.exports.login = async (req, res) => {
    req.flash("sucess","Welcome to Wanderlust! You're logged in.");
    let resulturl=res.locals.redirectUrl || "/listings";
    res.redirect(resulturl);
 
};



module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","You are logged out!");
        res.redirect("/listings");
    })
};