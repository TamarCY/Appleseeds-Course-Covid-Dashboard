

const urlObject = {
    proxy: "https://intense-mesa-62220.herokuapp.com/",
    countryAPI: "https://restcountries.herokuapp.com/api/v1/",
    covidAPI: "https://corona-api.com/countries"
}

const countriesArr = [];

// On the first click in the page gets the data from the api
const getAllData = async (obj) => {
    // const allCovidData = await axios.get(obj.proxy + obj.covidAPI);

    // getCountriesData = 
    // const allCountriesData = await axios.get(obj.proxy + obj.countryAPI);
    const {data} = await axios.get(obj.proxy + obj.countryAPI);
    console.log(data);
    // console.log(allCovidData)
    data.forEach(
        (country) => { countriesArr.push
             ( {
                name: country.name.common,
                code: country.cca2,
                region: country.region
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