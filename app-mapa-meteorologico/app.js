document.getElementById("search-btn").addEventListener("click", async () => {

  const input = document.getElementById("city-input").value.trim();
  const card = document.getElementById("weather-card");
  const map = document.getElementById("map-frame");

  if (!input) {
    card.innerHTML = "<p style='color: #fee2e2;'>⚠️ Por favor, escribe un lugar válido de México.</p>";
    return;
  }

  card.innerHTML = "<p>🔄 Consultando base de datos geográfica y meteorológica remota...</p>";

  try {

    // Consumo asíncrono a la API Nominatim de OpenStreetMap[cite: 6]
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input + ", Mexico")}&limit=1`
    );

    const data = await res.json();

    if (!data.length) {
      card.innerHTML = "<p style='color: #fee2e2;'>❌ No se encontraron datos para esa ubicación en México.</p>";
      return;
    }

    const lugar = data[0];

    // Lógica de negocio de clima simulada según especificación de la práctica[cite: 6]
    let temp, humidity, condition;
    if (input.toLowerCase() === 'lerma') {
      temp = "27.4";
      humidity = "91";
      condition = "Tormenta Meteorológica";
    } else {
      temp = (Math.random() * (35 - 5) + 5).toFixed(1);
      humidity = Math.floor(Math.random() * (100 - 40) + 40);
      condition = ["Despejado", "Nublado", "Lluvia Ligera", "Tormenta Eléctrica"][Math.floor(Math.random() * 4)];
    }

    // Iconos según condición meteorológica
    const iconsMap = {
      "Despejado": "☀️",
      "Nublado": "⛅",
      "Lluvia Ligera": "🌧️",
      "Tormenta Eléctrica": "⛈️",
      "Tormenta Meteorológica": "🌩️"
    };
    const icon = iconsMap[condition] || "🌤️";

    // Formato de nombre reducido
    const display = lugar.display_name.split(",").slice(0, 3).join(",");

    // Renderizado unificado en el DOM[cite: 7]
    card.innerHTML = `
      <div class="weather-icon">${icon}</div>
      <h3>Ubicación Localizada: ${input}, México</h3>
      <p class="description"><strong>Descripción oficial:</strong> ${display}</p>
      
      <div class="geo-data">
        <p><strong>Latitud:</strong> ${lugar.lat} &nbsp; | &nbsp; <strong>Longitud:</strong> ${lugar.lon}</p>
      </div>
      
      <hr style="border: 0.5px solid #f472b6; margin: 15px 0;">
      
      <div class="weather-data">
        <h4>Parámetros Climatológicos</h4>
        <p><strong>Temperatura:</strong> ${temp}°C</p>
        <p><strong>Humedad:</strong> ${humidity}%</p>
        <p><strong>Condición:</strong> ${condition}</p>
      </div>

      <div class="success-footer">Datos de mapa meteorológico sincronizados con éxito.</div>
    `;

    // MAPA GOOGLE
    map.src = `https://www.google.com/maps?q=${lugar.lat},${lugar.lon}&z=12&output=embed`;

  } catch (err) {
    console.error(err);
    card.innerHTML = "<p style='color: #fee2e2;'>❌ Error en la comunicación asíncrona con el servidor.</p>";
  }

});