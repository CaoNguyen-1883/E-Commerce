package dev.CaoNguyen_1883.ecommerce.user.service.impl;


import dev.CaoNguyen_1883.ecommerce.user.mapper.PermissionMapper;
import dev.CaoNguyen_1883.ecommerce.user.mapper.RoleMapper;
import dev.CaoNguyen_1883.ecommerce.user.mapper.UserMapper;
import dev.CaoNguyen_1883.ecommerce.user.repository.PermissionRepository;
import dev.CaoNguyen_1883.ecommerce.user.repository.RoleRepository;
import dev.CaoNguyen_1883.ecommerce.user.repository.UserRepository;
import dev.CaoNguyen_1883.ecommerce.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;



@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final PermissionMapper permissionMapper;
    


}