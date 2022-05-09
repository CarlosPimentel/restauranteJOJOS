package com.restaurante.app.web.rest;

import static com.restaurante.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.restaurante.app.IntegrationTest;
import com.restaurante.app.domain.RegistroMesa;
import com.restaurante.app.repository.RegistroMesaRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link RegistroMesaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RegistroMesaResourceIT {

    private static final ZonedDateTime DEFAULT_FECHA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/registro-mesas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RegistroMesaRepository registroMesaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegistroMesaMockMvc;

    private RegistroMesa registroMesa;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroMesa createEntity(EntityManager em) {
        RegistroMesa registroMesa = new RegistroMesa().fecha(DEFAULT_FECHA);
        return registroMesa;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroMesa createUpdatedEntity(EntityManager em) {
        RegistroMesa registroMesa = new RegistroMesa().fecha(UPDATED_FECHA);
        return registroMesa;
    }

    @BeforeEach
    public void initTest() {
        registroMesa = createEntity(em);
    }

    @Test
    @Transactional
    void createRegistroMesa() throws Exception {
        int databaseSizeBeforeCreate = registroMesaRepository.findAll().size();
        // Create the RegistroMesa
        restRegistroMesaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroMesa)))
            .andExpect(status().isCreated());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeCreate + 1);
        RegistroMesa testRegistroMesa = registroMesaList.get(registroMesaList.size() - 1);
        assertThat(testRegistroMesa.getFecha()).isEqualTo(DEFAULT_FECHA);
    }

    @Test
    @Transactional
    void createRegistroMesaWithExistingId() throws Exception {
        // Create the RegistroMesa with an existing ID
        registroMesa.setId(1L);

        int databaseSizeBeforeCreate = registroMesaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegistroMesaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroMesa)))
            .andExpect(status().isBadRequest());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFechaIsRequired() throws Exception {
        int databaseSizeBeforeTest = registroMesaRepository.findAll().size();
        // set the field null
        registroMesa.setFecha(null);

        // Create the RegistroMesa, which fails.

        restRegistroMesaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroMesa)))
            .andExpect(status().isBadRequest());

        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRegistroMesas() throws Exception {
        // Initialize the database
        registroMesaRepository.saveAndFlush(registroMesa);

        // Get all the registroMesaList
        restRegistroMesaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registroMesa.getId().intValue())))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(sameInstant(DEFAULT_FECHA))));
    }

    @Test
    @Transactional
    void getRegistroMesa() throws Exception {
        // Initialize the database
        registroMesaRepository.saveAndFlush(registroMesa);

        // Get the registroMesa
        restRegistroMesaMockMvc
            .perform(get(ENTITY_API_URL_ID, registroMesa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(registroMesa.getId().intValue()))
            .andExpect(jsonPath("$.fecha").value(sameInstant(DEFAULT_FECHA)));
    }

    @Test
    @Transactional
    void getNonExistingRegistroMesa() throws Exception {
        // Get the registroMesa
        restRegistroMesaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRegistroMesa() throws Exception {
        // Initialize the database
        registroMesaRepository.saveAndFlush(registroMesa);

        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();

        // Update the registroMesa
        RegistroMesa updatedRegistroMesa = registroMesaRepository.findById(registroMesa.getId()).get();
        // Disconnect from session so that the updates on updatedRegistroMesa are not directly saved in db
        em.detach(updatedRegistroMesa);
        updatedRegistroMesa.fecha(UPDATED_FECHA);

        restRegistroMesaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRegistroMesa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRegistroMesa))
            )
            .andExpect(status().isOk());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
        RegistroMesa testRegistroMesa = registroMesaList.get(registroMesaList.size() - 1);
        assertThat(testRegistroMesa.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void putNonExistingRegistroMesa() throws Exception {
        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();
        registroMesa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroMesaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, registroMesa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroMesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegistroMesa() throws Exception {
        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();
        registroMesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMesaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroMesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegistroMesa() throws Exception {
        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();
        registroMesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMesaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroMesa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegistroMesaWithPatch() throws Exception {
        // Initialize the database
        registroMesaRepository.saveAndFlush(registroMesa);

        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();

        // Update the registroMesa using partial update
        RegistroMesa partialUpdatedRegistroMesa = new RegistroMesa();
        partialUpdatedRegistroMesa.setId(registroMesa.getId());

        restRegistroMesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroMesa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistroMesa))
            )
            .andExpect(status().isOk());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
        RegistroMesa testRegistroMesa = registroMesaList.get(registroMesaList.size() - 1);
        assertThat(testRegistroMesa.getFecha()).isEqualTo(DEFAULT_FECHA);
    }

    @Test
    @Transactional
    void fullUpdateRegistroMesaWithPatch() throws Exception {
        // Initialize the database
        registroMesaRepository.saveAndFlush(registroMesa);

        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();

        // Update the registroMesa using partial update
        RegistroMesa partialUpdatedRegistroMesa = new RegistroMesa();
        partialUpdatedRegistroMesa.setId(registroMesa.getId());

        partialUpdatedRegistroMesa.fecha(UPDATED_FECHA);

        restRegistroMesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroMesa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistroMesa))
            )
            .andExpect(status().isOk());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
        RegistroMesa testRegistroMesa = registroMesaList.get(registroMesaList.size() - 1);
        assertThat(testRegistroMesa.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    @Transactional
    void patchNonExistingRegistroMesa() throws Exception {
        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();
        registroMesa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroMesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, registroMesa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroMesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegistroMesa() throws Exception {
        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();
        registroMesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroMesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegistroMesa() throws Exception {
        int databaseSizeBeforeUpdate = registroMesaRepository.findAll().size();
        registroMesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMesaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(registroMesa))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroMesa in the database
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegistroMesa() throws Exception {
        // Initialize the database
        registroMesaRepository.saveAndFlush(registroMesa);

        int databaseSizeBeforeDelete = registroMesaRepository.findAll().size();

        // Delete the registroMesa
        restRegistroMesaMockMvc
            .perform(delete(ENTITY_API_URL_ID, registroMesa.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RegistroMesa> registroMesaList = registroMesaRepository.findAll();
        assertThat(registroMesaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
