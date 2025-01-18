const userdb = require('../../model/usermodel/userdb');
const getUserProfile = async (req, res) => {
    try {
        // Simulate fetching logged-in user ID from token or session
        const userEmail = req.user.email;
        if (!userEmail) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }
        const userProfile = await userdb.getUserByEmail(userEmail);

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userProfile);
    } catch (error) {
        console.error("Error in controller:", error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

module.exports = {
    getUserProfile
};