DELIMITER $$

CREATE TRIGGER prevent_negative_stock
BEFORE UPDATE ON Book
FOR EACH ROW
BEGIN
    IF NEW.stock_qty < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock quantity cannot be negative';
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER auto_place_publisher_order
AFTER UPDATE ON Book
FOR EACH ROW
BEGIN
    DECLARE new_order_id INT;

    IF OLD.stock_qty >= OLD.threshold
       AND NEW.stock_qty < NEW.threshold THEN

        INSERT INTO Publisher_Order (
            publisher_id,
            admin_id,
            order_date,
            status
        )
        VALUES (
            NEW.publisher_id,
            1, -- predefined admin (can be changed)
            CURDATE(),
            'Pending'
        );

        SET new_order_id = LAST_INSERT_ID();

        INSERT INTO Publisher_Order_Book (
            order_id,
            isbn,
            qty
        )
        VALUES (
            new_order_id,
            NEW.isbn,
            50 -- constant quantity (fixed as required)
        );
    END IF;
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER confirm_publisher_order
AFTER UPDATE ON Publisher_Order
FOR EACH ROW
BEGIN
    IF OLD.status <> 'Confirmed'
       AND NEW.status = 'Confirmed' THEN

        UPDATE Book b
        JOIN Publisher_Order_Book pob
            ON b.isbn = pob.isbn
        SET b.stock_qty = b.stock_qty + pob.qty
        WHERE pob.order_id = NEW.order_id;

    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER deduct_stock_after_purchase
AFTER INSERT ON Customer_Order_Book
FOR EACH ROW
BEGIN
    UPDATE Book
    SET stock_qty = stock_qty - NEW.qty
    WHERE isbn = NEW.isbn;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER update_order_total
AFTER INSERT ON Customer_Order_Book
FOR EACH ROW
BEGIN
    UPDATE Customer_Order
    SET total_price = (
        SELECT SUM(qty * price_at_purchase)
        FROM Customer_Order_Book
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER clear_cart_on_customer_delete
AFTER DELETE ON Customer
FOR EACH ROW
BEGIN
    DELETE FROM Cart_Item
    WHERE cart_id IN (
        SELECT cart_id FROM Cart WHERE customer_id = OLD.customer_id
    );
END$$

DELIMITER ;
