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

let chart;

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
    if (chart) {
        dataChart.destroy()
    };
    dataChart = new Chart(divELement, {
        type: "bar", // horizontalBar / pie/ line/ doughnut/ radar/ polarArea
        data: {
            labels: dataObject.countriesNames,
            datasets: [{
                label: REGIONS_COVID_HEADERS_OBJECT[category],
                data: dataObject[category],
                backgroundColor: "pink",
            }],
        },
    })
    chart = true;
}

const chooseCountry = () => {
    console.log(countriesObject[event.target.value])
    

}

// TODO: break to sub functions
const regionClick = () => {
    regionState = event.target.dataset.region;
    creatChart(chartElement, regionsDataObject[event.target.dataset.region])
    TODO: // change the next 4 events
    criticalButton.addEventListener("click", criticalClick)
    confirmedButton.addEventListener("click", confirmedClick)
    deathsButton.addEventListener("click", deathsClick)
    recoveredButton.addEventListener("click", recoveredClick)
    console.log(regionsDataObject[event.target.dataset.region])
    const namesArray = regionsDataObject[event.target.dataset.region].countriesNames;
    const codesArray = regionsDataObject[event.target.dataset.region].countriesCodes;
    countriesSelect.innerHTML = "";
    for (let i = 0; i < namesArray.length; i++){
        const element = document.createElement("option")
        element.value = codesArray[i];
        element.innerText = namesArray[i];
        countriesSelect.appendChild(element);
    }

    countriesSelect.addEventListener("change", chooseCountry)

//TODO: change the color of the selected regionButtons, change the columns color
}

// TODO: //understand why this is not working. and replace 
const categoryClick = () => {
    console.log("in category click regions obj", regionsDataObject)
    console.log("in category click regions obj[region]", regionsDataObject[regionState])
    console.log("in category click regions obj[region].recovered", regionsDataObject[regionState]["recovered"])
    console.log("category", event.target.datasets)
    creatChart(chartElement, regionsDataObject[regionState], event.target.datasets.category)
}

const criticalClick = () => {
    creatChart(chartElement, regionsDataObject[regionState], "critical")
}
const confirmedClick = () => {
    creatChart(chartElement, regionsDataObject[regionState], "confirmed")
}
const deathsClick = () => {
    creatChart(chartElement, regionsDataObject[regionState], "deaths")
}
const recoveredClick = () => {
    creatChart(chartElement, regionsDataObject[regionState], "recovered")
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








const chartElement = document.querySelector("#mainChart");
const regionButtons = document.querySelectorAll(".regions-buttons button");
const categoryButtons = document.querySelectorAll(".category-buttons button");
const criticalButton = document.querySelector(".critical")
const confirmedButton = document.querySelector(".confirmed")
const deathsButton = document.querySelector(".deaths")
const recoveredButton = document.querySelector(".recovered")
const countriesSelect = document.querySelector("#countries")

// regionButtons.forEach((element) => element.addEventListener("click", regionClick))

window.addEventListener("load", getAllData)


// If I want fetch the api on the first click on the page
// const regionClick = (event) => {
//     if (!isFirstClick) {
//         getAllData(urlObject);
//         isFirstClick = true;
//     }
//     regionState = event.target.dataset.region;
// }


// const regionsCovidData = {};

// const creatRegionsCovidDataObject = async () => {
    //     regionsNamesArray.forEach((regionName, index)=>{
        //         let regionKey;
        //         regionName?
        //         regionKey = regionName:
        //         regionKey = "undefined"+index
        //         regionsCovidData [regionKey] =  getRegionData(regionName)
        //     })
        // }