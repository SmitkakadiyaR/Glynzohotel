const db = require('../../database');





async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database connected, test query result:', rows[0].solution);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

// testConnection();

// async function query(sql, params) {
//     const [rows] = await db.query(sql, params);
//     return rows;
// }


const getAllRoomTypes = async () => {
    try {
        const query1 = 'SELECT DISTINCT room_type FROM rooms'; // Fetch unique room types

        // console.log("get all types of room");
        const [results] = await db.query(query1) // Use promise-based query
        // console.log("Room Types Query Result:", results); // Log query result
        return results; // Return all distinct room types
    } catch (err) {
        console.error("Error executing query:", err); // Log database query errors
        throw err; // Rethrow error to be handled by the calling function
    }
};


// Import required modules
// const express = require('express');
// const mysql = require('mysql2/promise');
// const app = express();

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'your_username',
//     password: 'your_password',
//     database: 'your_database',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// SQL query function
const fetchAvailableRooms = async (roomType, checkOutDate, checkInDate) => {
    try {
        // Log parameters for debugging
        console.log("Fetching available rooms:");
        console.log("Room Type:", roomType);
        console.log("Check-in Date:", checkInDate);
        console.log("Check-out Date:", checkOutDate);

        const query = `
            SELECT 
                r.id, 
                r.room_description, 
                r.room_photo_url, 
                r.room_price, 
                r.room_type
            FROM rooms r
            WHERE r.room_type = ?
              AND r.id NOT IN (
                  SELECT b.room_id
                  FROM bookings b
                  WHERE (b.check_in_date <= ? AND b.check_out_date >= ?)
              )`;

        // Execute the query
        const [rows] = await db.query(query, [roomType, checkOutDate, checkInDate]);

        // Log the result
        console.log("Query result (Available rooms):", rows);

        return rows;  // Return the result
    } catch (err) {
        console.error("Error executing query:", err);  // Log any error
        return [];  // Return an empty array in case of error
    }
};


const getRoomById = async (roomId) => {
    const query = `
        SELECT 
            r.id, 
            r.room_description, 
            r.room_photo_url, 
            r.room_price, 
            r.room_type
        FROM rooms r
        WHERE r.id = ?;
    `;
    try {
        // Execute the query with roomId
        const [rows] = await db.query(query, [roomId]);

        // If no room found, return null
        if (rows.length === 0) {
            return null;
        }

        return rows[0];  // Return the first row (room data)
    } catch (error) {
        console.error("Error fetching room:", error);
        throw error;  // Rethrow error to be handled by the controller
    }
};
const getAllRooms = async () => {
    const query = `
        SELECT 
            id, 
            room_description, 
            room_photo_url, 
            room_price, 
            room_type 
        FROM rooms;
    `;

    const [rows] = await db.query(query);
    return rows; // Return all room details
};




module.exports = { getAllRoomTypes,
    fetchAvailableRooms,
    getRoomById,
    getAllRooms
 };


