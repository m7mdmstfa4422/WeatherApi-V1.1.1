var allCityCURR = [];
var allCityLOC = [];
var allCityForecast = [];

async function gitData(city) {
    var req = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=dd03e862d2f544419ce191849252804&q=${city}&days=5`, {
        method: 'GET',
        cache: 'no-cache'
    });
    var respon = await req.json();
    allCityCURR = respon.current;
    allCityLOC = respon.location;
    allCityForecast = respon.forecast.forecastday
    // console.log(allCityCURR);
    // console.log(allCityLOC);
    // console.log(respon);
    displayToday();
    
}


function formatDate(dateString) {
    let dateStr = dateString.split(' ')[0]; // "2025-04-29"
    let dateObj = new Date(dateStr);

    let day = dateObj.getDate();
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let month = monthNames[dateObj.getMonth()];
    let dayName = dayNames[dateObj.getDay()];
    let dayNameShort = dayNamesShort[dateObj.getDay()];

    return {
        formattedDate: `${day} ${month}`, // مثال: "29 April"
        dayName: dayName, // مثال: "Tuesday"
        dayNameShort: dayNameShort // مثال: "Tue"
    };
}


function displayToday() {
    let {
        formattedDate,
        dayName,
        dayNameShort
    } = formatDate(allCityLOC.localtime);

    let todayName = formatDate(allCityForecast[0].date).dayNameShort;
    let tomorrowDayName = formatDate(allCityForecast[1].date).dayNameShort;
    let dayAfterTomorrowName = formatDate(allCityForecast[2].date).dayNameShort;
    let thirdDayName = formatDate(allCityForecast[3].date).dayNameShort;

    let box = `  <div class="d-flex justify-content-evenly py-4 px-md-3 day rounded-4  ">
                    <div class="text-white">
                        <h2 class="fw-bold">${dayName}</h2>
                        <h4>${formattedDate}</h4>
                        <div class="d-flex align-items-baseline">
                            <i class="fa-solid fa-location-dot pe-2  fa-lg"></i>
                            <h3>${allCityLOC.name}</h3>
                        </div>
                    </div>
                    <div class="pt-2 ">
                        <div class=" d-flex align-items-center ">
                            <h1>${allCityCURR.temp_c}<sup>o</sup>C</h1>
                        </div>
                        <h5 class="text-center">${allCityCURR.condition.text}</h5>

                    </div>

                </div>

                <div class="px-2 py-4">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex  align-items-baseline">
                            <i class="fa-solid fa-umbrella pe-1"></i>
                            <h4>RAINAS</h4>
                        </div>
                        <h4>${allCityCURR.precip_mm} %</h4>
                    </div>

                    <div class="d-flex justify-content-between">
                        <div class="d-flex  align-items-baseline">
                           <i class="fas fa-tint pe-1"></i>
                            <h4>HUMIDITY</h4>
                        </div>
                    <h4>${allCityCURR.humidity} %</h4>
                    </div>
                    <div class="d-flex justify-content-between ">
                        <div class="d-flex  align-items-center">
                            <i class="fa-solid fa-wind pe-1" style="color: #ffffff;"></i>
                            <h4>WIND</h4>
                        </div>
                        <h4>${allCityCURR.wind_kph} Km/h</h4>
                    </div>
                </div>

                <div class="container">
                    <div class="parant row justify-content-center py-">
                   
                    <div class="col-3 text-center bg-myDarekColor-Tow rounded-2">
                            <img class="w-100" src="${allCityForecast[0].day.condition.icon}" alt="">
                            <h6>${todayName}</h6>
                            <h5 class="fw-bold">${allCityForecast[0].day.maxtemp_c}<sup>o</sup>C</h5>
                            <p>${allCityForecast[0].day.mintemp_c}<sup>o</sup>C</p>
                        </div>

                        <div class="col-3 text-center bg-myDarekColor-Tow rounded-2">
                            <img class="w-100" src="${allCityForecast[1].day.condition.icon}" alt="">
                            <h6>${tomorrowDayName}</h6>
                            <h5 class="fw-bold">${allCityForecast[1].day.maxtemp_c}<sup>o</sup>C</h5>
                            <p>${allCityForecast[1].day.mintemp_c}<sup>o</sup>C</p>
                        </div>

                        <div class="col-3 text-center bg-myDarekColor-Tow rounded-2">
                            <img class="w-100" src="${allCityForecast[2].day.condition.icon}" alt="">
                            <h6>${dayAfterTomorrowName}</h6>
                            <h5 class="fw-bold">${allCityForecast[2].day.maxtemp_c}<sup>o</sup>C</h5>
                            <p>${allCityForecast[2].day.mintemp_c}<sup>o</sup>C</p>
                        </div>

                        <div class="col-3 text-center bg-myDarekColor-Tow rounded-2">
                            <img class="w-100" src="${allCityForecast[3].day.condition.icon}" alt="">
                            <h6>${thirdDayName}</h6>
                            <h5 class="fw-bold">${allCityForecast[3].day.maxtemp_c}<sup>o</sup>C</h5>
                            <p>20<sup>o</sup>C</p>
                        </div>

                       
                    </div>
                </div>`;

    document.querySelector('.allDiv').innerHTML = box;
}


var inputFind = document.getElementById('inputFind');
var btnFind = document.getElementById('btnFind');


btnFind.addEventListener('click', function () {
    var city = inputFind.value.trim();
    if (city !== '') {
        gitData(city);
    }
});

inputFind.addEventListener('keyup', function () {
    var city = inputFind.value.trim();
    gitData(city);

});

gitData('egypt');