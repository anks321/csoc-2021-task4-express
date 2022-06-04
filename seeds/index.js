
  const books = require("./books.json").books;
  const Book = require("../models/book");
  const BookCopy = require("../models/bookCopy");
  const mongoose = require("mongoose");
  
  var MongoURI = require('../Config/db').MongoURI;
  /* TODO: CONNECT MONGOOSE WITH OUR MONGO DB  */
  mongoose.connect(MongoURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
    .then(()=> {
      console.log("Connected to Database");
    })
    .catch(err=>console.log(err));
 
  
  const seedDB = async () => {
    await Promise.all([Book.deleteMany({}), BookCopy.deleteMany({})]);
    for (let book of books) {
      const new_book = new Book({
        title: book.title,
        author: book.author,
        mrp: Math.round(book.price * 75),
        genre: "Fiction",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque eveniet delectus molestias soluta esse animi sunt quasi autem ullam mollitia consectetur impedit repudiandae laudantium odio, tempore quam nostrum. Vel aliquid officia sunt unde, cum velit, nostrum dolorum alias quia, consequuntur quam porro ullam dignissimos! Dicta vel quo aliquam et praesentium!",
        rating: 3
      });
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        let new_book_copy = new BookCopy({
          book: new_book._id,
          status: true
        });
        await new_book_copy.save();
        new_book.availaible_copies.push(new_book_copy._id);
      }
      await new_book.save();
    }
  };
  
  seedDB().then(() => {
    mongoose.connection.close();
  });
  
  // console.log(books);