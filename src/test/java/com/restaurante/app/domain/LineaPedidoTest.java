package com.restaurante.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.restaurante.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LineaPedidoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LineaPedido.class);
        LineaPedido lineaPedido1 = new LineaPedido();
        lineaPedido1.setId(1L);
        LineaPedido lineaPedido2 = new LineaPedido();
        lineaPedido2.setId(lineaPedido1.getId());
        assertThat(lineaPedido1).isEqualTo(lineaPedido2);
        lineaPedido2.setId(2L);
        assertThat(lineaPedido1).isNotEqualTo(lineaPedido2);
        lineaPedido1.setId(null);
        assertThat(lineaPedido1).isNotEqualTo(lineaPedido2);
    }
}
