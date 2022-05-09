package com.restaurante.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.restaurante.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MesaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mesa.class);
        Mesa mesa1 = new Mesa();
        mesa1.setId(1L);
        Mesa mesa2 = new Mesa();
        mesa2.setId(mesa1.getId());
        assertThat(mesa1).isEqualTo(mesa2);
        mesa2.setId(2L);
        assertThat(mesa1).isNotEqualTo(mesa2);
        mesa1.setId(null);
        assertThat(mesa1).isNotEqualTo(mesa2);
    }
}
