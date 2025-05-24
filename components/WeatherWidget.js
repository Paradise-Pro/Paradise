import React, { useEffect, useState } from "react";

const WeatherWidget = ({ onClose }) => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const getWeatherIcon = (code) => {
    if (code === 0) return "☀️"; // Καθαρός ουρανός
    if (code >= 1 && code <= 3) return "⛅"; // Λίγα σύννεφα
    if (code >= 45 && code <= 48) return "🌫️"; // Ομίχλη
    if (code >= 51 && code <= 57) return "🌦️"; // Ψιλή βροχή
    if (code >= 61 && code <= 67) return "🌧️"; // Βροχή
    if (code >= 71 && code <= 77) return "❄️"; // Χιόνι
    if (code >= 80 && code <= 82) return "🌧️"; // Ισχυρή βροχή
    if (code >= 95 && code <= 99) return "⛈️"; // Καταιγίδα ή χαλάζι
    return "❓"; // Άγνωστη κατάσταση
  };

  const styles = {
    container: {
      background: "linear-gradient(to bottom, #7ecbff, #4a90e2)",
      color: "#fff",
      borderRadius: "24px",
      padding: "20px",
      width: isExpanded ? "300px" : "240px",
      fontFamily: "'SF Pro Display', sans-serif",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      position: "relative",
      textAlign: "center",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      position: "relative",
    },
    iconGroup: {
      position: "absolute",
      right: 0,
      top: 0,
      display: "flex",
      gap: "8px",
    },
    icon: {
      width: 16,
      height: 16,
      cursor: "pointer",
      opacity: 0.8,
    },
    iconBtn: {
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: "pointer",
    },
  };

  useEffect(() => {
    if (!navigator.geolocation || !navigator.permissions) {
      setError("Δεν υποστηρίζεται η τοποθεσία από τον browser.");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (
          permissionStatus.state === "granted" ||
          permissionStatus.state === "prompt"
        ) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCoords({ lat: latitude, lon: longitude });

              fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              )
                .then((res) => res.json())
                .then((data) => {
                  const { address } = data;
                  setLocationName(
                    `${
                      address.city ||
                      address.town ||
                      address.village ||
                      address.county ||
                      ""
                    }, ${address.country || ""}`
                  );
                });
            },
            () => {
              setError("Ο χρήστης δεν έδωσε άδεια τοποθεσίας.");
            }
          );
        } else {
          setError("Δεν έχει δοθεί άδεια για χρήση τοποθεσίας.");
        }
      });
  }, []);

  useEffect(() => {
    if (!coords) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
        );
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        setError("Σφάλμα φόρτωσης καιρού.");
      }
    };

    fetchWeather();
  }, [coords]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        Καιρός
        <div style={styles.iconGroup}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={styles.iconBtn}
          >
            <img src="/icons/expand.png" alt="expand" style={styles.icon} />
          </button>
          <button onClick={onClose} style={styles.iconBtn}>
            <img src="/icons/close.png" alt="close" style={styles.icon} />
          </button>
        </div>
      </div>

      {error && <p>{error}</p>}
      {!error && !weather && <p>Φόρτωση...</p>}

      {!error && weather && (
        <>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>
            {getWeatherIcon(weather.weathercode)}{" "}
            {Math.round(weather.temperature)}°C
          </h2>
          <p style={{ margin: 0 }}>Άνεμος: {weather.windspeed} km/h</p>
          {locationName && (
            <p style={{ marginTop: "0.5rem", opacity: 0.8 }}>{locationName}</p>
          )}
        </>
      )}

      <p style={{ fontSize: "0.7rem", marginTop: "1rem", opacity: 0.5 }}>
        🔒 Η λειτουργία μπορεί να επηρεαστεί από Ad Blockers.
      </p>
    </div>
  );
};

export default WeatherWidget;
