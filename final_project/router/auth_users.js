const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "Rick", password: "1234" },
    { username: "Morty", password: "4321" }
];

const isValid = (username)=>{ //username is non-empty and valid
    return username && typeof username === 'string' && username.length > 0;
}

const authenticatedUser = (username,password)=>{ 
    // Check if user exists and their password matches
    const user = users.find(u => u.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Authenticate the user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT
    const token = jwt.sign({ username: username }, "yourSecretKey", { expiresIn: '1h' });

    // Return the token
    res.status(200).json({ message: "Login successful", token: token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.query; // Get the review from the query parameters
    const isbn = req.params.isbn; // Get the ISBN from the route
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    try {
        const { username } = jwt.verify(token, "yourSecretKey"); // Decode the username from the token

        if (!isbn || !review) {
            return res.status(400).json({ message: "ISBN and review are required" });
        }

        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!book.reviews) {
            book.reviews = {};
        }

        book.reviews[username] = review; // Add or update the user's review
        res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the route parameter
    const token = req.headers.authorization?.split(' ')[1]; // Retrieve the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    try {
        // Decode the JWT to get the username
        const { username } = jwt.verify(token, "yourSecretKey"); // Replace "yourSecretKey" with your actual secret key

        // Find the book by ISBN
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the user has a review to delete
        if (!book.reviews || !book.reviews[username]) {
            return res.status(404).json({ message: "No review found for the user" });
        }

        // Delete the user's review
        delete book.reviews[username];

        res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
