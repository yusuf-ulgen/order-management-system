package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Bu arayüz sayesinde kayıt etme (save), silme ve listeleme metotları hazır gelecek.
}