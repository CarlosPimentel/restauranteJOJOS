package com.restaurante.app.web.rest;

import com.restaurante.app.domain.Mesa;
import com.restaurante.app.repository.MesaRepository;
import com.restaurante.app.service.MesaService;
import com.restaurante.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
 * REST controller for managing {@link com.restaurante.app.domain.Mesa}.
 */
@RestController
@RequestMapping("/api")
public class MesaResource {

    private final Logger log = LoggerFactory.getLogger(MesaResource.class);

    private static final String ENTITY_NAME = "mesa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MesaService mesaService;

    private final MesaRepository mesaRepository;

    public MesaResource(MesaService mesaService, MesaRepository mesaRepository) {
        this.mesaService = mesaService;
        this.mesaRepository = mesaRepository;
    }

    /**
     * {@code POST  /mesas} : Create a new mesa.
     *
     * @param mesa the mesa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mesa, or with status {@code 400 (Bad Request)} if the mesa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mesas")
    public ResponseEntity<Mesa> createMesa(@Valid @RequestBody Mesa mesa) throws URISyntaxException {
        log.debug("REST request to save Mesa : {}", mesa);
        if (mesa.getId() != null) {
            throw new BadRequestAlertException("A new mesa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mesa result = mesaService.save(mesa);
        return ResponseEntity
            .created(new URI("/api/mesas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mesas/:id} : Updates an existing mesa.
     *
     * @param id the id of the mesa to save.
     * @param mesa the mesa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mesa,
     * or with status {@code 400 (Bad Request)} if the mesa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mesa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mesas/{id}")
    public ResponseEntity<Mesa> updateMesa(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Mesa mesa)
        throws URISyntaxException {
        log.debug("REST request to update Mesa : {}, {}", id, mesa);
        if (mesa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mesa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mesaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mesa result = mesaService.save(mesa);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mesa.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mesas/:id} : Partial updates given fields of an existing mesa, field will ignore if it is null
     *
     * @param id the id of the mesa to save.
     * @param mesa the mesa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mesa,
     * or with status {@code 400 (Bad Request)} if the mesa is not valid,
     * or with status {@code 404 (Not Found)} if the mesa is not found,
     * or with status {@code 500 (Internal Server Error)} if the mesa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mesas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mesa> partialUpdateMesa(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Mesa mesa
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mesa partially : {}, {}", id, mesa);
        if (mesa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mesa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mesaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mesa> result = mesaService.partialUpdate(mesa);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mesa.getId().toString())
        );
    }

    /**
     * {@code GET  /mesas} : get all the mesas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mesas in body.
     */
    @GetMapping("/mesas")
    public List<Mesa> getAllMesas() {
        log.debug("REST request to get all Mesas");
        return mesaService.findAll();
    }

    /**
     * {@code GET  /mesas/:id} : get the "id" mesa.
     *
     * @param id the id of the mesa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mesa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mesas/{id}")
    public ResponseEntity<Mesa> getMesa(@PathVariable Long id) {
        log.debug("REST request to get Mesa : {}", id);
        Optional<Mesa> mesa = mesaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mesa);
    }

    /**
     * {@code DELETE  /mesas/:id} : delete the "id" mesa.
     *
     * @param id the id of the mesa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mesas/{id}")
    public ResponseEntity<Void> deleteMesa(@PathVariable Long id) {
        log.debug("REST request to delete Mesa : {}", id);
        mesaService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/mesas/ultimasmesas")
    public List<Mesa> devolverUltimasMesas() {
        List<Mesa> listaMesas = new ArrayList<Mesa>();

        for (int i = 1; i <= 6; i++) {
            listaMesas.add(mesaService.devolverUltimasMesas(i));
        }

        return listaMesas;
    }

}
