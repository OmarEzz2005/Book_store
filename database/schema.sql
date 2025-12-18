-- ==========================
--       PUBLISHER
-- ==========================


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20)
);



CREATE TABLE Publisher (
    publisher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    address VARCHAR(200),
    phone VARCHAR(30)
);

-- ==========================
--          BOOK
-- ==========================
CREATE TABLE Book (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(100),
    price DECIMAL(10,2),
    category VARCHAR(20),
    pub_year INT,
    publisher_id INT NULL,
    threshold INT,
    qty INT,
    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ==========================
--         AUTHOR
-- ==========================
CREATE TABLE Author (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

-- ==========================
--     AUTHOR - BOOK (M:M)
-- ==========================
CREATE TABLE Author_Book (
    isbn VARCHAR(20),
    author_id INT,
    PRIMARY KEY (isbn, author_id),
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (author_id) REFERENCES Author(author_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==========================
--        CUSTOMER
-- ==========================
CREATE TABLE Customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    fname VARCHAR(50),
    lname VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(30),
    address VARCHAR(200)
);

-- ==========================
--          ADMIN
-- ==========================
CREATE TABLE Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100)
);

-- ==========================
--           CART
-- ==========================
CREATE TABLE Cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==========================
--         CART ITEM
-- ==========================
CREATE TABLE Cart_Item (
    cart_id INT,
    isbn VARCHAR(20),
    qty INT,
    PRIMARY KEY (cart_id, isbn),
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==========================
--           SALES
-- ==========================
CREATE TABLE Sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    sale_date DATETIME,
    total DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ==========================
--       SALES ITEM
-- ==========================
CREATE TABLE Sales_Item (
    sale_id INT,
    isbn VARCHAR(20),
    qty INT,
    price DECIMAL(10,2),
    PRIMARY KEY (sale_id, isbn),
    FOREIGN KEY (sale_id) REFERENCES Sales(sale_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==========================
-- ORDERS FROM PUBLISHERS
-- ==========================
CREATE TABLE Orders_From_Publishers (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20),
    publisher_id INT,
    qty INT,
    order_date DATETIME,
    status VARCHAR(20),
    FOREIGN KEY (isbn) REFERENCES Book(isbn)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
