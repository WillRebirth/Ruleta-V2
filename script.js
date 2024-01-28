const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

const numSections = 42;
const sectionDegree = 360 / numSections;

const rotationValues = [];

// Crear etiquetas para las secciones
const labels = ["Aztecas", "Bengalies", "Bereberes", "Birmanos", "Bizantinos", "Bohemios", "Borgoñeses", "Britanos", "Bulgaros", "Celtas", "Chinos", "Coreanos", "Cumanos", "Dravidicos", "Eslavos", "Españoles", "Etiopes", "Francos", "Godos", "Gurjara", "Hunos", "Incas", "Indostanos", "Italianos", "Japoneses", "Jemeres", "Lituanos", "Magiares", "Malayos", "Malies", "Mayas", "Mongoles", "Persas", "Polacos", "Portugueses", "Sarracenos", "Sicilianos", "Tartaros", "Teutones", "Turcos", "Vietanamitas", "Vikingos"];

// Crear las secciones del círculo
for (let i = 0; i < numSections; i++) {
  const minDegree = i * sectionDegree;
  const maxDegree = (i + 1) * sectionDegree;

  rotationValues.push({
    minDegree: minDegree,
    maxDegree: maxDegree,
    value: labels[i],
  });
}

// Crear el gráfico
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "doughnut",
  data: {
    labels: labels,
    datasets: [
      {
        backgroundColor: getRandomColors(numSections),
        data: Array(numSections).fill(1),
      },
    ],
  },
  options: {
    responsive: true,
    cutoutPercentage: 60,
    rotation: 0,
    circumference: 360,
    animation: {
      duration: 0, // Desactivar la animación inicial
    },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff", // Color del texto
        backgroundColor: "#000000", // Color de fondo del texto
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 12 },
      },
    },
  },
});

const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue < i.maxDegree) {
      finalValue.innerHTML = `<p style="color: #FFD300; font-size:3em; font-weight:600; background-color: #ffffff;"> ${i.value}</p>`;
      spinBtn.disabled = false;

      // Resaltar el resultado cambiando el color del segmento ganador a rojo brillante
      const winningSegmentIndex = i.minDegree / sectionDegree;
      myChart.data.datasets[0].backgroundColor[winningSegmentIndex] = "#FF0000"; // Rojo brillante
      myChart.update();

      break;
    }
  }
};

let rotationInterval; // Declarar la variable fuera de la función

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  let randomDegree = Math.floor(Math.random() * 360);

  // Obtener el valor actual de la rotación en un rango de 0 a 359
  let initialRotation = myChart.options.rotation % 360;

  // Calcular la rotación objetivo
  let targetRotation = initialRotation + 1080 + randomDegree;

  function rotate() {
    myChart.options.rotation += 2; // Incremento constante para la rotación
    myChart.update();

    if (myChart.options.rotation >= targetRotation) {
      clearInterval(rotationInterval);
      valueGenerator(randomDegree);

      // Agregar un retraso de 4 segundos antes de reiniciar la ruleta
      setTimeout(() => {
        spinBtn.disabled = false;
        myChart.options.rotation = 0;
        myChart.data.datasets[0].backgroundColor = getRandomColors(numSections); // Restaurar colores originales
        myChart.update();
      }, 1000);
    }
  }

  clearInterval(rotationInterval); // Reiniciar el intervalo si ya estaba en uso
  rotationInterval = setInterval(rotate, 10);
  rotate(); // Llamada adicional para iniciar la rotación inmediatamente
});

// Función para generar colores aleatorios
function getRandomColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(getRandomColor());
  }
  return colors;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}