package com.restaurante.app.repository;

import com.restaurante.app.domain.Reserva;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Reserva entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {}
