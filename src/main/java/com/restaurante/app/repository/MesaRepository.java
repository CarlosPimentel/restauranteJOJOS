package com.restaurante.app.repository;

import com.restaurante.app.domain.Mesa;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Mesa entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {}
