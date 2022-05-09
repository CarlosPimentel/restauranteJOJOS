package com.restaurante.app.repository;

import com.restaurante.app.domain.RegistroMesa;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RegistroMesa entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegistroMesaRepository extends JpaRepository<RegistroMesa, Long> {}
