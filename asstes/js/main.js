    // JavaScript - محسن ومرتب
        let currentWeatherData = null;
        let forecastData = null;
        let locationData = null;

        // عناصر DOM
        const inputFind = document.getElementById('inputFind');
        const btnFind = document.getElementById('btnFind');
        const weatherContent = document.getElementById('weatherContent');
        const loader = document.getElementById('loader');

        // تهيئة التطبيق
        document.addEventListener('DOMContentLoaded', function() {
            // تحميل بيانات الطقس الافتراضية
            gitData('Cairo');
            
            // إضافة مستمعات الأحداث
            btnFind.addEventListener('click', findCity);
            inputFind.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    findCity();
                }
            });
        });

        // البحث عن مدينة
        function findCity() {
            const city = inputFind.value.trim();
            if (city !== '') {
                gitData(city);
            } else {
                showError('Please enter a city name');
            }
        }

        // الحصول على بيانات الطقس من API
        async function gitData(city) {
            if (!city) return;
            
            showLoader();
            
            try {
                const apiKey = 'dd03e862d2f544419ce191849252804';
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                if (data.error) {
                    showError(data.error.message);
                    return;
                }
                
                currentWeatherData = data.current;
                locationData = data.location;
                forecastData = data.forecast.forecastday;
                
                displayWeatherData();
                
            } catch (error) {
                console.error('Error fetching weather data:', error);
                showError('Unable to load weather data. Please check your connection and try again.');
            } finally {
                hideLoader();
            }
        }

        // عرض بيانات الطقس
        function displayWeatherData() {
            if (!currentWeatherData || !locationData || !forecastData) return;
            
            const currentDate = new Date(locationData.localtime);
            const formattedDate = formatDate(currentDate);
            
            // إنشاء HTML لبيانات الطقس الحالية
            let weatherHTML = `
                <div class="current-weather animate-fadeIn">
                    <div class="location-info">
                        <h2><i class="fas fa-map-marker-alt" style="color: var(--accent-color);"></i> ${locationData.name}, ${locationData.country}</h2>
                        <h3>${formattedDate.dayName}, ${formattedDate.date}</h3>
                        <div class="mt-3">
                            <p><i class="fas fa-clock"></i> Local Time: ${currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                    
                    <div class="weather-main">
                        <div class="temperature">${Math.round(currentWeatherData.temp_c)}°C</div>
                        <div class="weather-condition">
                            <img src="${currentWeatherData.condition.icon}" alt="${currentWeatherData.condition.text}" class="weather-icon">
                            <div>${currentWeatherData.condition.text}</div>
                        </div>
                    </div>
                </div>
                
                <div class="weather-details animate-fadeIn" style="animation-delay: 0.2s">
                    <div class="detail-card">
                        <div class="detail-icon"><i class="fas fa-wind"></i></div>
                        <div class="detail-value">${currentWeatherData.wind_kph} km/h</div>
                        <div class="detail-label">Wind Speed</div>
                        <div class="mt-2 small">Direction: ${currentWeatherData.wind_dir}</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-icon"><i class="fas fa-tint"></i></div>
                        <div class="detail-value">${currentWeatherData.humidity}%</div>
                        <div class="detail-label">Humidity</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-icon"><i class="fas fa-umbrella"></i></div>
                        <div class="detail-value">${currentWeatherData.precip_mm} mm</div>
                        <div class="detail-label">Precipitation</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-icon"><i class="fas fa-compress-alt"></i></div>
                        <div class="detail-value">${currentWeatherData.pressure_mb} hPa</div>
                        <div class="detail-label">Pressure</div>
                    </div>
                </div>
                
                <div class="forecast-section" style="animation-delay: 0.4s">
                    <h3 class="forecast-title"><i class="fas fa-calendar-alt"></i> 3-Day Forecast</h3>
                    <div class="forecast-container">
            `;
            
            // إضافة توقعات الأيام
            forecastData.forEach((day, index) => {
                const date = new Date(day.date);
                const dayName = formatDate(date).dayNameShort;
                const isToday = index === 0;
                
                weatherHTML += `
                    <div class="forecast-day ${isToday ? 'active' : ''}">
                        <div class="day-name">${isToday ? 'Today' : dayName}</div>
                        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon">
                        <div class="forecast-temp">${Math.round(day.day.maxtemp_c)}°</div>
                        <div class="forecast-condition">${day.day.condition.text}</div>
                        <div class="mt-2 small">
                            <div>H: ${Math.round(day.day.maxtemp_c)}°</div>
                            <div>L: ${Math.round(day.day.mintemp_c)}°</div>
                        </div>
                    </div>
                `;
            });
            
            weatherHTML += `
                    </div>
                </div>
                
                <div class="mt-4 text-center small" style="color: var(--text-secondary); margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <p>Last updated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | Data provided by WeatherAPI.com</p>
                </div>
            `;
            
            weatherContent.innerHTML = weatherHTML;
        }

        // تنسيق التاريخ
        function formatDate(date) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            const dayName = dayNames[date.getDay()];
            const dayNameShort = dayNamesShort[date.getDay()];
            const day = date.getDate();
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            
            return {
                dayName: dayName,
                dayNameShort: dayNameShort,
                date: `${day} ${month} ${year}`
            };
        }

        // إظهار مؤشر التحميل
        function showLoader() {
            loader.style.display = 'block';
            weatherContent.innerHTML = '';
        }

        // إخفاء مؤشر التحميل
        function hideLoader() {
            loader.style.display = 'none';
        }

        // إظهار رسالة خطأ
        function showError(message) {
            hideLoader();
            weatherContent.innerHTML = `
                <div class="error-message animate-fadeIn">
                    <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button onclick="gitData('Cairo')" class="search-btn mt-3">Try Again</button>
                </div>
            `;
        }

        // إظهار رسالة نجاح
        function showSuccess(message) {
            weatherContent.innerHTML = `
                <div class="success-message animate-fadeIn">
                    <i class="fas fa-check-circle fa-2x mb-3"></i>
                    <h3>Success!</h3>
                    <p>${message}</p>
                </div>
            `;
        }

        // البحث التلقائي عند الكتابة (مع تأخير)
        let searchTimeout;
        inputFind.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const city = inputFind.value.trim();
            
            if (city.length >= 3) {
                searchTimeout = setTimeout(() => {
                    gitData(city);
                }, 800);
            }
        });