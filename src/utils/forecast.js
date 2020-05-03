const request = require("request")

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=43cb98cf4cfab1e5ec14c6615e208cfb&query=" +
    latitude +
    "," +
    longitude +
    " &units=f"

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather services", undefined)
    } else if (body.error) {
      callback("Unable to find location, try another search!", undefined)
    } else {
      callback(
        undefined,
        `Currently, ${body.location.name} is ${body.current.weather_descriptions[0]}, It feels like ${body.current.feelslike}\xB0, Temperature is ${body.current.temperature}\xB0,  ${body.current.precip}% chance of precipitation, the wind direction is ${body.current.wind_dir} at ${body.current.wind_speed} mph.`
      )
    }
  })
}

module.exports = forecast
