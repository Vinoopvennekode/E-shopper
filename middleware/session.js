const userSession= (req,res,next)=>{
    if(req.session.userlogin){
   next();

    }else{
        res.redirect("/userLogin");
    }
}
const noSession= (req,res,next)=>{
    if(req.session.userlogin){
        console.log('nosession');
        res.redirect("/");

    }else{
      
        next();
    }
}


module.exports={userSession,noSession}