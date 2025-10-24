package dev.CaoNguyen_1883.ecommerce.seed;

import dev.CaoNguyen_1883.ecommerce.user.entity.Permission;
import dev.CaoNguyen_1883.ecommerce.user.entity.Role;
import dev.CaoNguyen_1883.ecommerce.user.repository.PermissionRepository;
import dev.CaoNguyen_1883.ecommerce.user.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class RBACDataInitializer {
    
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    
    @PostConstruct
    public void init() {
        initRoles();
        initPermissions();
        assignPermissionsToRoles();
    }
    
    public void initRoles(){
        List<Role> roles = new ArrayList<>();
        roles.add(Role.builder().name("ROLE_ADMIN").description("ADMIN").build());
        roles.add(Role.builder().name("ROLE_CUSTOMER").description("USER").build());
        roles.add(Role.builder().name("ROLE_SELLER").description("SELLER").build());
        roles.add(Role.builder().name("ROLE_STAFF").description("STAFF").build());
        roles.forEach(role -> roleRepository.findByName(role.getName())
                .orElseGet(() -> {
                    roleRepository.save(role);
                    log.info("Created new role: {}", role.getName());
                    return role;
                }));
    }

    public void initPermissions() {
        List<Permission> permissions = new ArrayList<>();
        permissions.addAll(List.of(
                // User
                Permission.builder().name("user:view").description("View users").build(),
                Permission.builder().name("user:create").description("Create new users").build(),
                Permission.builder().name("user:update").description("Update user information").build(),
                Permission.builder().name("user:delete").description("Delete users").build(),

                // Product
                Permission.builder().name("product:view").description("View products").build(),
                Permission.builder().name("product:create").description("Create new products").build(),
                Permission.builder().name("product:update").description("Update products").build(),
                Permission.builder().name("product:delete").description("Delete products").build(),

                // Order
                Permission.builder().name("order:view").description("View orders").build(),
                Permission.builder().name("order:update").description("Update order status").build(),
                Permission.builder().name("order:approve").description("Approve customer orders").build(),
                Permission.builder().name("order:cancel").description("Cancel orders").build(),

                // Category / Brand
                Permission.builder().name("category:view").description("View product categories").build(),
                Permission.builder().name("category:create").description("Create categories").build(),
                Permission.builder().name("category:update").description("Update categories").build(),
                Permission.builder().name("category:delete").description("Delete categories").build(),
                Permission.builder().name("brand:view").description("View brands").build(),
                Permission.builder().name("brand:create").description("Create new brands").build(),
                Permission.builder().name("brand:update").description("Update brands").build(),
                Permission.builder().name("brand:delete").description("Delete brands").build(),

                // Review / Feedback
                Permission.builder().name("review:view").description("View product reviews").build(),
                Permission.builder().name("review:create").description("Add product reviews").build(),
                Permission.builder().name("review:delete").description("Delete product reviews").build(),

                // Payment
                Permission.builder().name("payment:view").description("View payment info").build(),
                Permission.builder().name("payment:update").description("Update payment info").build(),

                // Recommendation / Analytics
                Permission.builder().name("recommendation:view").description("View recommendation data").build(),
                Permission.builder().name("analytics:view").description("View analytics and reports").build()
        ));

        permissions.forEach(permission -> permissionRepository.findByName(permission.getName())
                .orElseGet(() -> {
                    permissionRepository.save(permission);
                    log.info("Created new permission: {}", permission.getName());
                    return permission;
                }));
    }

    @Transactional
    public void assignPermissionsToRoles() {
        // Lấy tất cả permission đã seed
        List<Permission> allPermissions = permissionRepository.findAll();

        // Lấy từng nhóm permission theo module
        Map<String, Permission> map = allPermissions.stream()
                .collect(Collectors.toMap(Permission::getName, p -> p));

        // ===== ROLE_ADMIN =====
        Role admin = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
        admin.setPermissions(new HashSet<>(allPermissions));

        // ===== ROLE_STAFF =====
        Role staff = roleRepository.findByName("ROLE_STAFF")
                .orElseThrow(() -> new RuntimeException("ROLE_STAFF not found"));
        staff.setPermissions(Set.of(
                map.get("order:view"),
                map.get("order:update"),
                map.get("order:approve"),
                map.get("order:cancel"),
                map.get("user:view"),
                map.get("analytics:view")
        ));

        // ===== ROLE_SELLER =====
        Role seller = roleRepository.findByName("ROLE_SELLER")
                .orElseThrow(() -> new RuntimeException("ROLE_SELLER not found"));
        seller.setPermissions(Set.of(
                map.get("product:view"),
                map.get("product:create"),
                map.get("product:update"),
                map.get("product:delete"),
                map.get("order:view"),
                map.get("review:view"),
                map.get("recommendation:view")
        ));

        // ===== ROLE_CUSTOMER =====
        Role customer = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("ROLE_CUSTOMER not found"));
        customer.setPermissions(Set.of(
                map.get("product:view"),
                map.get("order:view"),
                map.get("review:create"),
                map.get("review:view"),
                map.get("recommendation:view")
        ));

        roleRepository.saveAll(List.of(admin, staff, seller, customer));
    }
}