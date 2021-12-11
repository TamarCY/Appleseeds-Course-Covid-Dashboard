// ------------------- GLOBAL VARIABLES ------------------------------//
COVID_DATA_OBJECT = { confirmed: 0, deaths: 0, critical: 0, recovered: 0, new_recovered: 0, new_deaths: 0 }

REGIONS_COVID_HEADERS_OBJECT = {
    countriesDeaths: "Number of Deaths",
    countriesConfirmed: "Confirmed Cases",
    countriesCritical: "Number of critical condition",
    countriesRecovered: "Number of recovered"
}
COUNTRY_COVID_HEADERS_OBJECT = {
    countriesConfirmed: "Total cases",
    countriesNewCases: "New cases",
    countriesDeaths: "Total deaths",
    countriesNewDeaths: "New deaths",
    countriesRecovered: "Total recovered",
    countriesCritical: "In critical condition"
}

const urlObject = {
    proxy: "https://intense-mesa-62220.herokuapp.com/",
    countryAPI: "https://restcountries.herokuapp.com/api/v1/",
    covidAPI: "https://corona-api.com/countries"
}


const countriesObject = {};

let covidDataArr = [];

const regionsCovidData = {};

let isFirstClick;

let regionState;

let displayedRegion;

let categoryState;

let chart;

let dataChart;

let selectedCountryObject;

// Contains object for each regin, in each object there are arrays for all the region's category of data
const regionsDataObject = {
}

// -------------------------------------------------------------------//


// Fetch for countries data
const getCountriesData = async (obj) => {
    const { data } = await axios.get(obj.proxy + obj.countryAPI);
    data.forEach(
        (country) => {
            countriesObject[country.cca2] = {
                name: country.name.common,
                region: country.region,
                code: country.cca2
            }
        }
    )
    return data

}

// Fetch for covid data
const getCovidData = async (obj) => {
    const { data: { data } } = await axios.get(obj.proxy + obj.covidAPI);
    data.forEach((country) => {
        countriesObject[country.code].covidData = country.latest_data;
        countriesObject[country.code].covidData.new_deaths = country.today.deaths;
        countriesObject[country.code].covidData.new_confirmed = country.today.confirmed;

    })
}


// Convert the object to an array
// TODO: check if to change to Object.values method
const objectToArray = () => {
    const result = Object.keys(countriesObject).map(function (key) {
        return countriesObject[key];
    })
    return result;
}


// Create array of all the regions names
const getRegionsNames = async () => {
    const result = covidDataArr.reduce((previousValue, currentValue) => {
        if (!(previousValue.includes(currentValue.region))) {
            previousValue.push(currentValue.region)
        }
        return previousValue
    }, []);
    return result
}

const creatChart = (divELement, dataObject, category = "confirmed") => {
    chartDivElement.style.display = "block"
    if (chart) {
        dataChart.destroy()
    };
    dataChart = new Chart(divELement, {
        type: "bar", 
        data: {
            labels: dataObject.countriesNames,
            datasets: [{
                label: REGIONS_COVID_HEADERS_OBJECT[category],
                data: dataObject[category],
                backgroundColor: "#A45D5D",
            }],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                    
                }
            }
        }
    })
    chart = true;
}

const chooseCountry = () => {
    chartElement.style.display.none;
    selectedCountryObject = countriesObject[event.target.value]
    countryConfirmed.innerText = selectedCountryObject.covidData.confirmed
    countryNewConfirmed.innerText = selectedCountryObject.covidData.new_confirmed
    countryDeaths.innerText = selectedCountryObject.covidData.deaths
    countryNewDeaths.innerText = selectedCountryObject.covidData.new_deaths
    countryRecovered.innerText = selectedCountryObject.covidData.recovered
    countryCritical.innerText = selectedCountryObject.covidData.critical
    countriesData.style.display = "flex";
    dataChart.destroy();
    chart = false;
    categoryHeaderElement.style.display = "none";
    countryHeaderElement.innerText = selectedCountryObject.name;
    countryHeaderElement.style.display = "block";

    

    
}

// TODO: break to sub functions
const regionClick = () => {
    regionState = event.target.dataset.region;
    displayedRegion = regionState.charAt(0).toUpperCase() + regionState.slice(1)
    

    creatChart(chartElement, regionsDataObject[event.target.dataset.region])
    TODO: // change the next 4 events
    criticalButton.addEventListener("click", criticalClick)
    confirmedButton.addEventListener("click", confirmedClick)
    deathsButton.addEventListener("click", deathsClick)
    recoveredButton.addEventListener("click", recoveredClick)
    const namesArray = regionsDataObject[event.target.dataset.region].countriesNames;
    const codesArray = regionsDataObject[event.target.dataset.region].countriesCodes;
    countriesSelect.innerHTML = '<option selected="true" disabled="disabled">Choose country</option>';
    
    for (let i = 0; i < namesArray.length; i++){
        const element = document.createElement("option")
        element.value = codesArray[i];
        element.innerText = namesArray[i];
        countriesSelect.appendChild(element);
    }

    // Displays
    countryHeaderElement.style.display = "none";
    categoryHeaderElement.style.display = "block";
    countriesData.style.display = "none";
    regionHeaderElement.innerText = displayedRegion;
    categoryHeaderElement.innerText = "Confirmed"
    countriesSelect.style.display = "block";
    countriesSelect.addEventListener("change", chooseCountry);

}

// TODO: //understand why this is not working. and replace the 4 click functions 
const categoryClick = () => {
    console.log("in category click regions obj", regionsDataObject)
    console.log("in category click regions obj[region]", regionsDataObject[regionState])
    console.log("in category click regions obj[region].recovered", regionsDataObject[regionState]["recovered"])
    console.log("category", event.target.datasets)
    creatChart(chartElement, regionsDataObject[regionState], event.target.datasets.category)
}

const criticalClick = () => {
    countriesData.style.display = "none";
    countryHeaderElement.style.display = "none";
    creatChart(chartElement, regionsDataObject[regionState], "critical")
    categoryHeaderElement.display = "block"
    categoryHeaderElement.innerText = "Critical"

}
const confirmedClick = () => {
    countriesData.style.display = "none";
    countryHeaderElement.style.display = "none";
    creatChart(chartElement, regionsDataObject[regionState], "confirmed")
    categoryHeaderElement.style.display = "block"
    categoryHeaderElement.innerText = "Confirmed"


}
const deathsClick = () => {
    categoryHeaderElement.style.display = "block";
    countriesData.style.display = "none";
    countryHeaderElement.style.display = "none";
    creatChart(chartElement, regionsDataObject[regionState], "deaths")
    categoryHeaderElement.innerText = "Deaths"


}
const recoveredClick = () => {
    countriesData.style.display = "none";
    countryHeaderElement.style.display = "none";
    creatChart(chartElement, regionsDataObject[regionState], "recovered")
    categoryHeaderElement.style.display = "block"
    categoryHeaderElement.innerText = "Recovered"


}

// Gets a region name and returns an object with all the region's countries data  
const getRegionData = async (selectedRegion) => {
    const regionData = covidDataArr.filter((country) => ((country.region === selectedRegion)));
    const countriesNames = regionData.map(country => country.name);
    const countriesCodes = regionData.map(country => country.code);
    const countriesCovidData = regionData.map(country => {
        return country.covidData ? country.covidData : COVID_DATA_OBJECT
    });
    // TODO: change to DRY - maybe with a class? how can i make it easy to change when i want to present different data
    const countriesDeaths = countriesCovidData.map(x => x.deaths);
    const countriesConfirmed = countriesCovidData.map(x => x.confirmed)
    const countriesCritical = countriesCovidData.map(x => x.critical)
    const countriesRecovered = countriesCovidData.map(x => x.recovered)
    const countriesNewDeaths = countriesCovidData.map(x => x.new_recovered)
    const countriesNewConfirmed = countriesCovidData.map(x => x.new_deaths)
    

    
    const regionObject = {
        region: selectedRegion,
        countriesCodes: countriesCodes,
        countriesNames: countriesNames,
        deaths: countriesDeaths,
        confirmed: countriesConfirmed,
        critical: countriesCritical,
        recovered: countriesRecovered,
        newDeaths: countriesNewDeaths,
        newConfirmed: countriesNewConfirmed
    }
    return regionObject
}



// ---------------- THE MAIN FUNCTION ----------------------------//


const getAllData = async (obj) => {
    await getCountriesData(urlObject)
    await getCovidData(urlObject)
    covidDataArr = objectToArray();
    const regionsNamesArray = await getRegionsNames();

    // TODO: change this to an object or  something dynamic or store in local storage or sub function 
    regionsDataObject.asia = await getRegionData("Asia");
    regionsDataObject.europe = await getRegionData("Europe");
    regionsDataObject.africa = await getRegionData("Africa");
    regionsDataObject.americas = await getRegionData("Americas");

    // categoryButtons.forEach((element) => element.addEventListener("click", categoryClick))
    regionButtons.forEach((element) => element.addEventListener("click", regionClick))

}
// ------------------------------------------------------------------//







const chartDivElement = document.querySelector(".chart")
const chartElement = document.querySelector("#main-chart");
const regionButtons = document.querySelectorAll(".regions-buttons button");
const categoryButtons = document.querySelectorAll(".category-buttons button");
const categoryButtonsElement = document.querySelectorAll(".category-buttons");
const criticalButton = document.querySelector(".critical")
const confirmedButton = document.querySelector(".confirmed")
const deathsButton = document.querySelector(".deaths")
const recoveredButton = document.querySelector(".recovered")
const countriesSelect = document.querySelector("#countries")
const countriesData = document.querySelector(".country-data")
const countryConfirmed = document.querySelector(".country-confirmed span")
const countryNewConfirmed = document.querySelector(".country-new-confirmed span")
const countryDeaths = document.querySelector(".country-deaths span")
const countryNewDeaths = document.querySelector(".country-new-deaths span")
const countryRecovered = document.querySelector(".country-recovered span")
const countryCritical = document.querySelector(".country-critical span")
const regionHeaderElement = document.querySelector(".region-header")
const categoryHeaderElement = document.querySelector(".category-header")
const countryHeaderElement = document.querySelector(".country-header")
const optionElement = document.querySelector("#countries option")

window.addEventListener("load", getAllData)



