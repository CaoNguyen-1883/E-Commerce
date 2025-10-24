package dev.CaoNguyen_1883.ecommerce.user.entity;

import dev.CaoNguyen_1883.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String name;

    private String description;
}
