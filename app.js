// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector(".book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td class="wrap-td">${book.title}</td>
        <td class="wrap-td">${book.author}</td>
        <td class="wrap-td">${book.isbn}</td>
        <td class="wrap-td"><a href="#" class="btn btn-danger btn-sm
        delete">Delete</a></td>
    `;

    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.classList.add(className);
    div.innerHTML = message;
    const bookContainer = document.querySelector(".book-form-container");
    const form = document.getElementById("book-form");
    bookContainer.insertBefore(div, form);

    //Clear Alert Box after 2 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

//Store Class: Handles Storage(LocalStorage)
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // validation
  if (title == "" || author == "" || isbn == "") {
    UI.showAlert("please fill all inputs", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to localStorage
    Store.addBook(book);

    // Show success message for adding a book
    UI.showAlert("Book added", "success");

    // Clear input fields
    UI.clearFields();
  }
});

//Event: Remove a Book
document.querySelector(".book-list").addEventListener("click", (e) => {
  // Remove a Book from UI
  UI.deleteBook(e.target);

  // Remove a Book from localStorage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show success message for removing a book
  UI.showAlert("Book removed", "success");
});
