package dev.CaoNguyen_1883.ecommerce.user.mapper;


import dev.CaoNguyen_1883.ecommerce.user.dto.PermissionDto;
import dev.CaoNguyen_1883.ecommerce.user.entity.Permission;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionDto toDto(Permission permission);
    List<PermissionDto> toDtoList(List<Permission> permissions);
}