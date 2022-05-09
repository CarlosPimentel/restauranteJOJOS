package com.restaurante.app.service;

import com.restaurante.app.domain.Factura;
import com.restaurante.app.repository.FacturaRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Factura}.
 */
@Service
@Transactional
public class FacturaService {

    private final Logger log = LoggerFactory.getLogger(FacturaService.class);

    private final FacturaRepository facturaRepository;

    public FacturaService(FacturaRepository facturaRepository) {
        this.facturaRepository = facturaRepository;
    }

    /**
     * Save a factura.
     *
     * @param factura the entity to save.
     * @return the persisted entity.
     */
    public Factura save(Factura factura) {
        log.debug("Request to save Factura : {}", factura);
        return facturaRepository.save(factura);
    }

    /**
     * Partially update a factura.
     *
     * @param factura the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Factura> partialUpdate(Factura factura) {
        log.debug("Request to partially update Factura : {}", factura);

        return facturaRepository
            .findById(factura.getId())
            .map(existingFactura -> {
                if (factura.getFecha() != null) {
                    existingFactura.setFecha(factura.getFecha());
                }

                return existingFactura;
            })
            .map(facturaRepository::save);
    }

    /**
     * Get all the facturas.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Factura> findAll() {
        log.debug("Request to get all Facturas");
        return facturaRepository.findAll();
    }

    /**
     * Get one factura by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Factura> findOne(Long id) {
        log.debug("Request to get Factura : {}", id);
        return facturaRepository.findById(id);
    }

    /**
     * Delete the factura by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Factura : {}", id);
        facturaRepository.deleteById(id);
    }
}
