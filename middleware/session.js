const userSession= (req,res,next)=>{
    if(req.session.userlogin){
   next();

    }else{
        res.redirect("/signin");
    }
}
const noSession= (req,res,next)=>{
    if(req.session.userlogin){
        res.redirect("/");

    }else{
      
        next();
    }
}


module.exports={userSession,noSession}