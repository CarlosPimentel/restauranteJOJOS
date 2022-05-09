package com.restaurante.app.service;

import com.restaurante.app.domain.Reserva;
import com.restaurante.app.repository.ReservaRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Reserva}.
 */
@Service
@Transactional
public class ReservaService {

    private final Logger log = LoggerFactory.getLogger(ReservaService.class);

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    /**
     * Save a reserva.
     *
     * @param reserva the entity to save.
     * @return the persisted entity.
     */
    public Reserva save(Reserva reserva) {
        log.debug("Request to save Reserva : {}", reserva);
        return reservaRepository.save(reserva);
    }

    /**
     * Partially update a reserva.
     *
     * @param reserva the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Reserva> partialUpdate(Reserva reserva) {
        log.debug("Request to partially update Reserva : {}", reserva);

        return reservaRepository
            .findById(reserva.getId())
            .map(existingReserva -> {
                if (reserva.getFecha() != null) {
                    existingReserva.setFecha(reserva.getFecha());
                }

                return existingReserva;
            })
            .map(reservaRepository::save);
    }

    /**
     * Get all the reservas.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Reserva> findAll() {
        log.debug("Request to get all Reservas");
        return reservaRepository.findAll();
    }

    /**
     * Get one reserva by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Reserva> findOne(Long id) {
        log.debug("Request to get Reserva : {}", id);
        return reservaRepository.findById(id);
    }

    /**
     * Delete the reserva by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Reserva : {}", id);
        reservaRepository.deleteById(id);
    }
}
