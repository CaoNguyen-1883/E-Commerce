package dev.CaoNguyen_1883.ecommerce.product.repository;

import dev.CaoNguyen_1883.ecommerce.product.entity.Product;
import dev.CaoNguyen_1883.ecommerce.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    // Find with all relationships
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.seller " +
            "LEFT JOIN FETCH p.variants v " +
            "LEFT JOIN FETCH v.images " +
            "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") UUID id);

    // Products by status
    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.isActive = true")
    Page<Product> findByStatus(@Param("status") ProductStatus status, Pageable pageable);

    // Approved products for customers
    @Query("SELECT p FROM Product p " +
            "WHERE p.status = 'APPROVED' AND p.isActive = true")
    Page<Product> findApprovedProducts(Pageable pageable);

    // Search products
    @Query("SELECT p FROM Product p " +
            "WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND p.status = 'APPROVED' AND p.isActive = true")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    // Filter by category
    @Query("SELECT p FROM Product p " +
            "WHERE p.category.id = :categoryId " +
            "AND p.status = 'APPROVED' AND p.isActive = true")
    Page<Product> findByCategoryId(@Param("categoryId") UUID categoryId, Pageable pageable);

    // Filter by brand
    @Query("SELECT p FROM Product p " +
            "WHERE p.brand.id = :brandId " +
            "AND p.status = 'APPROVED' AND p.isActive = true")
    Page<Product> findByBrandId(@Param("brandId") UUID brandId, Pageable pageable);

    // Filter by seller
    @Query("SELECT p FROM Product p WHERE p.seller.id = :sellerId")
    Page<Product> findBySellerId(@Param("sellerId") UUID sellerId, Pageable pageable);

    // Trending products (by view count)
    @Query("SELECT p FROM Product p " +
            "WHERE p.status = 'APPROVED' AND p.isActive = true " +
            "ORDER BY p.viewCount DESC")
    Page<Product> findTrendingProducts(Pageable pageable);

    // Best selling products
    @Query("SELECT p FROM Product p " +
            "WHERE p.status = 'APPROVED' AND p.isActive = true " +
            "ORDER BY p.purchaseCount DESC")
    Page<Product> findBestSellingProducts(Pageable pageable);

    // Top rated products
    @Query("SELECT p FROM Product p " +
            "WHERE p.status = 'APPROVED' AND p.isActive = true " +
            "AND p.averageRating IS NOT NULL " +
            "ORDER BY p.averageRating DESC, p.totalReviews DESC")
    Page<Product> findTopRatedProducts(Pageable pageable);

    // Similar products (same category, different product)
    @Query("SELECT p FROM Product p " +
            "WHERE p.category.id = :categoryId " +
            "AND p.id != :productId " +
            "AND p.status = 'APPROVED' AND p.isActive = true")
    List<Product> findSimilarProducts(
            @Param("categoryId") UUID categoryId,
            @Param("productId") UUID productId,
            Pageable pageable
    );
}
