package com.restaurante.app.web.rest;

import com.restaurante.app.domain.LineaPedido;
import com.restaurante.app.repository.LineaPedidoRepository;
import com.restaurante.app.service.LineaPedidoService;
import com.restaurante.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.restaurante.app.domain.LineaPedido}.
 */
@RestController
@RequestMapping("/api")
public class LineaPedidoResource {

    private final Logger log = LoggerFactory.getLogger(LineaPedidoResource.class);

    private static final String ENTITY_NAME = "lineaPedido";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LineaPedidoService lineaPedidoService;

    private final LineaPedidoRepository lineaPedidoRepository;

    public LineaPedidoResource(LineaPedidoService lineaPedidoService, LineaPedidoRepository lineaPedidoRepository) {
        this.lineaPedidoService = lineaPedidoService;
        this.lineaPedidoRepository = lineaPedidoRepository;
    }

    /**
     * {@code POST  /linea-pedidos} : Create a new lineaPedido.
     *
     * @param lineaPedido the lineaPedido to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lineaPedido, or with status {@code 400 (Bad Request)} if the lineaPedido has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/linea-pedidos")
    public ResponseEntity<LineaPedido> createLineaPedido(@Valid @RequestBody LineaPedido lineaPedido) throws URISyntaxException {
        log.debug("REST request to save LineaPedido : {}", lineaPedido);
        if (lineaPedido.getId() != null) {
            throw new BadRequestAlertException("A new lineaPedido cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LineaPedido result = lineaPedidoService.save(lineaPedido);
        return ResponseEntity
            .created(new URI("/api/linea-pedidos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /linea-pedidos/:id} : Updates an existing lineaPedido.
     *
     * @param id the id of the lineaPedido to save.
     * @param lineaPedido the lineaPedido to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lineaPedido,
     * or with status {@code 400 (Bad Request)} if the lineaPedido is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lineaPedido couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/linea-pedidos/{id}")
    public ResponseEntity<LineaPedido> updateLineaPedido(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LineaPedido lineaPedido
    ) throws URISyntaxException {
        log.debug("REST request to update LineaPedido : {}, {}", id, lineaPedido);
        if (lineaPedido.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lineaPedido.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lineaPedidoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LineaPedido result = lineaPedidoService.save(lineaPedido);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lineaPedido.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /linea-pedidos/:id} : Partial updates given fields of an existing lineaPedido, field will ignore if it is null
     *
     * @param id the id of the lineaPedido to save.
     * @param lineaPedido the lineaPedido to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lineaPedido,
     * or with status {@code 400 (Bad Request)} if the lineaPedido is not valid,
     * or with status {@code 404 (Not Found)} if the lineaPedido is not found,
     * or with status {@code 500 (Internal Server Error)} if the lineaPedido couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/linea-pedidos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LineaPedido> partialUpdateLineaPedido(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LineaPedido lineaPedido
    ) throws URISyntaxException {
        log.debug("REST request to partial update LineaPedido partially : {}, {}", id, lineaPedido);
        if (lineaPedido.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lineaPedido.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lineaPedidoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LineaPedido> result = lineaPedidoService.partialUpdate(lineaPedido);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lineaPedido.getId().toString())
        );
    }

    /**
     * {@code GET  /linea-pedidos} : get all the lineaPedidos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lineaPedidos in body.
     */
    @GetMapping("/linea-pedidos")
    public List<LineaPedido> getAllLineaPedidos() {
        log.debug("REST request to get all LineaPedidos");
        return lineaPedidoService.findAll();
    }

    /**
     * {@code GET  /linea-pedidos/:id} : get the "id" lineaPedido.
     *
     * @param id the id of the lineaPedido to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lineaPedido, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/linea-pedidos/{id}")
    public ResponseEntity<LineaPedido> getLineaPedido(@PathVariable Long id) {
        log.debug("REST request to get LineaPedido : {}", id);
        Optional<LineaPedido> lineaPedido = lineaPedidoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lineaPedido);
    }

    /**
     * {@code DELETE  /linea-pedidos/:id} : delete the "id" lineaPedido.
     *
     * @param id the id of the lineaPedido to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/linea-pedidos/{id}")
    public ResponseEntity<Void> deleteLineaPedido(@PathVariable Long id) {
        log.debug("REST request to delete LineaPedido : {}", id);
        lineaPedidoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
