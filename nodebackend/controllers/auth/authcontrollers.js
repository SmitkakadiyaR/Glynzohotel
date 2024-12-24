const userdb = require('../../model/usermodel/userdb');
const bcrypt = require('bcrypt'); // Import functions from database.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwtconfig');


const userRegister=async (req, res) => {
    const { name, email, phone_number, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await userdb.checkIfUserExists(email);
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register the new user
        const result = await userdb.registerUser(name, email, phone_number, hashedPassword);

        // Respond with success
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
    console.log(req.headers);
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await userdb.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User are not found" });
        }

        // Compare the password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            jwtConfig.secret,                 // Secret key
            { expiresIn: jwtConfig.expiresIn } // Token options
        );

        // Respond with token and user info
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
    console.log("useeeeeeeer",req.user.id,req.user.email);
    const allUsers=await userdb.findAllUser();
    if(allUsers){
        res.status(200).json({
            alluser:allUsers
        })
    }
}
module.exports={userRegister,userLogin,getAllUser};