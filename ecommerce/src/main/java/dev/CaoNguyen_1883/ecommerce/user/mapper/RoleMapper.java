package dev.CaoNguyen_1883.ecommerce.user.mapper;

import dev.CaoNguyen_1883.ecommerce.user.dto.RoleDto;
import dev.CaoNguyen_1883.ecommerce.user.entity.Role;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDto toDto(Role role);
    List<RoleDto> toDto(List<Role> roles);
}
