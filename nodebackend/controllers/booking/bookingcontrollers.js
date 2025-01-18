const { user } = require('../../config/dbconfig');
const userdb = require('../../model/usermodel/userdb');
const bookingdb= require('../../model/bookingmodel/bookingmodel');
const nodemailer=require('nodemailer');

const sendBookingConfirmation = async (userEmail, bookingDetails,bookingConfirmationCode) => {
    // Step 1: Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure:true,
        port:465, // Use your email service provider (e.g., Outlook, SendGrid, etc.)
        auth: {
            user: 'smitkakadiya588@gmail.com',
            pass: 'lixk flut wyex fvyj', // Use app-specific password for Gmail
        },
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates
        },
    });

    // Step 2: Set up email options
    const mailOptions = {
        from: 'smitkakadiya588@gmail.com', // Your email
        to: userEmail, // Recipient's email
        subject: 'Booking Confirmation',
        html: `<h1>Booking Successful</h1>
               <h1>Booking confirmation code :${bookingConfirmationCode}</h1>
               <p>Hi, your booking has been confirmed!</p>
               <p>Details:</p>
               <ul>
                   <li>Booking Date: ${bookingDetails.checkInDate}</li>
                   <li>Booking Date: ${bookingDetails.checkOutDate}</li>
                   <li>Guests: ${bookingDetails.numOfAdults+bookingDetails.numOfChildren}</li>
               </ul>`,
    };

    // Step 3: Send email
    try {
        await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



// Controller to book a room
const bookRoom = async (req, res) => {
    const { roomId, userId } = req.params;
    const booking = req.body;
    // console.log("bookinggggggggggggggggggggggg......",booking,roomId,userId,user);

    try {
        // Validate required fields
        if (!roomId || !userId || !booking.checkInDate || !booking.checkOutDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Call the service to book the room
        const {bookingId,bookingConfirmationCode}= await bookingdb.bookRoom(roomId, userId, booking);

        try {
            const userData= await userdb.findUserById(userId);
            // console.log("userrrrrrrrrrrrrrr",userEmail,userEmail[0].id);
            
            const userEmail=userData[0].email;
            // console.log("userrrrrrrrrrrrrrrEmaillllllllllllllllllllllll",userEmail);
            await sendBookingConfirmation(userEmail, booking,bookingConfirmationCode);
        } catch (error) {
            console.error('Error sending email:', error);
        }



        res.status(201).json({
            message: 'Room booked successfully',
            bookingId: bookingId,
            statusCode:200,
            bookingConfirmationCode:bookingConfirmationCode
        });
        
    } catch (error) {
        console.error("Error in booking controller:", error);
        res.status(500).json({ message: 'Error booking room' });
    }
};

const getBookingByConfirmationCode = async (req, res) => {
    const { bookingCode } = req.params;

    try {
        // Fetch booking details from the model
        const bookingDetails = await bookingdb.getBookingByConfirmationCode(bookingCode);

        if (!bookingDetails) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({
            message: "Booking details fetched successfully",
            bookingDetails
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// const getAllBookings= async (req, res) => {
//     try {
//         try {
//             const bookings = await BookingModel.getAllBookings();
//             res.status(200).json({ bookings });
//           } catch (error) {
//             console.error('Error fetching bookings:', error.message);
//             res.status(500).json({ message: 'An error occurred while fetching bookings' });
//           }
//   }
// }
const getAllBookings = async (req, res) => {
    try {
      const bookings = await bookingdb.getAllBookings();
      res.status(200).json({ "bookingList":bookings,"statusCode":200 });
    //   console.log(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
      res.status(500).json({ message: 'An error occurred while fetching bookings' });
    }
  };


  const cancelBooking = async (req, res) => {
    try {
        // console.log(req.params);
      const { bookingId } = req.params; // Get the bookingId from the request parameters

    //   console.log(bookingId)
  
      // Check if bookingId is provided
      if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
      }
  
      // Call the model to delete the booking
      const deletedBooking = await bookingdb.cancelBooking(bookingId);
  
      if (deletedBooking) {
        res.status(200).json({ message: 'Booking successfully cancelled',
            "statusCode":200 });
      } else {
        res.status(404).json({ message: 'Booking not found or already cancelled'
         });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error.message);
      res.status(500).json({ message: 'An error occurred while cancelling the booking' });
    }
  };
  
  


module.exports = {
    bookRoom,
    getBookingByConfirmationCode,
    getAllBookings,
    cancelBooking
};
