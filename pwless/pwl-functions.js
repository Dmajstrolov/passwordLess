const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailTo = require("./mail");

module.exports = {

    loginForm(req,res){
        res.sendFile(__dirname + "/form.html");
    },
    confirmationForm(req,res){
        res.sendFile(__dirname + "/conf.html");
    },
    login(req,res){

        let code = getRandomCode();
        let hash = bcrypt.hashSync(code,12);

        let email = req.body.email;
        let payload = {email:email, hash:hash};
        let token = jwt.sign(payload,process.env.FIRSTSECRET,{expiresIn:120});
        emailTo(code,email);

        res.cookie("tmpToken",token,{maxAge:120000,sameSite:"strict", httpOnly:true});
        res.redirect("/confirmation");
    },
    confirmation(req,res){
        let code = req.body.code;
        let tmpToken = req.cookies.tmpToken;
        
        if(tmpToken){
            //verify token
            try{
                let verifiedToken = jwt.verify(tmpToken,process.env.FIRSTSECRET);
                //Hämtar hash från token
                let hash = verifiedToken.hash;
                bcrypt.compare(code,hash,(err,success)=>{
    
                    if(success){
    
                        let payload = {email:verifiedToken.email};
                        res.cookie("tmpToken", false,{maxAge:10000});
                        let token = jwt.sign(payload,process.env.MAINSECRET,{expiresIn:"2h"});
                        res.cookie("token",token,{maxAge:7200000,httpOnly:true,sameSite:"Strict"});
    
                        res.send("you are logged in");
                    }
                    else{
                        res.send("Login error");
                    }
    
                });
    
            }
            catch(error){
                res.send(error.message);
            }
            
           
        }
        else{
            res.send("no cookie provided");
        }
    
    
    }

    
}
function getRandomCode(){
    const crypto = require("crypto");
    const code = crypto.randomBytes(4).toString("hex");
    console.log(code);
    return code;
    /* Genererad kod ska man skicka vidare */

}