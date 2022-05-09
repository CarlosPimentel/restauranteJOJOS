package com.restaurante.app.service;

import com.restaurante.app.domain.RegistroMesa;
import com.restaurante.app.repository.RegistroMesaRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link RegistroMesa}.
 */
@Service
@Transactional
public class RegistroMesaService {

    private final Logger log = LoggerFactory.getLogger(RegistroMesaService.class);

    private final RegistroMesaRepository registroMesaRepository;

    public RegistroMesaService(RegistroMesaRepository registroMesaRepository) {
        this.registroMesaRepository = registroMesaRepository;
    }

    /**
     * Save a registroMesa.
     *
     * @param registroMesa the entity to save.
     * @return the persisted entity.
     */
    public RegistroMesa save(RegistroMesa registroMesa) {
        log.debug("Request to save RegistroMesa : {}", registroMesa);
        return registroMesaRepository.save(registroMesa);
    }

    /**
     * Partially update a registroMesa.
     *
     * @param registroMesa the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<RegistroMesa> partialUpdate(RegistroMesa registroMesa) {
        log.debug("Request to partially update RegistroMesa : {}", registroMesa);

        return registroMesaRepository
            .findById(registroMesa.getId())
            .map(existingRegistroMesa -> {
                if (registroMesa.getFecha() != null) {
                    existingRegistroMesa.setFecha(registroMesa.getFecha());
                }

                return existingRegistroMesa;
            })
            .map(registroMesaRepository::save);
    }

    /**
     * Get all the registroMesas.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RegistroMesa> findAll() {
        log.debug("Request to get all RegistroMesas");
        return registroMesaRepository.findAll();
    }

    /**
     *  Get all the registroMesas where Factura is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RegistroMesa> findAllWhereFacturaIsNull() {
        log.debug("Request to get all registroMesas where Factura is null");
        return StreamSupport
            .stream(registroMesaRepository.findAll().spliterator(), false)
            .filter(registroMesa -> registroMesa.getFactura() == null)
            .collect(Collectors.toList());
    }

    /**
     * Get one registroMesa by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<RegistroMesa> findOne(Long id) {
        log.debug("Request to get RegistroMesa : {}", id);
        return registroMesaRepository.findById(id);
    }

    /**
     * Delete the registroMesa by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete RegistroMesa : {}", id);
        registroMesaRepository.deleteById(id);
    }
}
