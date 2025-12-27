CREATE TABLE Customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE Category (
    cat_id INT PRIMARY KEY AUTO_INCREMENT,
    cat_name VARCHAR(30) UNIQUE NOT NULL
);


CREATE TABLE Author (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);


CREATE TABLE Publisher (
    publisher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20)
);


CREATE TABLE Book (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    pub_year INT,
    price DECIMAL(8,2) NOT NULL,
    stock_qty INT NOT NULL CHECK (stock_qty >= 0),
    threshold INT NOT NULL,
    publisher_id INT,
    cat_id INT,

    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id),
    FOREIGN KEY (cat_id) REFERENCES Category(cat_id)
);


CREATE TABLE Book_Author (
    isbn VARCHAR(20),
    author_id INT,
    PRIMARY KEY (isbn, author_id),
    FOREIGN KEY (isbn) REFERENCES Book(isbn),
    FOREIGN KEY (author_id) REFERENCES Author(author_id)
);


CREATE TABLE Cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT UNIQUE,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);


CREATE TABLE Cart_Item (
    cart_id INT,
    isbn VARCHAR(20),
    qty INT NOT NULL CHECK (qty > 0),
    PRIMARY KEY (cart_id, isbn),
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
);


CREATE TABLE Customer_Order (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_price DECIMAL(10,2),
    credit_card_no VARCHAR(20),
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed')),

    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);



CREATE TABLE Customer_Order_Book (
    order_id INT,
    isbn VARCHAR(20),
    qty INT NOT NULL CHECK (qty > 0),
    price_at_purchase DECIMAL(8,2) NOT NULL,

    PRIMARY KEY (order_id, isbn),
    FOREIGN KEY (order_id) REFERENCES Customer_Order(order_id),
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
);


CREATE TABLE Publisher_Order (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    publisher_id INT NOT NULL,
    admin_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Confirmed')),

    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id),
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
);



CREATE TABLE Publisher_Order_Book (
    order_id INT,
    isbn VARCHAR(20),
    qty INT NOT NULL CHECK (qty > 0),

    PRIMARY KEY (order_id, isbn),
    FOREIGN KEY (order_id) REFERENCES Publisher_Order(order_id),
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
);
