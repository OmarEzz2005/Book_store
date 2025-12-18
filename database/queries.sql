-- ==========================
-- TRIGGERS FOR BOOKSTORE DB
-- ==========================

-- TRIGGER 1 — Prevent Negative Stock
DELIMITER $$

CREATE TRIGGER prevent_negative_stock
BEFORE UPDATE ON Book
FOR EACH ROW
BEGIN
    IF NEW.qty < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Quantity cannot be negative.';
    END IF;
END$$

-- TRIGGER 2 — Auto Place Order When Stock Drops Below Threshold
CREATE TRIGGER auto_place_order
AFTER UPDATE ON Book
FOR EACH ROW
BEGIN
    DECLARE order_qty INT DEFAULT 20;

    -- Trigger only when qty drops below threshold
    IF NEW.qty < NEW.threshold AND OLD.qty >= OLD.threshold THEN
        INSERT INTO Orders_From_Publishers (isbn, publisher_id, qty, order_date, status)
        VALUES (NEW.isbn, NEW.publisher_id, order_qty, NOW(), 'Pending');
    END IF;
END$$

-- TRIGGER 3 — Confirm Order → Add Books to Stock
CREATE TRIGGER confirm_order_add_stock
AFTER UPDATE ON Orders_From_Publishers
FOR EACH ROW
BEGIN
    -- Trigger only when status changes to "Confirmed"
    IF NEW.status = 'Confirmed' AND OLD.status <> 'Confirmed' THEN
        UPDATE Book
        SET qty = qty + NEW.qty
        WHERE isbn = NEW.isbn;
    END IF;
END$$

-- TRIGGER 4 — Deduct Stock When Sale Happens
CREATE TRIGGER deduct_stock_after_sale
AFTER INSERT ON Sales_Item
FOR EACH ROW
BEGIN
    UPDATE Book
    SET qty = qty - NEW.qty
    WHERE isbn = NEW.isbn;
END$$

-- TRIGGER 5 — Auto Update Sales Total
CREATE TRIGGER update_sales_total
AFTER INSERT ON Sales_Item
FOR EACH ROW
BEGIN
    UPDATE Sales
    SET total = (
        SELECT SUM(qty * price)
        FROM Sales_Item
        WHERE sale_id = NEW.sale_id
    )
    WHERE sale_id = NEW.sale_id;
END$$

DELIMITER ;
