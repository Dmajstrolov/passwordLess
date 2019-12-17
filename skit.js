app.get("/login",(req,res)=>{
    res.sendFile(__dirname + "/form.html");
});
app.post("/login",(req,res)=>{

    //Skapa token med hashad code
    //Skapa cookie med token kort exp

    let hash = bcrypt.hashSync(getRandomCode(),12);

    let email = req.body.email;
    let payload = {email:email, hash:hash};
    let token = jwt.sign(payload,process.env.FIRSTSECRET,{expiresIn:120});

    res.cookie("tmpToken",token,{maxAge:120000,sameSite:"strict", httpOnly:true});
    res.redirect("/confirmation");

});

app.get("/confirmation",(req,res)=>{

    res.sendFile(__dirname + "/conf.html");

});
app.post("/confirmation",(req,res)=>{

    /* Hit skickas en kod och en cookie med en token
    Verifiera token
    Hämta hash från token
    Jämför med kod med hjälp av bcrypt.compare
    Om allt går bra skicka ny token med lång exp och annan MAINSECRET */

    let code = req.body.code;
    let tmpToken = req.body.cookie.tmpToken;
    
    if(tmpToken){
        //verify token
        try{
            let verifiedToken = jwt.verify(tmpToken,process.env.FIRSTSECRET);
            //Hämtar hash från token
            let hash = verifiedToken.hash;
            bcrypt.compare(code,hash,(err,success)=>{

                if(success){

                    let payload = {email:verifiedToken.email};
                    res.cookie("tmpToken", false);
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


});