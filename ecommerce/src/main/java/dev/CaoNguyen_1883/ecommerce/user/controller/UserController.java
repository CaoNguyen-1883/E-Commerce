package dev.CaoNguyen_1883.ecommerce.user.controller;



import dev.CaoNguyen_1883.ecommerce.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

}