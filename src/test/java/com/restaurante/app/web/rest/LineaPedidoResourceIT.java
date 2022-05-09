package com.restaurante.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.restaurante.app.IntegrationTest;
import com.restaurante.app.domain.LineaPedido;
import com.restaurante.app.repository.LineaPedidoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LineaPedidoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LineaPedidoResourceIT {

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final Integer DEFAULT_IVA = 1;
    private static final Integer UPDATED_IVA = 2;

    private static final Integer DEFAULT_CANTIDAD = 1;
    private static final Integer UPDATED_CANTIDAD = 2;

    private static final String ENTITY_API_URL = "/api/linea-pedidos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LineaPedidoRepository lineaPedidoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLineaPedidoMockMvc;

    private LineaPedido lineaPedido;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LineaPedido createEntity(EntityManager em) {
        LineaPedido lineaPedido = new LineaPedido().precio(DEFAULT_PRECIO).iva(DEFAULT_IVA).cantidad(DEFAULT_CANTIDAD);
        return lineaPedido;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LineaPedido createUpdatedEntity(EntityManager em) {
        LineaPedido lineaPedido = new LineaPedido().precio(UPDATED_PRECIO).iva(UPDATED_IVA).cantidad(UPDATED_CANTIDAD);
        return lineaPedido;
    }

    @BeforeEach
    public void initTest() {
        lineaPedido = createEntity(em);
    }

    @Test
    @Transactional
    void createLineaPedido() throws Exception {
        int databaseSizeBeforeCreate = lineaPedidoRepository.findAll().size();
        // Create the LineaPedido
        restLineaPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lineaPedido)))
            .andExpect(status().isCreated());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeCreate + 1);
        LineaPedido testLineaPedido = lineaPedidoList.get(lineaPedidoList.size() - 1);
        assertThat(testLineaPedido.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testLineaPedido.getIva()).isEqualTo(DEFAULT_IVA);
        assertThat(testLineaPedido.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
    }

    @Test
    @Transactional
    void createLineaPedidoWithExistingId() throws Exception {
        // Create the LineaPedido with an existing ID
        lineaPedido.setId(1L);

        int databaseSizeBeforeCreate = lineaPedidoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLineaPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lineaPedido)))
            .andExpect(status().isBadRequest());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPrecioIsRequired() throws Exception {
        int databaseSizeBeforeTest = lineaPedidoRepository.findAll().size();
        // set the field null
        lineaPedido.setPrecio(null);

        // Create the LineaPedido, which fails.

        restLineaPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lineaPedido)))
            .andExpect(status().isBadRequest());

        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIvaIsRequired() throws Exception {
        int databaseSizeBeforeTest = lineaPedidoRepository.findAll().size();
        // set the field null
        lineaPedido.setIva(null);

        // Create the LineaPedido, which fails.

        restLineaPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lineaPedido)))
            .andExpect(status().isBadRequest());

        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadIsRequired() throws Exception {
        int databaseSizeBeforeTest = lineaPedidoRepository.findAll().size();
        // set the field null
        lineaPedido.setCantidad(null);

        // Create the LineaPedido, which fails.

        restLineaPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lineaPedido)))
            .andExpect(status().isBadRequest());

        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLineaPedidos() throws Exception {
        // Initialize the database
        lineaPedidoRepository.saveAndFlush(lineaPedido);

        // Get all the lineaPedidoList
        restLineaPedidoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lineaPedido.getId().intValue())))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())))
            .andExpect(jsonPath("$.[*].iva").value(hasItem(DEFAULT_IVA)))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD)));
    }

    @Test
    @Transactional
    void getLineaPedido() throws Exception {
        // Initialize the database
        lineaPedidoRepository.saveAndFlush(lineaPedido);

        // Get the lineaPedido
        restLineaPedidoMockMvc
            .perform(get(ENTITY_API_URL_ID, lineaPedido.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lineaPedido.getId().intValue()))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()))
            .andExpect(jsonPath("$.iva").value(DEFAULT_IVA))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD));
    }

    @Test
    @Transactional
    void getNonExistingLineaPedido() throws Exception {
        // Get the lineaPedido
        restLineaPedidoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLineaPedido() throws Exception {
        // Initialize the database
        lineaPedidoRepository.saveAndFlush(lineaPedido);

        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();

        // Update the lineaPedido
        LineaPedido updatedLineaPedido = lineaPedidoRepository.findById(lineaPedido.getId()).get();
        // Disconnect from session so that the updates on updatedLineaPedido are not directly saved in db
        em.detach(updatedLineaPedido);
        updatedLineaPedido.precio(UPDATED_PRECIO).iva(UPDATED_IVA).cantidad(UPDATED_CANTIDAD);

        restLineaPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLineaPedido.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLineaPedido))
            )
            .andExpect(status().isOk());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
        LineaPedido testLineaPedido = lineaPedidoList.get(lineaPedidoList.size() - 1);
        assertThat(testLineaPedido.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testLineaPedido.getIva()).isEqualTo(UPDATED_IVA);
        assertThat(testLineaPedido.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
    }

    @Test
    @Transactional
    void putNonExistingLineaPedido() throws Exception {
        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();
        lineaPedido.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLineaPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lineaPedido.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineaPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLineaPedido() throws Exception {
        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();
        lineaPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineaPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineaPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLineaPedido() throws Exception {
        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();
        lineaPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineaPedidoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lineaPedido)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLineaPedidoWithPatch() throws Exception {
        // Initialize the database
        lineaPedidoRepository.saveAndFlush(lineaPedido);

        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();

        // Update the lineaPedido using partial update
        LineaPedido partialUpdatedLineaPedido = new LineaPedido();
        partialUpdatedLineaPedido.setId(lineaPedido.getId());

        partialUpdatedLineaPedido.precio(UPDATED_PRECIO).iva(UPDATED_IVA).cantidad(UPDATED_CANTIDAD);

        restLineaPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLineaPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLineaPedido))
            )
            .andExpect(status().isOk());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
        LineaPedido testLineaPedido = lineaPedidoList.get(lineaPedidoList.size() - 1);
        assertThat(testLineaPedido.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testLineaPedido.getIva()).isEqualTo(UPDATED_IVA);
        assertThat(testLineaPedido.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
    }

    @Test
    @Transactional
    void fullUpdateLineaPedidoWithPatch() throws Exception {
        // Initialize the database
        lineaPedidoRepository.saveAndFlush(lineaPedido);

        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();

        // Update the lineaPedido using partial update
        LineaPedido partialUpdatedLineaPedido = new LineaPedido();
        partialUpdatedLineaPedido.setId(lineaPedido.getId());

        partialUpdatedLineaPedido.precio(UPDATED_PRECIO).iva(UPDATED_IVA).cantidad(UPDATED_CANTIDAD);

        restLineaPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLineaPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLineaPedido))
            )
            .andExpect(status().isOk());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
        LineaPedido testLineaPedido = lineaPedidoList.get(lineaPedidoList.size() - 1);
        assertThat(testLineaPedido.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testLineaPedido.getIva()).isEqualTo(UPDATED_IVA);
        assertThat(testLineaPedido.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
    }

    @Test
    @Transactional
    void patchNonExistingLineaPedido() throws Exception {
        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();
        lineaPedido.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLineaPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lineaPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lineaPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLineaPedido() throws Exception {
        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();
        lineaPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineaPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lineaPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLineaPedido() throws Exception {
        int databaseSizeBeforeUpdate = lineaPedidoRepository.findAll().size();
        lineaPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineaPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lineaPedido))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LineaPedido in the database
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLineaPedido() throws Exception {
        // Initialize the database
        lineaPedidoRepository.saveAndFlush(lineaPedido);

        int databaseSizeBeforeDelete = lineaPedidoRepository.findAll().size();

        // Delete the lineaPedido
        restLineaPedidoMockMvc
            .perform(delete(ENTITY_API_URL_ID, lineaPedido.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LineaPedido> lineaPedidoList = lineaPedidoRepository.findAll();
        assertThat(lineaPedidoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
