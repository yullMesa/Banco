// --- CLASE BASE: CUENTA ---
// --- CLASE BASE: CUENTA ---
class Cuenta {
  _saldo; // Cambiamos a _saldo para permitir gestión controlada en subclases

  constructor(numeroCuenta, saldoInicial = 0) {
    this.numeroCuenta = numeroCuenta;
    this._saldo = saldoInicial;
  }

  getSaldo() {
    return this._saldo;
  }

  consignar(monto) {
    if (monto <= 0) {
      throw new Error("El monto a consignar debe ser mayor a cero.");
    }
    this._saldo += monto;
    return this._saldo;
  }

  retirar(monto) {
    if (monto <= 0) {
      throw new Error("El monto a retirar debe ser mayor a cero.");
    }
    if (monto > this._saldo) {
      throw new Error("Saldo insuficiente.");
    }
    this._saldo -= monto;
    return this._saldo;
  }
}


// --- CUENTA DE AHORROS (Herencia de Cuenta) ---
class CuentaAhorros extends Cuenta {
  constructor(numeroCuenta, saldoInicial = 0) {
    super(numeroCuenta, saldoInicial);
  }

  // Polimorfismo: Aplica el 1.5% de interés mensual al retirar
  retirar(monto) {
    const tasaInteres = 0.015; // 1.5% mensual solicitado en la rúbrica
    const interesAplicado = monto * tasaInteres;
    const totalADebitar = monto + interesAplicado;

    if (totalADebitar > this.getSaldo()) {
      throw new Error(`Saldo insuficiente. Incluyendo el 1.5% de interés ($${interesAplicado.toFixed(2)}), el total a debitar es $${totalADebitar.toFixed(2)}.`);
    }

    // Usamos una simulación restando el total con intereses
    super.retirar(totalADebitar);
    return {
      nuevoSaldo: this.getSaldo(),
      interesCobrado: interesAplicado
    };
  }
}

// --- CUENTA CORRIENTE (Herencia de Cuenta) ---
class CuentaCorriente extends Cuenta {
  constructor(numeroCuenta, saldoInicial = 0) {
    super(numeroCuenta, saldoInicial);
  }

  // Polimorfismo: Permite un sobregiro de hasta el 20% adicional
  retirar(monto) {
    if (monto <= 0) {
      throw new Error("El monto a retirar debe ser mayor a cero.");
    }
    
    const saldoActual = this.getSaldo();
    const limiteConSobregiro = saldoActual + (saldoActual * 0.20); // 20% sobregiro

    if (monto > limiteConSobregiro) {
      throw new Error("El monto supera el saldo disponible y el límite de sobregiro del 20%.");
    }

    // Restamos directamente usando _saldo para permitir sobregiro negativo controlado
    this._saldo -= monto;

    return {
      nuevoSaldo: this.getSaldo(),
      sobregiroUtilizado: this._saldo < 0 ? Math.abs(this._saldo) : 0
    };
  }
}

// --- TARJETA DE CRÉDITO (Independiente / Línea de Crédito) ---
class TarjetaCredito {
  #cupoTotal;
  #cupoUtilizado;

  constructor(numeroTarjeta, cupoTotal = 1000000) {
    this.numeroTarjeta = numeroTarjeta;
    this.#cupoTotal = cupoTotal;
    this.#cupoUtilizado = 0;
  }

  getCupoTotal() { return this.#cupoTotal; }
  getCupoUtilizado() { return this.#cupoUtilizado; }
  getCupoDisponible() { return this.#cupoTotal - this.#cupoUtilizado; }

  // Calcular cuota mensual según la tabla de tasas de interés de la rúbrica
  financiarCompra(montoCompra, cuotas) {
    if (montoCompra <= 0 || cuotas <= 0) {
      throw new Error("Monto o número de cuotas inválidos.");
    }
    if (montoCompra > this.getCupoDisponible()) {
      throw new Error("La compra supera el cupo disponible de la tarjeta de crédito.");
    }

    let tasaMensual = 0;
    if (cuotas <= 2) {
      tasaMensual = 0;     // <= 2 cuotas: 0% de interés
    } else if (cuotas >= 3 && cuotas <= 6) {
      tasaMensual = 0.019; // 3 a 6 cuotas: 1.9% mensual
    } else {
      tasaMensual = 0.023; // >= 7 cuotas: 2.3% mensual
    }

    let cuotaMensual = 0;
    if (tasaMensual === 0) {
      cuotaMensual = montoCompra / cuotas;
    } else {
      // Fórmula exacta exigida por la rúbrica: Cuota = (Capital * tasa) / (1 - (1 + tasa)^(-n))
      cuotaMensual = (montoCompra * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
    }

    this.#cupoUtilizado += montoCompra;

    return {
      montoCompra,
      cuotas,
      tasaAplicada: tasaMensual * 100 + "%",
      cuotaMensual: cuotaMensual.toFixed(2),
      nuevoCupoDisponible: this.getCupoDisponible()
    };
  }
}

// --- CLASE CLIENTE ---
class Cliente {
  #password;

  constructor(identificacion, fullName, celular, username, password) {
    this.identificacion = identificacion;
    this.fullName = fullName;
    this.celular = celular;
    this.username = username;
    this.#password = password;
    
    // Instanciación de productos asociados al cliente
    this.cuentaAhorros = new CuentaAhorros("AH-" + identificacion, 0);
    this.cuentaCorriente = new CuentaCorriente("CC-" + identificacion, 0);
    this.tarjetaCredito = new TarjetaCredito("TC-" + identificacion, 1500000);
  }

  verificarPassword(passIngresada) {
    return this.#password === passIngresada;
  }

  cambiarPassword(passActual, passNueva) {
    if (this.verificarPassword(passActual)) {
      this.#password = passNueva;
      return true;
    }
    return false;
  }
}