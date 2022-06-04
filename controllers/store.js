var Books=require('../models/book');
const bookCopy = require('../models/bookCopy');
var bookCoppies = require('../models/bookCopy')
var getAllBooks = (req, res) => {

    //TODO: access all books from the book model and render book list page
    Books.find({},function(err,docs){
        if(err){
            res.status(500).send("erroe");
        }
        else{
            
            res.render("book_list", { books:docs , title: "Books | Library" });
        }
    })
    
}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const id = req.params.id;
    Books.findById(id,(err, book) => {
        if(err) {console.log(err);}
        else{
            res.render("book_detail",{book:book,num_available:book.availaible_copies.length,title: "Details" });
        }
    })
}

var getLoanedBooks = (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    var bookId=req.body.bid;
    bookCoppies.find({book:bookId},(err,doc)=>{
        if(err){console.log(err);}
        
    })
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    var {title,author,genre}=req.body;
    Books.find().or([{title:title},{author:author},{genre:genre}])
        .then(books=>{
            if(!books){
                res.render("book_list", { books: [], title: "Books | Library" });
            }
            else{
                res.render("book_list", { books: books, title: "Books | Library" });
            }
        })
        .catch(err=>{
            console.log(err);
        })

}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks
}