#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
// Classes for Library Management
class Book {
    title;
    author;
    isbn;
    year;
    isBorrowed;
    constructor(title, author, isbn, year) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.isBorrowed = false;
    }
    toString() {
        return `'${this.title}' by ${this.author}\nISBN: ${this.isbn}\nYear: ${this.year}`;
    }
}
class Member {
    name;
    borrowedBooks;
    constructor(name) {
        this.name = name;
        this.borrowedBooks = [];
    }
    borrowBook(book) {
        if (!book.isBorrowed) {
            book.isBorrowed = true;
            this.borrowedBooks.push(book);
            console.log(chalk.green(`${this.name} has borrowed ${book.title}.`));
        }
        else {
            console.log(chalk.green(`Sorry, ${book.title} is already borrowed.`));
        }
    }
    returnBook(book) {
        const index = this.borrowedBooks.indexOf(book);
        if (index !== -1) {
            book.isBorrowed = false;
            this.borrowedBooks.splice(index, 1);
            console.log(chalk.green(`${this.name} has returned ${book.title}.`));
        }
        else {
            console.log(chalk.green(`${this.name} did not borrow ${book.title}.`));
        }
    }
    toString() {
        return chalk.green(`Member: ${this.name}, Borrowed Books: [${this.borrowedBooks.map(book => book.title).join(', ')}]`);
    }
}
class Library {
    books;
    constructor() {
        this.books = [];
    }
    addBook(book) {
        this.books.push(book);
        console.log(chalk.green(`Added ${book.title} to the library.`));
    }
    addBooksByDepartment(department, books) {
        console.log(chalk.blue(`\nAdding books for department: ${department}\n`));
        books.forEach((book, index) => {
            this.addBook(book);
            console.log(chalk.yellow(`Department: ${department}, Serial No: ${index + 1}, Book: ${book.title}`));
        });
    }
    removeBook(book) {
        const index = this.books.indexOf(book);
        if (index !== -1) {
            this.books.splice(index, 1);
            console.log(chalk.green(`Removed ${book.title} from the library.`));
        }
        else {
            console.log(chalk.green(`${book.title} not found in the library.`));
        }
    }
    listBooksByDepartment(department) {
        console.log(`Listing books for department: ${department}`);
        const books = departments[department.toLowerCase().replace(/\s+/g, "")];
        if (books) {
            console.log(chalk.magenta(`Books available in the ${department} department:`));
            books.forEach((book, index) => console.log(chalk.cyan(`${index + 1}. ${book}\n`)));
        }
        else {
            console.log(chalk.green("Department not found."));
        }
    }
    searchBookByISBN(isbn) {
        return this.books.find(book => book.isbn === isbn);
    }
}
// Function to create a banner
function createBanner(text) {
    figlet(text, (err, data) => {
        if (err) {
            console.error(chalk.red('Something went wrong...'));
            console.dir(err);
            return;
        }
        console.log(chalk.blue(data));
        // Call the prompt function after displaying the banner
        promptUser();
    });
}
// Function to prompt the user with choices
function promptUser() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["Add books to library", "List books by department", "Search book by ISBN", "Borrow book", "Return book", "Exit"]
        }
    ]).then(answer => {
        // Perform action based on user's choice
        switch (answer.action) {
            case "Add books to library":
                addBooksToLibrary();
                break;
            case "List books by department":
                listBooksByDepartment();
                break;
            case "Search book by ISBN":
                searchBookByISBN();
                break;
            case "Borrow book":
                borrowBook();
                break;
            case "Return book":
                returnBook();
                break;
            case "Exit":
                console.log(chalk.magenta.italic("THANKYOU FOR COMING.."));
                break;
        }
    });
}
// Function to add books to the library
function addBooksToLibrary() {
    const departmentChoices = Object.keys(departments).map(key => {
        return {
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
            value: key
        };
    });
    inquirer.prompt([
        {
            type: "checkbox",
            name: "departments",
            message: "Select departments to add books from:",
            choices: departmentChoices
        }
    ]).then(answer => {
        answer.departments.forEach((dept) => {
            library.addBooksByDepartment(dept, departments[dept]);
        });
        promptUser(); // Prompt user again after adding books
    });
}
// Function to list books by department
function listBooksByDepartment() {
    inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "Select a department to list books:",
            choices: ["Microbiology", "Psychology", "Pharmacy", "Computer Science", "Arts"]
        }
    ]).then(answer => {
        library.listBooksByDepartment(answer.department);
        promptUser(); // Prompt user again after listing books
    });
}
// Function to search books by ISBN
function searchBookByISBN() {
    inquirer.prompt([
        {
            type: "input",
            name: "isbn",
            message: "Enter the ISBN of the book you want to search:"
        }
    ]).then(answer => {
        const book = library.searchBookByISBN(answer.isbn);
        if (book) {
            console.log(chalk.green("Book found:"), book);
        }
        else {
            console.log(chalk.green("Book not found."));
        }
        promptUser(); // Prompt user again after searching book
    });
}
// Function to allow a member to borrow books
function borrowBook() {
    inquirer.prompt([
        {
            type: "input",
            name: "memberName",
            message: "Enter your name:"
        },
        {
            type: "input",
            name: "isbn",
            message: "Enter the ISBN of the book you want to borrow:"
        }
    ]).then(answer => {
        const member = new Member(answer.memberName);
        const book = library.searchBookByISBN(answer.isbn);
        if (book) {
            member.borrowBook(book);
        }
        else {
            console.log(chalk.green("Book not found."));
        }
        promptUser(); // Prompt user again after borrowing books
    });
}
// Function to allow a member to return books
function returnBook() {
    inquirer.prompt([
        {
            type: "input",
            name: "isbn",
            message: "Enter the ISBN of the book you want to return:"
        },
        {
            type: "input",
            name: "department",
            message: "Enter the department of the book you want to return:"
        }
    ]).then(answer => {
        const book = library.searchBookByISBN(answer.isbn);
        if (book) {
            console.log("Book found:", book);
            // Add the book back to the department's list of books
            const departmentBooks = departments[answer.department.toLowerCase().replace(/\s+/g, "")];
            if (departmentBooks) {
                book.isBorrowed = false;
                departmentBooks.push(book);
                console.log(chalk.green(`${book.title} returned to the ${answer.department} department.`));
            }
            else {
                console.log(chalk.red("Department not found."));
            }
        }
        else {
            console.log(chalk.red("Book not found."));
        }
        promptUser(); // Prompt user again after returning book
    });
}
// Departments and their books
const departments = {
    microbiology: [
        new Book("Principles of Virology", "S.J. Flint", "9781555812591", 2009),
        new Book("Molecular Immunobiology", "Kenneth Murphy", "9780815345312", 2011),
        new Book("Clinical Microbiology ", "Mark Gladwin", "9781935660156", 2013),
        new Book("Epidemiology", "Kenneth J. Rothman", "9780199754557", 2012),
        new Book("Computational Microbiology", "Iman Tavassoly", "9781493962769", 2017),
        new Book("Marine Microbiology", "Colin Munn", "9780815341468", 2011)
    ],
    psychology: [
        new Book("Introduction to Psychology", "James W. Kalat", "9781305271555", 2016),
        new Book("Psychology From Inquiry to Understanding", "Scott O. Lilienfeld", "9780134552514", 2017),
        new Book("Abnormal Psychology", "Ronald J. Comer", "9781464171703", 2015),
        new Book("Social Psychology", "David Myers", "9780077825454", 2015),
        new Book("Developmental Psychology", "Frank Keil", "9781464171703", 2014),
        new Book("Cognitive Psychology", "E. Bruce Goldstein", "9781285763880", 2014)
    ],
    pharmacy: [
        new Book("Basic and Clinical Pharmacology", "Bertram G. Katzung", "9781260452310", 2018),
        new Book("The Pharmacological Basis of Therapeutics", "Laurence L. Brunton", "9781259584732", 2017),
        new Book("Pharmacotherapy", "Joseph T. DiPiro", "9781260116816", 2017),
        new Book("Rang & Dale's Pharmacology", "Humphrey P. Rang", "9780702074486", 2018),
        new Book("The Complete Drug Reference", "Sean C. Sweetman", "9780857113092", 2017),
        new Book("The Science and Practice of Pharmacy", "Loyd V. Allen Jr.", "9780857112712", 2012)
    ],
    computerscience: [
        new Book("Introduction to Algorithms", "Thomas H. Cormen", "9780262533058", 2009),
        new Book("A Handbook of Software Craftsmanship", "Robert C. Martin", "9780132350884", 2008),
        new Book("The Pragmatic Programmer", "Andrew Hunt", "9780135957059", 2019),
        new Book("Elements of Reusable Object-Oriented Software", "Erich Gamma", "9780201633610", 1994),
        new Book("Code Complete", "Steve McConnell", "9780735619678", 2004),
        new Book("Cracking the Coding Interview", "Gayle Laakmann McDowell", "9780984782857", 2015)
    ],
    arts: [
        new Book("Art Through the Ages", "Helen Gardner", "9780155037699", 2000),
        new Book("The Story of Art", "E.H. Gombrich", "9780714847030", 1995),
        new Book("History of Modern Art", "H.H. Arnason", "9780205259472", 2012),
        new Book("The Art Book", "Phaidon Editors", "9780714864679", 2012),
        new Book("Ways of Seeing", "John Berger", "9780141035796", 2008),
        new Book("The Invisible Art", "Scott McCloud", "9780060976255", 1994)
    ]
};
// Main program
const library = new Library();
// Display the banner
createBanner("LIBRARY MANAGEMENT");
