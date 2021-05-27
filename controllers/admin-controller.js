const ADMIN_LOGIN_DATA = {
    username: "admin",
    password: "admin"
}


const checkAdminLogin = (req, res, next) => {
    console.log("came to login api");
    const {username, password} = req.body;
    console.log(req.body);
    if(username === ADMIN_LOGIN_DATA.username && password === ADMIN_LOGIN_DATA.password){
        console.log("Login should be success");
        res.status(200).json({
            message: "LOGIN SUCCESSFULL!!"
        });
    }else{
        res.status(404).json({
            message: "Invalid Credentials"
        })
        //throw new HttpError("LOGIN CREDENTIALS INVALID.", 404);
    }
}

exports.checkAdminLogin = checkAdminLogin;