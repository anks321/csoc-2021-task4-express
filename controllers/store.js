var Books=require('../models/book');
var bookCopy = require('../models/bookCopy');
var User=require('../models/user');
var getAllBooks = async (req, res) => {

    //TODO: access all books from the book model and render book list page
    const books=await Books.find({});
    res.render('book_list',{books,title:"Books | Library"});
    
}

var getBook = async (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const id = req.params.id;
    const book = await Books.findById(id).populate("availaible_copies");
    var mssg=req.flash().mssg || '';
    
    res.render("book_detail", { book, title: "Book Detail",num_available: book.availaible_copies.length,mssg});
    
}

var getLoanedBooks =  async (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
   
    const username = req.user.username;
    const user = await User.findOne({ username: username}).populate({path:'loaned_books',populate:{path:'book'}});
    res.render( 'loaned_books', {books:user.loaned_books,title:"Loaned Books"})

}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    var bookId=req.body.bid;
    
    User.findOne({username:req.user.username})
    .then(user=>{

        var userId=user.id;
        var query={book:bookId,status:true}
        var newData={book:bookId,status:false,borrow_date:Date.now(),borrower:userId};
        bookCopy.findOneAndUpdate(query,newData,function(err,result){
            if(err){res.send(err);}
            else{
                if(result){
                User.findOneAndUpdate({username:req.user.username},{$push:{loaned_books:[result._id]}},function(err,result){
                    if(err){res.send(err);}
                    else{
                        req.flash('mssg','You have successfully borrowed this book');
                        res.redirect(`/book/${bookId}`);
                    }
                })}
                else{
                    req.flash('mssg','No copy of this title is availaible');
                    res.redirect(`/book/${bookId}`);
                }
            }
            
        })
        

    })
    .catch(err => {res.send(err);})
    
           
    
}
var returnLoanedBooks = async(req, res)=>{
    const copyId=req.body.bid;
    await Promise.all([
        User.findOneAndUpdate({username:req.user.username},{$pullAll :{loaned_books:[{_id:copyId}]}}).exec(),
        bookCopy.findByIdAndUpdate(copyId,{status:true,borrower:null,borrow_date:null}).exec()

    ])
    res.redirect('/books/loaned');
    
}

var searchBooks = async (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    var {title,author,genre}=req.body;
    const books = await Books.find({
        title: RegExp(title, "i"),
        author: RegExp(author, "i"),
        genre: RegExp(genre, "i")
      });
      res.render("book_list", { books, title: "Books | Library" ,bookinfo: {title: title, author: author,genre: genre }});

}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnLoanedBooks
}