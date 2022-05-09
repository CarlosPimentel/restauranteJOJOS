package com.restaurante.app.service;

import com.restaurante.app.domain.Producto;
import com.restaurante.app.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Producto}.
 */
@Service
@Transactional
public class ProductoService {

    private final Logger log = LoggerFactory.getLogger(ProductoService.class);

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    /**
     * Save a producto.
     *
     * @param producto the entity to save.
     * @return the persisted entity.
     */
    public Producto save(Producto producto) {
        log.debug("Request to save Producto : {}", producto);
        return productoRepository.save(producto);
    }

    /**
     * Partially update a producto.
     *
     * @param producto the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Producto> partialUpdate(Producto producto) {
        log.debug("Request to partially update Producto : {}", producto);

        return productoRepository
            .findById(producto.getId())
            .map(existingProducto -> {
                if (producto.getTipo() != null) {
                    existingProducto.setTipo(producto.getTipo());
                }
                if (producto.getReferencia() != null) {
                    existingProducto.setReferencia(producto.getReferencia());
                }
                if (producto.getNombre() != null) {
                    existingProducto.setNombre(producto.getNombre());
                }
                if (producto.getPrecio() != null) {
                    existingProducto.setPrecio(producto.getPrecio());
                }
                if (producto.getIva() != null) {
                    existingProducto.setIva(producto.getIva());
                }
                if (producto.getUrl() != null) {
                    existingProducto.setUrl(producto.getUrl());
                }

                return existingProducto;
            })
            .map(productoRepository::save);
    }

    /**
     * Get all the productos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Producto> findAll() {
        log.debug("Request to get all Productos");
        return productoRepository.findAll();
    }

    /**
     * Get one producto by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Producto> findOne(Long id) {
        log.debug("Request to get Producto : {}", id);
        return productoRepository.findById(id);
    }

    /**
     * Delete the producto by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Producto : {}", id);
        productoRepository.deleteById(id);
    }
}
