package dev.CaoNguyen_1883.ecommerce.user.service;

import dev.CaoNguyen_1883.ecommerce.user.dto.PermissionDto;
import dev.CaoNguyen_1883.ecommerce.user.dto.RoleDto;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    List<RoleDto> getAllRoles();
    List<PermissionDto> getAllPermissions();
    RoleDto getRoleById(UUID id);
}
