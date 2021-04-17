//模拟天气预报api返回结果

//api : http://api.openweathermap.org/data/2.5/weather?q=Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&appid=743a5c4f5fe18db9855cb2ee94f003c6&units=metric

const offlineWeather = [{
    "coord": {
        "lon": 106.6667,
        "lat": 10.75
    },
    "weather": [
        {
            "id": 803,
            "main": "Clouds",
            "description": "broken clouds",
            "icon": "04d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 25,
        "feels_like": 34.1,
        "temp_min": 25, //nhiet do
        "temp_max": 30, //nhiet do 
        "pressure": 1007,
        "humidity": 66
    },
    "visibility": 9000,
    "wind": {
        "speed": 0.51,
        "deg": 0
    },
    "clouds": {
        "all": 75
    },
    "dt": 1617872383,
    "sys": {
        "type": 1,
        "id": 9314,
        "country": "VN",
        "sunrise": 1617835568,
        "sunset": 1617879834
    },
    "timezone": 25200,
    "id": 1566083,
    "name": "Ho Chi Minh City",
    "cod": 200
},
{
    "coord": {
        "lon": 106.6667,
        "lat": 10.75
    },
    "weather": [
        {
            "id": 803,
            "main": "Clouds",
            "description": "few clouds",
            "icon": "02d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 17,
        "feels_like": 34.1,
        "temp_min": 13, //nhiet do
        "temp_max": 17, //nhiet do 
        "pressure": 1007,
        "humidity": 66
    },
    "visibility": 9000,
    "wind": {
        "speed": 0.51,
        "deg": 0
    },
    "clouds": {
        "all": 75
    },
    "dt": 1617872383,
    "sys": {
        "type": 1,
        "id": 9314,
        "country": "VN",
        "sunrise": 1617835568,
        "sunset": 1617879834
    },
    "timezone": 25200,
    "id": 1566083,
    "name": "Ho Chi Minh City",
    "cod": 200
},
{
    "coord": {
        "lon": 106.6667,
        "lat": 10.75
    },
    "weather": [
        {
            "id": 803,
            "main": "Snow",
            "description": "Snow",
            "icon": "13d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 3,
        "feels_like": 34.1,
        "temp_min": -3, //nhiet do
        "temp_max": 7, //nhiet do 
        "pressure": 1007,
        "humidity": 66
    },
    "visibility": 9000,
    "wind": {
        "speed": 0.51,
        "deg": 0
    },
    "clouds": {
        "all": 75
    },
    "dt": 1617872383,
    "sys": {
        "type": 1,
        "id": 9314,
        "country": "VN",
        "sunrise": 1617835568,
        "sunset": 1617879834
    },
    "timezone": 25200,
    "id": 1566083,
    "name": "Ho Chi Minh City",
    "cod": 200
},
{
    "coord": {
        "lon": 106.6667,
        "lat": 10.75
    },
    "weather": [
        {
            "id": 803,
            "main": "rain",
            "description": "rain",
            "icon": "10d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 23,
        "feels_like": 34.1,
        "temp_min": 23, //nhiet do
        "temp_max": 30, //nhiet do 
        "pressure": 1007,
        "humidity": 66
    },
    "visibility": 9000,
    "wind": {
        "speed": 0.51,
        "deg": 0
    },
    "clouds": {
        "all": 75
    },
    "dt": 1617872383,
    "sys": {
        "type": 1,
        "id": 9314,
        "country": "VN",
        "sunrise": 1617835568,
        "sunset": 1617879834
    },
    "timezone": 25200,
    "id": 1566083,
    "name": "Ho Chi Minh City",
    "cod": 200
},
{
    "coord": {
        "lon": 106.6667,
        "lat": 10.75
    },
    "weather": [
        {
            "id": 803,
            "main": "clear sky",
            "description": "clear sky",
            "icon": "01d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 30,
        "feels_like": 34.1,
        "temp_min": 30, //nhiet do
        "temp_max": 30, //nhiet do 
        "pressure": 1007,
        "humidity": 66
    },
    "visibility": 9000,
    "wind": {
        "speed": 0.51,
        "deg": 0
    },
    "clouds": {
        "all": 75
    },
    "dt": 1617872383,
    "sys": {
        "type": 1,
        "id": 9314,
        "country": "VN",
        "sunrise": 1617835568,
        "sunset": 1617879834
    },
    "timezone": 25200,
    "id": 1566083,
    "name": "Ho Chi Minh City",
    "cod": 200
}]

export default offlineWeather;