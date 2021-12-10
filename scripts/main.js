

const urlObject = {
    proxy: "https://intense-mesa-62220.herokuapp.com/",
    countryAPI: "https://restcountries.herokuapp.com/api/v1/",
    covidAPI: "https://corona-api.com/countries"
}

const countriesObject = {};
let covidDataArr = [];

COVID_DATA_OBJECT = { confirmed: 0, deaths: 0, critical: 0, recovered: 0 }


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

}

const getCovidData = async (obj) => {
    const { data: { data } } = await axios.get(obj.proxy + obj.covidAPI);

    data.forEach((country) => {
        countriesObject[country.code].covidData = country.latest_data;

    })
}


const objectToArray = () => {
    const result = Object.keys(countriesObject).map(function (key) {
        return countriesObject[key];
    })
    return result;
}


// On the first click in the page gets the data from the api
const getAllData = async (obj) => {
    await getCountriesData(obj)
    await getCovidData(obj)
    covidDataArr = await objectToArray();
    const europeData = await getRegionData("Europe");
    await getRegions();
}


// TODO: creat an array of region names
const getRegions = async () => {
    console.log(covidDataArr)
    const result = covidDataArr.reduce((previousValue, currentValue) => {
        if (!(previousValue.includes(currentValue.region))){
            previousValue.push(currentValue.region)
        }
         return previousValue
    }, []);
    console.log(result)
}




const getRegionData = async (selectedRegion) => {
    const regionData = covidDataArr.filter((country) => ((country.region === selectedRegion)));
    const countriesNames = regionData.map(country => country.name);
    const countriesCovidData = regionData.map(country => {
        return country.covidData ? country.covidData : COVID_DATA_OBJECT
    });
    // TODO: change to DRY - maybe with a class?
    const countriesDeaths = countriesCovidData.map(x => x.deaths);
    const countriesConfirmed = countriesCovidData.map(x => x.confirmed)
    const countriesCritical = countriesCovidData.map(x => x.critical)
    const countriesRecovered = countriesCovidData.map(x => x.recovered)
    const regionObject = {
        countriesNames: countriesNames,
        countriesDeaths: countriesDeaths,
        countriesConfirmed: countriesConfirmed,
        countriesCritical: countriesCritical,
        countriesRecovered: countriesRecovered
    }
    return regionObject

}


 



getAllData(urlObject);




let isFirstClick;

const firstClick = () => {
    if (!firstClick) {
        getAllData();
        firstClick = true;
    }
}


const buttons = document.querySelectorAll(".button");
buttons.forEach((element) => element.addEventListener("click", firstClick))