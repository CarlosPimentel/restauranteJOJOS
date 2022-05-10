package com.restaurante.app.repository;

import com.restaurante.app.domain.Producto;
import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Producto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByTipo(Integer tipo);
}