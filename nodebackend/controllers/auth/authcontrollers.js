const userdb = require('../../model/usermodel/userdb');
const bcrypt = require('bcrypt'); // Import functions from database.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwtconfig');
const userRegister=async (req, res) => {
    const { name, email, phone_number, password } = req.body;
    try {
        const userExists = await userdb.checkIfUserExists(email);
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userdb.registerUser(name, email, phone_number, hashedPassword);
        res.status(201).json({
            message: "User registered successfully",
            user: { id: result.insertId, name, email, phone_number },
            statusCode:201
        });
    } catch (error) {
        console.error("Error in /auth/register:", error);
        res.status(500).json({ message: "Internal Server Error", error: "error happens" });
    }
};
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userdb.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User are not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            jwtConfig.secret,                 // Secret key
            { expiresIn: jwtConfig.expiresIn } // Token options
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                role:user.role
            },
            statusCode:200
        });

    } catch (error) {
        console.error("Error in /auth/login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllUser= async(req,res)=>{
    console.log("req>>",req.headers.authorization.replace("Bearer ","").trim())
    // console.log("useeeeeeeer",req.user.id,req.user.email);
    const allUsers=await userdb.findAllUser();
    if(allUsers){
        res.status(200).json({
            alluser:allUsers
        })
    }
}
module.exports={userRegister,userLogin,getAllUser};