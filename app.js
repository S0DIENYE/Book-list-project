// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}
// UI Constructor
function UI() {}


// Local Storage
function LS() {}

// Add book to List
UI.prototype.addBookToList = function(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // insert Cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    // append to list
    list.appendChild(row);

    console.log(book)
}

// Alert
UI.prototype.showAlert = function(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add Classname
    div.className = `alert ${className}`;
    // Add Text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container'),
          form = document.querySelector('#book-form');

    //   Insert alert msg
    container.insertBefore(div, form);

    // Timeout after 3s
    setTimeout(function() {
        document.querySelector('.alert').remove()
    }, 3000);

}

// Check LS for book
LS.prototype.checkLs = function() {
    
    let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
}

// Add book to LS
LS.prototype.addBookToLS = function(book) {
    const ls = new LS();
    const books = ls.checkLs();
    
    books.push(book);

    localStorage.setItem('books', `${JSON.stringify(books)}`)
    console.log(books);
    
}
// Persist to UI
LS.prototype.persistToUI = function(book) {
    const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // Add Book To UI
            ui.addBookToLS(book);
        });
}

// Remove from LS
LS.prototype.removeFromLS = function(userIsbn, isbnValue) {
    const ls = new LS();
    const books = ls.checkLs();

    // console.log('userIsbn =>', userIsbn);
    // console.log('isbnValue =>', isbnValue);
    // console.log(books.isbn); => undefined

    books.forEach(function(book, index) {
        if(book.isbn === isbn) {
            books.splice(index, 1);
            console.log(book, index);
        }
    });
   

    localStorage.setItem('books', JSON.stringify(books))
    // if(userIsbn === isbnValue) {
    //     console.log('valid isbn no')
    //     // console.log(JSON.stringify(books).indexOf(isbnValue)) => a bit shady
    //     // console.log(books.length) => works
    //     // console.log(books[1].isbn) => got the isbn
    //     // console.log(books[1].isbn)
    //     // splice stringify .length
    //     // books.splice(books.length, 1)
    //     console.log(books)
    //     console.log(books.splice(1, books.length))

    //     // localStorage.setItem('books', JSON.stringify(books));
    // }

    // *check ls
    // *Get isbn
    // get books array
    // splice array
    // splice array with index no
    // if isbn no = isbn then remove

    // localStorage.removeItem('books')
}

// Delete Book
UI.prototype.deleteBook = function(target) {
    if(target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}
// Clear Fields
UI.prototype.clearFields = function() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

// Event listener for add book
document.getElementById('book-form').addEventListener('submit',
 function(e) {
    // Form Values
   const title = document.getElementById('title').value,
         author = document.getElementById('author').value,
         isbn = document.getElementById('isbn').value;

    //  Instantiate book object to Constructor
    const book = new Book(title, author, isbn);

    // Instantiate the UI object
    const ui = new UI();

    const ls = new LS();

    // Validate
    if(title === '' || author === '' || isbn === ''){
        // Error Alert
        ui.showAlert('Please fill in all fields', 'error');
    }else{
        // Success Alert
        ui.showAlert('Book added sucessfully', 'success');
        
        // Add book to list
        ui.addBookToList(book);

        // Check Ls for book
        ls.checkLs();

        // Add book to ls
        ls.addBookToLS(book);

        // Persist to UI
        ui.persistToUI(book)

        // Clear Fields 
        ui.clearFields()

    }

    e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e) {
   
    // Instantiate the UI object
    const ui = new UI();

    // Instantiate LS
    const ls = new LS();

    // Remove book
    ui.deleteBook(e.target);

    // Remove from Ls
    ls.removeFromLS(e.target.parentElement.previousElementSibling.textContent, e.target.parentElement.previousElementSibling.textContent);

    // Show Message
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});