const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn.replace(':', ''); // Retrieve ISBN from the request
    const book = books[isbn]; // Lookup the book directly using the key

    if (book) {
        res.json(book); // If found, respond with the book details
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
    console.log("Requested ISBN:", req.params.isbn);
});
  
// Get book details based on author
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

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
