const countries = document.querySelector('datalist');
const search = document.querySelector('#srch');
const date = document.querySelector('#date');
const nameCountry = document.querySelector('#name-country');
const confirmed = document.querySelector('.confirmed');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.chart');

let dataChart = [];

const API_URL = "https://api.covid19api.com/summary";
const latlon_api = 'https://www.trackcorona.live/api/countries'

// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0');
// var yyyy = today.getFullYear(); 
// today=dd+mm+yyyy;
// console.log(today);
// document.getElementById('date').innerHTML=dd+"-"+mm+"-"+yyyy;



async function covid(country) {
    const res = await fetch(API_URL);
    // console.log(res)
    const data = await res.json();


    const latlon = await fetch(latlon_api);
    // console.log(latlon)
    const latlondata = await latlon.json();
    console.log(latlondata.data);

    if (res.status === 4 || res.status === 200) {
        date.textContent = new Date(data.Date).toDateString();

        // console.log(res);
        if (country === '' || country === 'World') {
            const { TotalConfirmed, TotalDeaths, TotalRecovered, NewConfirmed, NewDeaths, NewRecovered } = data.Global;

            confirmed.children[1].textContent = TotalConfirmed;
            confirmed.children[2].textContent = NewConfirmed;

            deaths.children[1].textContent = TotalDeaths;
            deaths.children[2].textContent = NewDeaths;

            recovered.children[1].textContent = TotalRecovered;
            recovered.children[2].textContent = NewRecovered;

            // console.log(TotalConfirmed)

            drawChart(TotalConfirmed, TotalDeaths, TotalRecovered)


            // nameCountry.textContent = item.Country;
        };


        data.Countries.forEach(item => {
            const option = document.createElement('option');
            option.value = item.Country;
            option.textContent = item.Country;
            countries.appendChild(option);


            const { location, latitude, longitude } = latlondata.data
            if (country === item.Country || country === location) {

                console.log(location);
                console.log(latitude);

                confirmed.children[1].textContent = item.TotalConfirmed;
                confirmed.children[2].textContent = item.NewConfirmed;

                deaths.children[1].textContent = item.TotalDeaths;
                deaths.children[2].textContent = item.NewDeaths;

                recovered.children[1].textContent = item.TotalRecovered;
                recovered.children[2].textContent = item.NewRecovered;
                // nameCountry.textContent = item.Country;
                // console.log(item.TotalDeaths);
                // console.log(item.NewRecovered);
                // console.log(country);



                var ctx = document.getElementById("myPieChart");
                var myPieChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ["Conformed", "Deaths", "Recovered"],
                        datasets: [{
                            data: [item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered],
                            backgroundColor: ['crimson', 'black', '#1CC88A'],
                            hoverBackgroundColor: ['#9a0e2a', 'black', '#0b573c'],
                            hoverBorderColor: "rgba(234, 236, 244, 1)",
                        }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        tooltips: {
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "#858796",
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            caretPadding: 10,
                        },
                        legend: {
                            display: false
                        },
                        cutoutPercentage: 80,
                    },
                });

            }
        })

    } else {
        chart.innerHTML = "Loading.......";
    }
}
covid();

const btnSearch = document.getElementById('button');
btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    covid(search.value);
    console.log(search.value);
    search.value = '';
})




// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
function drawChart(TotalConfirmed, TotalDeaths, TotalRecovered) {
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Conformed", "Deaths", "Recovered"],
            datasets: [{
                data: [TotalConfirmed, TotalDeaths, TotalRecovered],
                backgroundColor: ['crimson', 'black', '#1CC88A'],
                hoverBackgroundColor: ['#9a0e2a', 'black', '#0b573c'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}


// var map = L.map('mapid').setView([51.505, -0.09], 13);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();









// google.charts.load('current', { 'packages': ['corechart'] });
// google.charts.setOnLoadCallback(drawChart);

// function drawChart(TotalConfirmed, TotalDeaths, TotalRecovered) {

//     var data = google.visualization.arrayToDataTable([
//         ['Task', 'Hours per Day'],
//         ['Conformed', TotalConfirmed],
//         ['Deaths', TotalDeaths],
//         ['Recovered', TotalRecovered],
//         // ['Watch TV', 2],
//         // ['Sleep', 7]
//     ]);

//     var options = {
//         title: 'My Daily Activities',
//         is3D: true,

//         colors: ['crimson', 'black', '#1CC88A']
//     };

//     var chart = new google.visualization.PieChart(document.getElementById('bargraph'));

//     chart.draw(data, options);
// }
/*crimson confirmed
 death black recoverd green*/



