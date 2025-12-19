DELIMITER $$

-- Prevent negative stock
CREATE TRIGGER prevent_negative_stock
BEFORE UPDATE ON Book
FOR EACH ROW
BEGIN
  IF NEW.qty < 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Quantity cannot be negative';
  END IF;
END$$

-- Auto place order
CREATE TRIGGER auto_place_order
AFTER UPDATE ON Book
FOR EACH ROW
BEGIN
  IF NEW.qty < NEW.threshold AND OLD.qty >= OLD.threshold THEN
    INSERT INTO Orders_From_Publishers
      (isbn, publisher_id, qty, order_date, status)
    VALUES
      (NEW.isbn, NEW.publisher_id, 20, NOW(), 'Pending');
  END IF;
END$$

-- Confirm order → add stock
CREATE TRIGGER confirm_order_add_stock
AFTER UPDATE ON Orders_From_Publishers
FOR EACH ROW
BEGIN
  IF NEW.status = 'Confirmed' AND OLD.status <> 'Confirmed' THEN
    UPDATE Book
    SET qty = qty + NEW.qty
    WHERE isbn = NEW.isbn;
  END IF;
END$$

-- Deduct stock after sale
CREATE TRIGGER deduct_stock_after_sale
AFTER INSERT ON Sales_Item
FOR EACH ROW
BEGIN
  UPDATE Book
  SET qty = qty - NEW.qty
  WHERE isbn = NEW.isbn;
END$$

-- Update sales total
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
