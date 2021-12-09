

const urlObject = {
    proxy: "https://intense-mesa-62220.herokuapp.com/",
    countryAPI: "https://restcountries.herokuapp.com/api/v1/",
    covidAPI: "https://corona-api.com/countries"
}

const countriesArr = [];

// On the first click in the page gets the data from the api
const getAllData = async (obj) => {
    // const allCovidData = await axios.get(obj.proxy + obj.covidAPI);
    const allCountriesData = await axios.get(obj.proxy + obj.countryAPI);
    console.log(allCountriesData);
    // console.log(allCovidData)
     allCountriesData.data.forEach(
        (e) => { countriesArr.push
             ( {
                name: e.name.common,
                code: e.cca2,
                region: e.region
            }
             )

        })
}


getAllData(urlObject);
console.log (countriesArr)

countriesObject = {
    Asia: [
        {
            name: "",
            code: ""
        }],


}





let isFirstClick;

const firstClick = () => {
    if (!firstClick) {
        getAllData();
        firstClick = true;
    }
}


const buttons = document.querySelectorAll(".button");
buttons.forEach((element) => element.addEventListener("click", firstClick))