// Constants
const BOOK_STORAGE_KEY = 'books';
const ALERT_SUCCESS = 'success';
const ALERT_ERROR = 'error';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

// Book class
class Book {
  constructor(title, author, isbn, category, cover) {
    if (typeof title !== 'string' || typeof author !== 'string' || typeof isbn !== 'string' || typeof category !== 'string') {
      throw new Error('Invalid book properties');
    }
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
    this.cover = cover;
  }
}

// UI class
class UI {
  static displayBooks(booksToDisplay) {
    try {
      const bookList = document.getElementById('book-list');
      bookList.innerHTML = '';
      booksToDisplay.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td>${book.category}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="UI.editBook(${index})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="UI.deleteBook(${index})">Delete</button>
          </td>
        `;
        bookList.appendChild(row);
      });
    } catch (error) {
      UI.showAlert('Error displaying books', ALERT_ERROR);
    }
  }

  static clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
    document.getElementById('category').value = '';
    document.getElementById('cover').value = '';
  }

  static showAlert(message, type) {
    try {
      toastr[type](message);
    } catch (error) {
      console.error('Error showing alert:', error);
    }
  }

  static confirmAndProceed(prompt, callback) {
    if (confirm(prompt)) {
      callback();
    }
  }

  static editBook(index) {
    UI.confirmAndProceed('Are you sure you want to edit this book?', () => {
      const book = Store.getBooks()[index];
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('isbn').value = book.isbn;
      document.getElementById('category').value = book.category;
      Store.deleteBook(index);
      UI.displayBooks(Store.getBooks());
      UI.showAlert('Book edited successfully!', ALERT_SUCCESS);
    });
  }

  static deleteBook(index) {
    UI.confirmAndProceed('Are you sure you want to delete this book?', () => {
      Store.deleteBook(index);
      UI.displayBooks(Store.getBooks());
      UI.showAlert('Book deleted successfully!', ALERT_SUCCESS);
    });
  }
}

// Store class
class Store {
  static getBooks() {
    try {
      let books = JSON.parse(localStorage.getItem(BOOK_STORAGE_KEY)) || [];
      return books;
    } catch (error) {
      UI.showAlert('Error getting books from storage', ALERT_ERROR);
      return [];
    }
  }

  static addBook(book) {
    try {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      UI.showAlert('Error adding book to storage', ALERT_ERROR);
    }
  }

  static deleteBook(index) {
    try {
      const books = Store.getBooks();
      books.splice(index, 1);
      localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      UI.showAlert('Error deleting book from storage', ALERT_ERROR);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('book-form');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sort');
  let books = Store.getBooks();

  UI.displayBooks(books);

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const isbn = document.getElementById('isbn').value.trim();
    const category = document.getElementById('category').value;
    const cover = document.getElementById('cover').files[0];

    if (!validateBook(title, author, isbn)) return;

    if (cover && !validateCover(cover)) return;

    try {
      const book = new Book(title, author, isbn, category, cover ? cover.name : null);
      Store.addBook(book);
      UI.displayBooks(Store.getBooks());
      UI.clearFields();
      UI.showAlert('Book added successfully!', ALERT_SUCCESS);
    } catch (error) {
      UI.showAlert('Error creating book', ALERT_ERROR);
    }
  });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredBooks = Store.getBooks().filter(book => 
      book.title.toLowerCase().includes(searchTerm) || 
      book.author.toLowerCase().includes(searchTerm) || 
      book.isbn.includes(searchTerm)
    );
    UI.displayBooks(filteredBooks);
  });

  sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const sortedBooks = Store.getBooks().sort((a, b) => a[sortBy].localeCompare(b[sortBy]);
    UI.displayBooks(sortedBooks);
  });

  function validateBook(title, author, isbn) {
    if (!title || !author || !isbn) {
      UI.showAlert('Please fill in all required fields!', ALERT_ERROR);
      return false;
    }
    if (!/^\d{10}$/.test(isbn)) {
      UI.showAlert('Invalid ISBN! Please enter a 10-digit ISBN.', ALERT_ERROR);
      return false;
    }
    return true;
  }

  function validateCover(cover) {
    const fileExtension = cover.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      UI.showAlert(`Invalid file type! Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed.`, ALERT_ERROR);
      return false;
    }
    if (cover.size > MAX_FILE_SIZE) {
      UI.showAlert(`File too large! Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`, ALERT_ERROR);
      return false;
    }
    return true;
  }
});

let selectedPlan = '';
let selectedPrice = '';

function selectPlan(plan, price) {
  selectedPlan = plan;
  selectedPrice = price;
  document.getElementById('plan').value = plan;
  document.getElementById('price').value = `₹${price}/month`;
}

document.getElementById('signUpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const plan = selectedPlan;
  const price = selectedPrice;

  // Add your sign up logic here
  console.log(name, email, password, plan, price);
  UI.showAlert('Sign up successful!', ALERT_SUCCESS);
  $('#signUpModal').modal('hide');
});

document.getElementById('signUpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const plan = selectedPlan;
  const price = selectedPrice;

  if (!validateSignUp(name, email, password)) return;

  const user = {
    name,
    email,
    password,
    plan,
    price,
    subscriptionDate: new Date(),
    status: 'active'
  };

  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      UI.showAlert('Email already exists!', ALERT_ERROR);
      return;
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    UI.showAlert('Sign up successful!', ALERT_SUCCESS);
    $('#signUpModal').modal('hide');
  } catch (error) {
    UI.showAlert('Error signing up!', ALERT_ERROR);
  }
});

function validateSignUp(name, email, password) {
  if (!name || !email || !password) {
    UI.showAlert('Please fill in all fields!', ALERT_ERROR);
    return false;
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    UI.showAlert('Invalid email address!', ALERT_ERROR);
    return false;
  }
  if (password.length < 8) {
    UI.showAlert('Password must be at least 8 characters!', ALERT_ERROR);
    return false;
  }
  return true;
}