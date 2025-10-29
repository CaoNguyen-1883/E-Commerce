package dev.CaoNguyen_1883.ecommerce.product.service.impl;

import dev.CaoNguyen_1883.ecommerce.common.exception.BadRequestException;
import dev.CaoNguyen_1883.ecommerce.common.exception.ForbiddenException;
import dev.CaoNguyen_1883.ecommerce.common.exception.ResourceNotFoundException;
import dev.CaoNguyen_1883.ecommerce.product.dto.*;
import dev.CaoNguyen_1883.ecommerce.product.entity.*;
import dev.CaoNguyen_1883.ecommerce.product.mapper.ProductMapper;
import dev.CaoNguyen_1883.ecommerce.product.mapper.ProductVariantMapper;
import dev.CaoNguyen_1883.ecommerce.product.repository.*;
import dev.CaoNguyen_1883.ecommerce.product.service.IProductService;
import dev.CaoNguyen_1883.ecommerce.user.entity.User;
import dev.CaoNguyen_1883.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductMapper productMapper;
    private final ProductVariantMapper variantMapper;

    // ===== QUERY METHODS =====

    @Override
    public Page<ProductSummaryDto> getAllProducts(Pageable pageable) {
        log.debug("Fetching all approved products, page: {}", pageable.getPageNumber());
        return productRepository.findApprovedProducts(pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> getProductsByStatus(ProductStatus status, Pageable pageable) {
        log.debug("Fetching products with status: {}", status);
        return productRepository.findByStatus(status, pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> getPendingProducts(Pageable pageable) {
        log.debug("Fetching pending products for approval");
        return getProductsByStatus(ProductStatus.PENDING, pageable);
    }

    @Override
    public Page<ProductSummaryDto> getSellerProducts(UUID sellerId, Pageable pageable) {
        log.debug("Fetching products for seller: {}", sellerId);
        return productRepository.findBySellerId(sellerId, pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> searchProducts(String keyword, Pageable pageable) {
        log.debug("Searching products with keyword: {}", keyword);
        return productRepository.searchProducts(keyword, pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> getProductsByCategory(UUID categoryId, Pageable pageable) {
        log.debug("Fetching products by category: {}", categoryId);

        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }

        return productRepository.findByCategoryId(categoryId, pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> getProductsByBrand(UUID brandId, Pageable pageable) {
        log.debug("Fetching products by brand: {}", brandId);

        if (!brandRepository.existsById(brandId)) {
            throw new ResourceNotFoundException("Brand", "id", brandId);
        }

        return productRepository.findByBrandId(brandId, pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    @Cacheable(value = "products", key = "#id")
    public ProductDto getProductById(UUID id) {
        log.debug("Fetching product by ID: {}", id);
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return productMapper.toDto(product);
    }

    @Override
    @Cacheable(value = "products", key = "'slug_' + #slug")
    public ProductDto getProductBySlug(String slug) {
        log.debug("Fetching product by slug: {}", slug);
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));

        // Load details
        Product finalProduct = product;
        product = productRepository.findByIdWithDetails(product.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", finalProduct.getId()));

        return productMapper.toDto(product);
    }

    // ===== CREATE/UPDATE METHODS =====

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto createProduct(ProductRequest request, UUID sellerId) {
        log.info("Creating new product: {}", request.getName());

        // Validate seller
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", sellerId));

        // Validate category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        // Validate brand
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getBrandId()));

        // Create product
        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        product.setBrand(brand);
        product.setSeller(seller);
        product.setStatus(ProductStatus.PENDING);

        // Generate slug
        product.setSlug(generateSlug(request.getName()));
        if (productRepository.existsBySlug(product.getSlug())) {
            product.setSlug(product.getSlug() + "-" + UUID.randomUUID().toString().substring(0, 8));
        }

        Product saved = productRepository.save(product);

        // Create variants if provided
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest variantReq : request.getVariants()) {
                ProductVariant variant = variantMapper.toEntity(variantReq);
                variant.setProduct(saved);
                variantRepository.save(variant);
            }
        }

        log.info("Product created successfully with ID: {}", saved.getId());
        return getProductById(saved.getId());
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto updateProduct(UUID id, ProductUpdateRequest request, UUID sellerId) {
        log.info("Updating product ID: {} by seller: {}", id, sellerId);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // Check ownership
        if (!product.getSeller().getId().equals(sellerId)) {
            throw new ForbiddenException("You can only update your own products");
        }

        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        // Update brand if provided
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getBrandId()));
            product.setBrand(brand);
        }

        // Update other fields
        if (request.getName() != null) {
            product.setName(request.getName());
            //Do not update the slug - keep the old URL for SEO
//            product.setSlug(generateSlug(request.getName()));
        }
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getShortDescription() != null) product.setShortDescription(request.getShortDescription());
        if (request.getBasePrice() != null) product.setBasePrice(request.getBasePrice());

        // If product was approved, set back to PENDING after update
        if (product.getStatus() == ProductStatus.APPROVED) {
            product.setStatus(ProductStatus.PENDING);
            product.setApprovedBy(null);
            product.setApprovedAt(null);
            log.info("Product status changed to PENDING after update");
        }

        Product updated = productRepository.save(product);
        log.info("Product updated successfully: {}", id);

        return getProductById(updated.getId());
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(UUID id, UUID sellerId) {
        log.info("Deleting product ID: {} by seller: {}", id, sellerId);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // Check ownership
        if (!product.getSeller().getId().equals(sellerId)) {
            throw new ForbiddenException("You can only delete your own products");
        }

        product.setIsActive(false);
        productRepository.save(product);

        log.info("Product soft deleted successfully: {}", id);
    }

    // ===== APPROVAL WORKFLOW =====

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto approveProduct(UUID id, UUID approvedBy) {
        log.info("Approving product ID: {} by staff: {}", id, approvedBy);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (product.getStatus() != ProductStatus.PENDING) {
            throw new BadRequestException("Only PENDING products can be approved");
        }

        // Validate variants exist and have stock
        if (product.getVariants() == null || product.getVariants().isEmpty()) {
            throw new BadRequestException("Product must have at least one variant before approval");
        }

        User staff = userRepository.findById(approvedBy)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", approvedBy));

        product.setStatus(ProductStatus.APPROVED);
        product.setApprovedBy(staff);
        product.setApprovedAt(LocalDateTime.now());
        product.setRejectionReason(null);

        Product approved = productRepository.save(product);
        log.info("Product approved successfully: {}", id);

        return getProductById(approved.getId());
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto rejectProduct(UUID id, String reason, UUID rejectedBy) {
        log.info("Rejecting product ID: {} by staff: {}", id, rejectedBy);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (product.getStatus() != ProductStatus.PENDING) {
            throw new BadRequestException("Only PENDING products can be rejected");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Rejection reason is required");
        }

        product.setStatus(ProductStatus.REJECTED);
        product.setRejectionReason(reason);
        product.setApprovedBy(null);
        product.setApprovedAt(null);

        Product rejected = productRepository.save(product);
        log.info("Product rejected successfully: {}", id);

        return getProductById(rejected.getId());
    }

    // ===== RECOMMENDATION FEATURES =====

    @Override
    public Page<ProductSummaryDto> getTrendingProducts(Pageable pageable) {
        log.debug("Fetching trending products");
        return productRepository.findTrendingProducts(pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> getBestSellingProducts(Pageable pageable) {
        log.debug("Fetching best selling products");
        return productRepository.findBestSellingProducts(pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> getTopRatedProducts(Pageable pageable) {
        log.debug("Fetching top rated products");
        return productRepository.findTopRatedProducts(pageable)
                .map(productMapper::toSummaryDto);
    }

    @Override
    public List<ProductSummaryDto> getSimilarProducts(UUID productId, int limit) {
        log.debug("Fetching similar products for product: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        return productRepository.findSimilarProducts(
                        product.getCategory().getId(),
                        productId,
                        PageRequest.of(0, limit)
                ).stream()
                .map(productMapper::toSummaryDto)
                .toList();
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        product.incrementViewCount();
        productRepository.save(product);
    }

    // ===== HELPER METHODS =====

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
