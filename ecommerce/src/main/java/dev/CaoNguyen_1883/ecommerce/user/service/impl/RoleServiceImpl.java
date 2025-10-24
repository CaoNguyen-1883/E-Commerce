package dev.CaoNguyen_1883.ecommerce.user.service.impl;

import dev.CaoNguyen_1883.ecommerce.common.exception.ResourceNotFoundException;
import dev.CaoNguyen_1883.ecommerce.user.dto.PermissionDto;
import dev.CaoNguyen_1883.ecommerce.user.dto.RoleDto;
import dev.CaoNguyen_1883.ecommerce.user.mapper.PermissionMapper;
import dev.CaoNguyen_1883.ecommerce.user.mapper.RoleMapper;
import dev.CaoNguyen_1883.ecommerce.user.repository.PermissionRepository;
import dev.CaoNguyen_1883.ecommerce.user.repository.RoleRepository;
import dev.CaoNguyen_1883.ecommerce.user.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RoleMapper roleMapper;
    private final PermissionMapper permissionMapper;

    @Override
    @Cacheable("roles")
    public List<RoleDto> getAllRoles() {
        return roleMapper.toDto(roleRepository.findAll());
    }

    @Override
    @Cacheable("permissions")
    public List<PermissionDto> getAllPermissions() {
        return permissionMapper.toDtoList(permissionRepository.findAll());
    }

    @Override
    public RoleDto getRoleById(UUID id) {
        return roleMapper.toDto(
            roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id))
        );
    }
}
