package com.restaurante.app.web.rest;

import com.restaurante.app.domain.RegistroMesa;
import com.restaurante.app.repository.RegistroMesaRepository;
import com.restaurante.app.service.RegistroMesaService;
import com.restaurante.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.restaurante.app.domain.RegistroMesa}.
 */
@RestController
@RequestMapping("/api")
public class RegistroMesaResource {

    private final Logger log = LoggerFactory.getLogger(RegistroMesaResource.class);

    private static final String ENTITY_NAME = "registroMesa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistroMesaService registroMesaService;

    private final RegistroMesaRepository registroMesaRepository;

    public RegistroMesaResource(RegistroMesaService registroMesaService, RegistroMesaRepository registroMesaRepository) {
        this.registroMesaService = registroMesaService;
        this.registroMesaRepository = registroMesaRepository;
    }

    /**
     * {@code POST  /registro-mesas} : Create a new registroMesa.
     *
     * @param registroMesa the registroMesa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registroMesa, or with status {@code 400 (Bad Request)} if the registroMesa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/registro-mesas")
    public ResponseEntity<RegistroMesa> createRegistroMesa(@Valid @RequestBody RegistroMesa registroMesa) throws URISyntaxException {
        log.debug("REST request to save RegistroMesa : {}", registroMesa);
        if (registroMesa.getId() != null) {
            throw new BadRequestAlertException("A new registroMesa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RegistroMesa result = registroMesaService.save(registroMesa);
        return ResponseEntity
            .created(new URI("/api/registro-mesas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /registro-mesas/:id} : Updates an existing registroMesa.
     *
     * @param id the id of the registroMesa to save.
     * @param registroMesa the registroMesa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroMesa,
     * or with status {@code 400 (Bad Request)} if the registroMesa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registroMesa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/registro-mesas/{id}")
    public ResponseEntity<RegistroMesa> updateRegistroMesa(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RegistroMesa registroMesa
    ) throws URISyntaxException {
        log.debug("REST request to update RegistroMesa : {}, {}", id, registroMesa);
        if (registroMesa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroMesa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroMesaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RegistroMesa result = registroMesaService.save(registroMesa);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registroMesa.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /registro-mesas/:id} : Partial updates given fields of an existing registroMesa, field will ignore if it is null
     *
     * @param id the id of the registroMesa to save.
     * @param registroMesa the registroMesa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroMesa,
     * or with status {@code 400 (Bad Request)} if the registroMesa is not valid,
     * or with status {@code 404 (Not Found)} if the registroMesa is not found,
     * or with status {@code 500 (Internal Server Error)} if the registroMesa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/registro-mesas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RegistroMesa> partialUpdateRegistroMesa(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RegistroMesa registroMesa
    ) throws URISyntaxException {
        log.debug("REST request to partial update RegistroMesa partially : {}, {}", id, registroMesa);
        if (registroMesa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroMesa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroMesaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RegistroMesa> result = registroMesaService.partialUpdate(registroMesa);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registroMesa.getId().toString())
        );
    }

    /**
     * {@code GET  /registro-mesas} : get all the registroMesas.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registroMesas in body.
     */
    @GetMapping("/registro-mesas")
    public List<RegistroMesa> getAllRegistroMesas(@RequestParam(required = false) String filter) {
        if ("factura-is-null".equals(filter)) {
            log.debug("REST request to get all RegistroMesas where factura is null");
            return registroMesaService.findAllWhereFacturaIsNull();
        }
        log.debug("REST request to get all RegistroMesas");
        return registroMesaService.findAll();
    }

    /**
     * {@code GET  /registro-mesas/:id} : get the "id" registroMesa.
     *
     * @param id the id of the registroMesa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registroMesa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/registro-mesas/{id}")
    public ResponseEntity<RegistroMesa> getRegistroMesa(@PathVariable Long id) {
        log.debug("REST request to get RegistroMesa : {}", id);
        Optional<RegistroMesa> registroMesa = registroMesaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(registroMesa);
    }

    /**
     * {@code DELETE  /registro-mesas/:id} : delete the "id" registroMesa.
     *
     * @param id the id of the registroMesa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/registro-mesas/{id}")
    public ResponseEntity<Void> deleteRegistroMesa(@PathVariable Long id) {
        log.debug("REST request to delete RegistroMesa : {}", id);
        registroMesaService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
