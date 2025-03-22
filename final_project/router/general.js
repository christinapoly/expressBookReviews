const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

let registeredUsers = {};

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (registeredUsers[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    registeredUsers[username] = { password };
    res.status(201).json({ message: "Registration successful" });
});

/* // Get the list of books
public_users.get('/', function (req, res) {
    res.json(books); // Send books as a JSON response
}); */

/// Get the list of books
public_users.get("/", async (req, res) => {
    try {
        res.json(books); // Send books as a JSON response
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});


/* // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn.replace(':', ''); // Retrieve ISBN from the request
    const book = books[isbn]; // Lookup the book directly using the key

    if (book) {
        res.json(book); // If found, respond with the book details
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
    console.log("Requested ISBN:", req.params.isbn);
}); */

// Fetch book details by ISBN using Async-Await
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn]; // Lookup the book directly using the key

        if (book) {
            res.json(book); // Respond with the book details
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
/* // Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.replace(':', ''); // Retrieve the author from the request parameters
    const matchingBooks = []; // Array to store books by the given author

    // Iterate through the books object
    for (const key in books) {
        if (books[key].author === author) {
            matchingBooks.push(books[key]); 
        }
    }

    // Check if any books by the author were found
    if (matchingBooks.length > 0) {
        res.json(matchingBooks); // Return the matching books
    } else {
        res.status(404).json({ message: "No books found for the specified author" });
    }
    console.log("Requested author:", author);

});*/


// Fetch books by author using Async-Await
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author;
        const matchingBooks = Object.values(books).filter(
            (book) => book.author.toLowerCase() === author.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Respond with matching books
        } else {
            res.status(404).json({ message: "No books found for the specified author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author" });
    }
});

/* // Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.replace(':', ''); // Retrieve the title from the request parameters
    const matchingBooks = []; // Array to store books by the given title

    // Iterate through the books object
    for (const key in books) {
        if (books[key].title === title) {
            matchingBooks.push(books[key]); 
        }
    }

    // Check if any books by the title were found
    if (matchingBooks.length > 0) {
        res.json(matchingBooks); // Return the matching books
    } else {
        res.status(404).json({ message: "No books found for the specified title" });
    }
}); */

// Fetch books by title using Async-Await
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title;
        const matchingBooks = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Respond with matching books
        } else {
            res.status(404).json({ message: "No books found for the specified title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn.replace(':', ''); // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Lookup the book using the ISBN

    if (book) {
        res.json(book.reviews); // Send the reviews of the book as a JSON response
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
