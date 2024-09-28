// Función para generar los datos del gráfico de barras basado en un programa y sus estratos
export function generarDatosGraficoEstratos(programaDatos) {
    const estratos = ['estrato_1', 'estrato_2', 'estrato_3', 'estrato_4', 'estrato_5', 'estrato_6'];
    const valoresEstratos = estratos.map(estrato => programaDatos[estrato] ? parseInt(programaDatos[estrato]) : 0);
  
    return {
      labels: estratos.map(estrato => estrato.replace('_', ' ').toUpperCase()), // Etiquetas para el gráfico
      datasets: [{
        label: `Distribución de Estratos`,
        backgroundColor: '#42a5f5',
        data: valoresEstratos,
      }],
    };
  }
  
  // Función para generar las opciones del gráfico
  export function generarOpcionesGrafico(programa) {
    return {
      responsive: true,
      maintainAspectRatio: false, // Permite ajustar la altura/anchura libremente
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Distribución de Estratos en ${programa}`,
        },
      },
    };
  }
  