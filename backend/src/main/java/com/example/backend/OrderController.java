package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // React'ın bağlanabilmesi için izin veriyoruz
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // Tüm siparişleri listele (Garson paneli için)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Yeni sipariş al (Müşteri için)
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }
}