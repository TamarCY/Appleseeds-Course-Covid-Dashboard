
COVID_DATA_OBJECT = { confirmed: 0, deaths: 0, critical: 0, recovered: 0, new_recovered: 0, new_deaths: 0}

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

// TODO: let or const?
let covidDataArr = [];

const regionsCovidData = {};

let isFirstClick;

let regionState;

let temp;



// Fetch countries data
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
    console.log(data)
    return data

}

// Fetch covid data
const getCovidData = async (obj) => {
    const { data: { data } } = await axios.get(obj.proxy + obj.covidAPI);
    console.log(data)
    data.forEach((country) => {
        countriesObject[country.code].covidData = country.latest_data;
        countriesObject[country.code].covidData.new_deaths = country.today.deaths;    
        countriesObject[country.code].covidData.new_confirmed = country.today.confirmed;    

    })
    console.log(countriesObject)
}

// TODO: check if to change to Object.values method
const objectToArray = () => {
    const result = Object.keys(countriesObject).map(function (key) {
        return countriesObject[key];
    })
    return result;
}


// Create array of all the regions names
const getRegionsNames = async () => {
    console.log(covidDataArr)
    const result = covidDataArr.reduce((previousValue, currentValue) => {
        if (!(previousValue.includes(currentValue.region))) {
            previousValue.push(currentValue.region)
        }
        return previousValue
    }, []);
    return result
}



// Gets a region name and returns an object with all the regions countries data  
const getRegionData = async (selectedRegion) => {
    const regionData = covidDataArr.filter((country) => ((country.region === selectedRegion)));
    const countriesNames = regionData.map(country => country.name);
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
        countriesNames: countriesNames,
        countriesDeaths: countriesDeaths,
        countriesConfirmed: countriesConfirmed,
        countriesCritical: countriesCritical,
        countriesRecovered: countriesRecovered,
        countriesNewDeaths: countriesNewDeaths,
        countriesNewConfirmed: countriesNewConfirmed
    }
    return regionObject
}


// ---------------- THE MAIN FUNCTION ----------------------------//


// On the first click in the page gets the data from the api
const getAllData = async (obj) => {
    await getCountriesData(obj)
    await getCovidData(obj)
}

    covidDataArr = objectToArray();
    const regionsNamesArray = await getRegionsNames();

// TODO: change this to an object or  something dynamic or store in local storage or sub function 
    const asiaDataObject =  await getRegionData("Asia");
    const europeDataObject =  await getRegionData("Europe");
    const africaDataObject =  await getRegionData("Africa");
    const americasDataObject =  await getRegionData("Americas");
            
    const tempOneRejObj =  await getRegionData(regionsNamesArray[0]);
    creatChart(chartElement,tempOneRejObj,"countriesNewConfirmed")

     temp =  countriesObject.IL.covidData.deaths; 
}

// ------------------------------------------------------------------//

const chartElement = document.querySelector("#mainChart");





const creatChart = (divELement, dataObject, category) => {
    console.log(dataObject)
    const dataChart = new Chart(divELement, {
        //TODO: media query for small screens - change to horizontal bar 
        type: "bar", // horizontalBar / pie/ line/ doughnut/ radar/ polarArea
        data: {
            labels: dataObject.countriesNames,
            datasets: [{
                // TODO: change to object of category names
                label: REGIONS_COVID_HEADERS_OBJECT[category],
                data: dataObject[category],
                backgroundColor: "pink",
               
            }],
        },
    })
}


// const foo = async () => {
//     const res = await getAllData(urlObject);
//     console.log(res)
// }



const regionClick = (event) => {
    if (!isFirstClick) {
        getAllData(urlObject);
        isFirstClick = true;
    }
    regionState = event.target.dataset.region;
}

// NEW CODE FROM HERE:

window.addEventListener("load", getAllData)




const regionButtons = document.querySelectorAll(".regions-buttons button");
regionButtons.forEach((element) => element.addEventListener("click", regionClick))





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