package com.example.backend;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cafe_orders")
@Data // Getter, Setter ve ToString'i otomatik oluşturur
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String tableNumber;
    private String items; // Örn: "2x Kahve, 1x Brownie"
    private double totalPrice;
    private String status = "Yeni"; // Varsayılan durum
}