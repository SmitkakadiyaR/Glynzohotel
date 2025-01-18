import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors
    const [success, setSuccessMessage] = useState(null); // Track any errors



    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                console.log(response.bookingDetails);
                setBookingDetails(response.bookingDetails);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);


    const acheiveBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to Acheive this booking?')) {
            return; // Do nothing if the user cancels
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("The boking was Successfully Acheived")
                
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 1000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 1000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Booking Detail</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p>Confirmation Code: {bookingDetails.booking_confirmation_code}</p>
                    <p>Check-in Date: {bookingDetails.check_in_date}</p>
                    <p>Check-out Date: {bookingDetails.checkOutDate}</p>
                    <p>Num Of Adults: {bookingDetails.num_of_adults}</p>
                    <p>Num Of Children: {bookingDetails.num_of_children}</p>
                    <p>Guest Email: {bookingDetails.user_email}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Booker Detials</h3>
                    <div>
                        <p> Name: {bookingDetails.user_name}</p>
                        <p> Email: {bookingDetails.user_email}</p>
                        <p> Phone Number: {bookingDetails.user_phone}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Room Details</h3>
                    <div>
                        <p> Room Type: {bookingDetails.room_type}</p>
                        <p> Room Price: ${bookingDetails.room_price}</p>
                        <p> Room Description: {bookingDetails.room_description}</p>
                        <img src={bookingDetails.room_photo_url} alt="" sizes="" srcSet="" />
                    </div>
                    <button
                        className="acheive-booking"
                        onClick={() => acheiveBooking(bookingDetails.id)}>Acheive Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;
