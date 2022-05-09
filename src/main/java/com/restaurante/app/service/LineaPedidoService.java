package com.restaurante.app.service;

import com.restaurante.app.domain.LineaPedido;
import com.restaurante.app.repository.LineaPedidoRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link LineaPedido}.
 */
@Service
@Transactional
public class LineaPedidoService {

    private final Logger log = LoggerFactory.getLogger(LineaPedidoService.class);

    private final LineaPedidoRepository lineaPedidoRepository;

    public LineaPedidoService(LineaPedidoRepository lineaPedidoRepository) {
        this.lineaPedidoRepository = lineaPedidoRepository;
    }

    /**
     * Save a lineaPedido.
     *
     * @param lineaPedido the entity to save.
     * @return the persisted entity.
     */
    public LineaPedido save(LineaPedido lineaPedido) {
        log.debug("Request to save LineaPedido : {}", lineaPedido);
        return lineaPedidoRepository.save(lineaPedido);
    }

    /**
     * Partially update a lineaPedido.
     *
     * @param lineaPedido the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LineaPedido> partialUpdate(LineaPedido lineaPedido) {
        log.debug("Request to partially update LineaPedido : {}", lineaPedido);

        return lineaPedidoRepository
            .findById(lineaPedido.getId())
            .map(existingLineaPedido -> {
                if (lineaPedido.getPrecio() != null) {
                    existingLineaPedido.setPrecio(lineaPedido.getPrecio());
                }
                if (lineaPedido.getIva() != null) {
                    existingLineaPedido.setIva(lineaPedido.getIva());
                }
                if (lineaPedido.getCantidad() != null) {
                    existingLineaPedido.setCantidad(lineaPedido.getCantidad());
                }

                return existingLineaPedido;
            })
            .map(lineaPedidoRepository::save);
    }

    /**
     * Get all the lineaPedidos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<LineaPedido> findAll() {
        log.debug("Request to get all LineaPedidos");
        return lineaPedidoRepository.findAll();
    }

    /**
     * Get one lineaPedido by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LineaPedido> findOne(Long id) {
        log.debug("Request to get LineaPedido : {}", id);
        return lineaPedidoRepository.findById(id);
    }

    /**
     * Delete the lineaPedido by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete LineaPedido : {}", id);
        lineaPedidoRepository.deleteById(id);
    }
}
