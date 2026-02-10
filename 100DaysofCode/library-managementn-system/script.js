// Book class
class Book {
    constructor(title, author, genre, description) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
        this.borrowed = false;
        this.borrower = null;
        this.borrowDate = null;
        this.returnDate = null;
        this.reviews = [];
        this.ratings = [];
    }

    addReview(review) {
        this.reviews.push(review);
    }

    addRating(rating) {
        this.ratings.push(rating);
    }

    getAverageRating() {
        if (this.ratings.length === 0) return 0;
        return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
    }
}

// User class
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.borrowingHistory = [];
        this.favoriteBooks = [];
    }

    addBorrowingHistory(book) {
        this.borrowingHistory.push(book);
    }

    addFavoriteBook(book) {
        this.favoriteBooks.push(book);
    }
}

// Library class
class Library {
    constructor() {
        this.books = [];
        this.users = [
            new User('admin', 'password123'),
            // Add more users here...
        ];
        this.loggedInUser = null;
        this.loadBooks();
        this.loadUsers();
    }

    addBook(book) {
        this.books.push(book);
        this.saveBooks();
        this.renderBookList();
    }

    removeBook(title) {
        this.books = this.books.filter(book => book.title !== title);
        this.saveBooks();
        this.renderBookList();
    }

    editBook(title, newTitle, newAuthor, newGenre, newDescription) {
        const book = this.books.find(book => book.title === title);
        if (book) {
            book.title = newTitle;
            book.author = newAuthor;
            book.genre = newGenre;
            book.description = newDescription;
            this.saveBooks();
            this.renderBookList();
        }
    }

    borrowBook(title, borrower, borrowDate, returnDate) {
        const book = this.books.find(book => book.title === title);
        if (book && !book.borrowed) {
            book.borrowed = true;
            book.borrower = borrower;
            book.borrowDate = borrowDate;
            book.returnDate = returnDate;
            this.loggedInUser.addBorrowingHistory(book);
            this.saveBooks();
            this.saveUsers();
            this.renderBookList();
        } else {
            alert('Book is not available');
        }
    }

    addUser(user) {
        this.users.push(user);
        this.saveUsers();
    }

    registerUser(username, password) {
        const existingUser = this.users.find(user => user.username === username);
        if (existingUser) {
            alert('Username already exists!');
        } else {
            const newUser = new User(username, password);
            this.addUser(newUser);
            alert('Registration successful!');
        }
    }

    login(username, password) {
        const user = this.users.find(user => user.username === username && user.password === password);
        if (user) {
            this.loggedInUser = user;
            alert('Logged in successfully!');
            // Redirect to user profile page
            window.location.href = '#user-profile';
        } else {
            alert('Invalid username or password');
        }
    }

    renderBookList() {
        const bookListBody = document.getElementById('book-list-body');
        bookListBody.innerHTML = '';
        this.books.forEach((book, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.borrowed ? 'Borrowed' : 'Available'}</td>
            `;
            bookListBody.appendChild(row);
        });
    }

    renderBookDetails(title) {
        const book = this.books.find(book => book.title === title);
        if (book) {
            document.getElementById('book-title').innerText = book.title;
            document.getElementById('book-author').innerText = book.author;
            document.getElementById('book-genre').innerText = book.genre;
            document.getElementById('book-description').innerText = book.description;
            const reviewList = document.getElementById('review-list');
            reviewList.innerHTML = '';
            book.reviews.forEach(review => {
                const li = document.createElement('li');
                li.innerText = review;
                reviewList.appendChild(li);
            });
            document.getElementById('average-rating').innerText = `Average Rating: ${book.getAverageRating()}`;
        }
    }

    renderUserProfile() {
        if (this.loggedInUser) {
            document.getElementById('user-name').innerText = this.loggedInUser.username;
            const borrowingList = document.getElementById('borrowing-list');
            borrowingList.innerHTML = '';
            this.loggedInUser.borrowingHistory.forEach(book => {
                const li = document.createElement('li');
                li.innerText = book.title;
                borrowingList.appendChild(li);
            });
            const favoriteList = document.getElementById('favorite-list');
            favoriteList.innerHTML = '';
            this.loggedInUser.favoriteBooks.forEach(book => {
                const li = document.createElement('li');
                li.innerText = book.title;
                favoriteList.appendChild(li);
            });
        }
    }

    renderAdminDashboard() {
        const bookManagementBody = document.getElementById('book-management-body');
        bookManagementBody.innerHTML = '';
        this.books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td><button onclick="library.editBook('${book.title}')">Edit</button> <button onclick="library.removeBook('${book.title}')">Remove</button></td>
            `;
            bookManagementBody.appendChild(row);
        });
        const userManagementBody = document.getElementById('user-management-body');
        userManagementBody.innerHTML = '';
        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.username}</td>
                <td><button onclick="library.removeUser('${user.username}')">Remove</button></td>
            `;
            userManagementBody.appendChild(row);
        });
    }

    searchBooks(query) {
        const bookListBody = document.getElementById('book-list-body');
        bookListBody.innerHTML = '';
        this.books.forEach(book => {
            if (book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase())) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre}</td>
                    <td>${book.borrowed ? 'Borrowed' : 'Available'}</td>
                `;
                bookListBody.appendChild(row);
            }
        });
    }

    saveBooks() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }

    loadBooks() {
        const storedBooks = localStorage.getItem('books');
        if (storedBooks) {
            this.books = JSON.parse(storedBooks);
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    loadUsers() {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        }
    }
}

// Initialize library
const library = new Library();

// Add event listeners
document.getElementById('add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const genre = document.getElementById('book-genre').value;
    const description = prompt('Enter book description');
    const book = new Book(title, author, genre, description);
    library.addBook(book);
    document.getElementById('add-book-form').reset();
});

document.getElementById('borrow-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('borrow-book-title').value.trim();
    const borrower = document.getElementById('borrower-name').value.trim();
    const borrowDate = document.getElementById('borrow-date').value;
    const returnDate = document.getElementById('return-date').value;

    if (!title || !borrower || !borrowDate || !returnDate) {
        alert('Please fill in all fields');
        return;
    }

    if (new Date(returnDate) < new Date(borrowDate)) {
        alert('Return date cannot be before borrow date');
        return;
    }

    const book = library.books.find(book => book.title.toLowerCase() === title.toLowerCase());
    if (!book) {
        alert('Book not found');
        return;
    }

    if (book.borrowed) {
        alert('Book is currently borrowed');
        return;
    }

    library.borrowBook(title, borrower, borrowDate, returnDate);
    document.getElementById('borrow-book-form').reset();
    alert('Book borrowed successfully!');
});

document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

document.querySelectorAll('a[href="#terms-and-conditions"]').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('terms-and-conditions').style.display = 'block';
    });
});

document.querySelectorAll('a[href="#contact-us"]').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('contact-us').style.display = 'block';
    });
});