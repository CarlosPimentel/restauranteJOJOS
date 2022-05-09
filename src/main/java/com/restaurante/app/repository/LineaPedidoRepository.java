package com.restaurante.app.repository;

import com.restaurante.app.domain.LineaPedido;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LineaPedido entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LineaPedidoRepository extends JpaRepository<LineaPedido, Long> {}
