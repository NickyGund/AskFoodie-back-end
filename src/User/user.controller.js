import User from "./user.schema.js";
import {registerValidation, loginValidation} from "./validation.js"



export const login = async (req, res) => {
    //validate information
    const {error} = loginValidation(req.body)

    if(error) {
        return res.json({error: true, data: error.details[0].message})
    }

    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.json({error: true, data: "cannot find email"})
        }
       
        await user.comparePassword(password)
        await user.updateOne({signedIn:true})
        res.json({error: false, data: user.toJSON()})

    }catch(e) {
        return res.json({error: true, data: e});
    }
}

export const register = async (req, res) => {
    //validate user info
    const {error} = registerValidation(req.body)

    if(error) {
        return res.json({error: true, data: error.details[0].message})
    }
    //check if email is in use
    const emailExist = await User.findOne({email: req.body.email})

    if(emailExist){
        res.json({error: true, data: "email already exists."})
    }


    // create new user
    try {
        const user = await User.create(req.body)
        res.json({error: false, data: user.toJSON()})
    }catch(e) {
        res.json({error: true, data: e})
    }
}

export const checkAuth = async (req, res) => {
    try {
        console.log(req.user + "my")
        const user = await User.findById(req.user.id)
        if(!user){
            return res.json({error: true, data: 'wrong token'});
        }
        return res.json({error: false, data: user})
    }catch(e) {
        return res.json({error: true, data: e});
    }
}

export const addProfileInfo = async (req, res) => {
    const update = req.body
    const email = req.headers.email
    const user = await User.findOneAndUpdate({email}, {profileInfo : update});
    return res.json(user)
    
}
