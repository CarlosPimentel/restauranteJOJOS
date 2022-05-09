package com.restaurante.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mesa.
 */
@Entity
@Table(name = "mesa")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Mesa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 2)
    @Column(name = "estado", nullable = false)
    private Integer estado;

    @NotNull
    @Column(name = "numero", nullable = false)
    private Integer numero;

    @OneToMany(mappedBy = "mesa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mesa" }, allowSetters = true)
    private Set<Reserva> reservas = new HashSet<>();

    @OneToMany(mappedBy = "mesa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mesa", "factura", "lineaPedidos" }, allowSetters = true)
    private Set<RegistroMesa> registroMesas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mesa id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getEstado() {
        return this.estado;
    }

    public Mesa estado(Integer estado) {
        this.setEstado(estado);
        return this;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Integer getNumero() {
        return this.numero;
    }

    public Mesa numero(Integer numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public Set<Reserva> getReservas() {
        return this.reservas;
    }

    public void setReservas(Set<Reserva> reservas) {
        if (this.reservas != null) {
            this.reservas.forEach(i -> i.setMesa(null));
        }
        if (reservas != null) {
            reservas.forEach(i -> i.setMesa(this));
        }
        this.reservas = reservas;
    }

    public Mesa reservas(Set<Reserva> reservas) {
        this.setReservas(reservas);
        return this;
    }

    public Mesa addReserva(Reserva reserva) {
        this.reservas.add(reserva);
        reserva.setMesa(this);
        return this;
    }

    public Mesa removeReserva(Reserva reserva) {
        this.reservas.remove(reserva);
        reserva.setMesa(null);
        return this;
    }

    public Set<RegistroMesa> getRegistroMesas() {
        return this.registroMesas;
    }

    public void setRegistroMesas(Set<RegistroMesa> registroMesas) {
        if (this.registroMesas != null) {
            this.registroMesas.forEach(i -> i.setMesa(null));
        }
        if (registroMesas != null) {
            registroMesas.forEach(i -> i.setMesa(this));
        }
        this.registroMesas = registroMesas;
    }

    public Mesa registroMesas(Set<RegistroMesa> registroMesas) {
        this.setRegistroMesas(registroMesas);
        return this;
    }

    public Mesa addRegistroMesa(RegistroMesa registroMesa) {
        this.registroMesas.add(registroMesa);
        registroMesa.setMesa(this);
        return this;
    }

    public Mesa removeRegistroMesa(RegistroMesa registroMesa) {
        this.registroMesas.remove(registroMesa);
        registroMesa.setMesa(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mesa)) {
            return false;
        }
        return id != null && id.equals(((Mesa) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mesa{" +
            "id=" + getId() +
            ", estado=" + getEstado() +
            ", numero=" + getNumero() +
            "}";
    }
}
