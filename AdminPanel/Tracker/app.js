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

// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0');
// var yyyy = today.getFullYear(); 
// today=dd+mm+yyyy;
// console.log(today);
// document.getElementById('date').innerHTML=dd+"-"+mm+"-"+yyyy;



async function covid(country){
    const res = await fetch(API_URL);
    console.log(res)
    const data = await res.json();
    

    if(res.status === 4 || res.status === 200){
        date.textContent = new Date(data.Date).toDateString();
        

        if(country === '' || country === 'World'){
            const {TotalConfirmed,TotalDeaths,TotalRecovered,NewConfirmed,NewDeaths,NewRecovered} = data.Global;

            confirmed.children[1].textContent = TotalConfirmed;
            confirmed.children[2].textContent=NewConfirmed;
    
            deaths.children[1].textContent = TotalDeaths;
            deaths.children[2].textContent = NewDeaths;
    
            recovered.children[1].textContent = TotalRecovered;
            recovered.children[2].textContent = NewRecovered;
            
            // nameCountry.textContent = item.Country;
        };

       
        data.Countries.forEach(item =>{
            const option = document.createElement('option');
            option.value = item.Country;
            option.textContent = item.Country;
            countries.appendChild(option);

            if(country === item.Country){
                
                confirmed.children[1].textContent = item.TotalConfirmed;
                confirmed.children[2].textContent=item.NewConfirmed;
        
                deaths.children[1].textContent = item.TotalDeaths;
                deaths.children[2].textContent = item.NewDeaths;
        
                recovered.children[1].textContent = item.TotalRecovered;
                recovered.children[2].textContent = item.NewRecovered;
                nameCountry.textContent = item.Country;
                console.log(item.TotalDeaths);
                console.log(item.NewRecovered);
                console.log(country);
        
            }
        })

    }else{
        chart.innerHTML = "Loading.......";
    }
}
covid();

const btnSearch = document.querySelector('button');
btnSearch.addEventListener('click', (e)=>{
    e.preventDefault();
    covid(search.value);
    console.log(search.value);
    search.value = '';
})

