package com.restaurante.app.service;

import com.restaurante.app.domain.Mesa;
import com.restaurante.app.repository.MesaRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Mesa}.
 */
@Service
@Transactional
public class MesaService {

    private final Logger log = LoggerFactory.getLogger(MesaService.class);

    private final MesaRepository mesaRepository;

    public MesaService(MesaRepository mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    /**
     * Save a mesa.
     *
     * @param mesa the entity to save.
     * @return the persisted entity.
     */
    public Mesa save(Mesa mesa) {
        log.debug("Request to save Mesa : {}", mesa);
        return mesaRepository.save(mesa);
    }

    /**
     * Partially update a mesa.
     *
     * @param mesa the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Mesa> partialUpdate(Mesa mesa) {
        log.debug("Request to partially update Mesa : {}", mesa);

        return mesaRepository
            .findById(mesa.getId())
            .map(existingMesa -> {
                if (mesa.getEstado() != null) {
                    existingMesa.setEstado(mesa.getEstado());
                }
                if (mesa.getNumero() != null) {
                    existingMesa.setNumero(mesa.getNumero());
                }

                return existingMesa;
            })
            .map(mesaRepository::save);
    }

    /**
     * Get all the mesas.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Mesa> findAll() {
        log.debug("Request to get all Mesas");
        return mesaRepository.findAll();
    }

    /**
     * Get one mesa by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Mesa> findOne(Long id) {
        log.debug("Request to get Mesa : {}", id);
        return mesaRepository.findById(id);
    }

    /**
     * Delete the mesa by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Mesa : {}", id);
        mesaRepository.deleteById(id);
    }
}
