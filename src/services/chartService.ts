import { HotelData } from './dataServices'; // Importamos la interfaz HotelData

// Definimos un tipo que representa los nombres de las propiedades de estrato en HotelData
type StratumKeys = 'estrato_1' | 'estrato_2' | 'estrato_3' | 'estrato_4' | 'estrato_5' | 'estrato_6';

// Función para generar los datos del gráfico de barras basado en múltiples registros de programa y sus estratos
export function generateChartData(programData: HotelData[]): any {
  const strata: StratumKeys[] = ['estrato_1', 'estrato_2', 'estrato_3', 'estrato_4', 'estrato_5', 'estrato_6'];
  
  // Inicializar los valores de estratos con ceros
  const strataValues = strata.map(stratum => {
    return programData.reduce((sum, data) => sum + (data[stratum] ? parseInt(data[stratum] as string, 10) : 0), 0);
  });

  return {
    labels: strata.map(stratum => stratum.replace('_', ' ').toUpperCase()), // Etiquetas para el gráfico
    datasets: [{
      label: `Distribución de Estratos`,
      backgroundColor: '#42a5f5',
      data: strataValues,
    }],
  };
}

// Función para generar las opciones del gráfico
export function generateChartOptions(program: string): any {
  return {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar la altura/anchura libremente
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Distribución de Estratos en ${program}`,
      },
    },
  };
}
