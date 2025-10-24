package dev.CaoNguyen_1883.ecommerce.user.controller;

import dev.CaoNguyen_1883.ecommerce.common.response.ApiResponse;
import dev.CaoNguyen_1883.ecommerce.user.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {
    private final RoleService roleService;
    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(ApiResponse.success(roleService.getAllPermissions()));
    }
}
