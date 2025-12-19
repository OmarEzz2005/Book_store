-- ==========================
--        USERS TABLE


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL
);


CREATE TABLE admins (
  user_id INT PRIMARY KEY,
  CONSTRAINT fk_admin_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


CREATE TABLE customers (
  user_id INT PRIMARY KEY,
  fname VARCHAR(50),
  lname VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  address VARCHAR(255),

  CONSTRAINT fk_customer_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);




CREATE TABLE Publisher (
  publisher_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  address VARCHAR(200),
  phone VARCHAR(30)
);



CREATE TABLE Book (
  isbn VARCHAR(20) PRIMARY KEY,
  title VARCHAR(100),
  price DECIMAL(10,2),
  category VARCHAR(20),
  pub_year INT,
  publisher_id INT,
  threshold INT,
  qty INT,

  FOREIGN KEY (publisher_id)
    REFERENCES Publisher(publisher_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);



CREATE TABLE Author (
  author_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);



CREATE TABLE Author_Book (
  isbn VARCHAR(20),
  author_id INT,

  PRIMARY KEY (isbn, author_id),

  FOREIGN KEY (isbn)
    REFERENCES Book(isbn)
    ON DELETE CASCADE,

  FOREIGN KEY (author_id)
    REFERENCES Author(author_id)
    ON DELETE CASCADE
);

-- ==========================
--           CART
-- ==========================
CREATE TABLE Cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,

  FOREIGN KEY (customer_id)
    REFERENCES customers(user_id)
    ON DELETE CASCADE
);

-- ==========================
--         CART ITEM
-- ==========================
CREATE TABLE Cart_Item (
  cart_id INT,
  isbn VARCHAR(20),
  qty INT,

  PRIMARY KEY (cart_id, isbn),

  FOREIGN KEY (cart_id)
    REFERENCES Cart(cart_id)
    ON DELETE CASCADE,

  FOREIGN KEY (isbn)
    REFERENCES Book(isbn)
    ON DELETE CASCADE
);



CREATE TABLE Sales (
  sale_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) DEFAULT 0,

  FOREIGN KEY (customer_id)
    REFERENCES customers(user_id)
    ON DELETE SET NULL
);



CREATE TABLE Sales_Item (
  sale_id INT,
  isbn VARCHAR(20),
  qty INT,
  price DECIMAL(10,2),

  PRIMARY KEY (sale_id, isbn),

  FOREIGN KEY (sale_id)
    REFERENCES Sales(sale_id)
    ON DELETE CASCADE,

  FOREIGN KEY (isbn)
    REFERENCES Book(isbn)
    ON DELETE CASCADE
);

CREATE TABLE Orders_From_Publishers (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20),
  publisher_id INT,
  qty INT,
  order_date DATETIME,
  status VARCHAR(20),

  FOREIGN KEY (isbn)
    REFERENCES Book(isbn)
    ON DELETE CASCADE,

  FOREIGN KEY (publisher_id)
    REFERENCES Publisher(publisher_id)
    ON DELETE CASCADE
);
