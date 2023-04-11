class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    
    addBookToList(book,) {
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

        // console.log(book);
    }

    showAlert(message, className) {
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

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // Add Book To UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        console.log(books)
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
                console.log(book, index);
            }
        });
       

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

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

    // Validate
    if(title === '' || author === '' || isbn === ''){
        // Error Alert
        ui.showAlert('Please fill in all fields', 'error');
    }else{
        // Clear Fields 
        ui.clearFields()

        // Add to localstorage
        Store.addBook(book);

        // Success Alert
        ui.showAlert('Book added sucessfully', 'success');
        
        // Add book to list
        ui.addBookToList(book);

    }

    e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e) {
   
    // Instantiate the UI object
    const ui = new UI();

    ui.deleteBook(e.target);

    // Remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show Message
    ui.showAlert('Book Removed!', 'success');
    
    e.preventDefault();
});