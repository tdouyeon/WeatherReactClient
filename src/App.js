import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // App.css 파일을 불러옵니다.

function App() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost/countries')
      .then(response => setCountries(response.data))
      .catch(error => console.error('나라 목록을 가져오는 중 에러 발생:', error));
  }, []);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setSelectedCountry(selectedCountry);

    try {
      const response = await axios.get(`http://localhost/cities/${selectedCountry}`);
      setCities(response.data);
    } catch (error) {
      console.error('도시 목록을 가져오는 중 에러 발생:', error);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setSelectedCity(selectedCity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost/weather?country=${selectedCountry}&city=${selectedCity}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('날씨 정보를 가져오는 중 에러 발생:', error);
    }
  };

  return (
    <div className="weather-app">
      <h1>날씨 정보</h1>
      <form onSubmit={handleSubmit}>
        <label>
          나라:
          <select value={selectedCountry} onChange={handleCountryChange}>
            <option value="">나라 선택</option>
            {countries.map(country => (
              <option key={country.name} value={country.name}>{country.name}</option>
            ))}
          </select>
        </label>
        <label>
          도시:
          <select value={selectedCity} onChange={handleCityChange}>
            <option value="">도시 선택</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">날씨 정보 가져오기</button>
      </form>

      {weatherData && (
        <div className="weather-info">
          <p>도시: {weatherData.name}</p>
          <p>온도: {weatherData.main.temp}</p>
          <p>날씨: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;