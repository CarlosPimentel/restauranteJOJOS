package com.restaurante.app.repository;

import com.restaurante.app.domain.Mesa;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Mesa entity.
 */
@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    @Query(value = "select mesa from Mesa mesa where mesa.id = (select max(mesa2.id) from Mesa mesa2 where mesa2.numero = :numero)")
    Mesa devolverUltimasMesas(@Param("numero") Integer numero);

    @Query(value = "update Mesa mesa set mesa.estado = :numero where mesa.id = :id")
    Mesa devolverBBDD(@Param("numero") Integer numero, @Param("id") Long id);
}
