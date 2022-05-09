package com.restaurante.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.restaurante.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RegistroMesaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RegistroMesa.class);
        RegistroMesa registroMesa1 = new RegistroMesa();
        registroMesa1.setId(1L);
        RegistroMesa registroMesa2 = new RegistroMesa();
        registroMesa2.setId(registroMesa1.getId());
        assertThat(registroMesa1).isEqualTo(registroMesa2);
        registroMesa2.setId(2L);
        assertThat(registroMesa1).isNotEqualTo(registroMesa2);
        registroMesa1.setId(null);
        assertThat(registroMesa1).isNotEqualTo(registroMesa2);
    }
}
