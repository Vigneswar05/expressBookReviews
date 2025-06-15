const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

axios.get('http://localhost:5001/')
  .then(response => {
      console.log("Books available in shop")
      console.log(response.data)
      askIsbn();
  })
  .catch(error => {
    console.error(error.message)
  }
  )

const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askIsbn(){
  rl.question("Enter ISBN number: ", async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
    console.log("Book details:");
    console.log(response.data);
    askTitle();
  } catch (error) {
    console.error("Error fetching book:", error.response?.data || error.message);
  } finally {
   
  }
});

}

function askTitle(){
  rl.question("Enter title: ", async (title) => {
  try {
    const response = await axios.get(`http://localhost:5001/title/${title}`);
    console.log("Book details:");
    console.log(response.data);
    askAuthor();
  } catch (error) {
    console.error("Error fetching book:", error.response?.data || error.message);
  } finally {
    
  }
});
}
function askAuthor(){
  rl.question("Enter author: ", async (author) => {
  try {
    const response = await axios.get(`http://localhost:5001/author/${author}`);
    console.log("Book details:");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book:", error.response?.data || error.message);
  } finally {
    rl.close(); // Close the input
  }
});
}



public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const book = []

  for(let i in books){
    if(books[i].author.toLowerCase()===author.toLowerCase()){
      book.push(books[i]);
    }
  }
  if (book.length>0) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book = []

  for(let i in books){
    if(books[i].title.toLowerCase()===title.toLowerCase()){
      book.push(books[i]);
    }
  }
  if (book.length>0) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
