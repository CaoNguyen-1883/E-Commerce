package dev.CaoNguyen_1883.ecommerce.common.exception;

public class OutOfStockException extends RuntimeException {
    public OutOfStockException(String productName) {
        super(String.format("Product '%s' is out of stock", productName));
    }
}