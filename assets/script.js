let loN = 0;
let laT = 0;
let uvReturn;
let call;
let searchNum = localStorage.length;
let months = [
  null,
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Novemeber",
  "December",
];

getAPI();
//Grabs API data
function getAPI() {
  let queryCity = localStorage.getItem("mostRecent");

  let wthrTodayApi =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    queryCity +
    "&units=imperial&appid=b15fbded32e97830c7c19b58cb5acfd0";

  $.ajax({
    url: wthrTodayApi,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    call = response;
    laT = call.city.coord.lat.toString(10);
    loN = call.city.coord.lon.toString(10);

    mainInfo();

    uvFind(laT, loN);
  });
}

//Creates the data to fill main info panel
function mainInfo() {
  name = call.city.name;

  dateIndex = call.list[0].dt_txt.substring(0, 11);
  d = dateIndex.substring(8, 10);
  m = dateIndex.substring(5, 7);
  y = dateIndex.substring(0, 4);
  day = daySuffix(parseInt(d));
  month = monthName(parseInt(m));
  date = `${month} ${day} ${y}`;

  temp = parseInt(call.list[0].main.temp);

  humid = call.list[0].main.humidity;

  wind = parseInt(call.list[0].wind.speed * 2.237);

  let icon = new Image(40, 40);
  icon.src =
    "http://openweathermap.org/img/wn/" +
    call.list[0].weather[0].icon +
    "@2x.png";

  weatherDesc = call.list[0].weather[0].main;
  console.log(name);
  mainTile(name, date, temp, humid, wind, icon, weatherDesc);

  fillForecast();
}
 //Fills the forecast elements with data
function fillForecast() {
  for (let i = 1; i <= 4; i++) {
    dateIndex = call.list[i * 8].dt_txt.substring(0, 11);
    d = dateIndex.substring(8, 10);
    m = dateIndex.substring(5, 7);
    day = daySuffix(parseInt(d));
    month = monthName(parseInt(m));
    date = `${month} ${day}`;
    $("#date-" + i).text(date);

    desc = call.list[i * 8].weather[0].main;
    $("#sky-" + i).text(desc);

    temp = parseInt(call.list[i * 8].main.temp);
    $("#temp-" + i).text("Temp: " + temp + "°F");

    humid = call.list[i * 8].main.humidity;
    $("#humid-" + i).text("Humidity: " + humid + "%");
  }
}

popButtons();
 
 //Creates past search buttons
function popButtons() {
  $(".history").empty();
  for (let i = 0; i <= localStorage.length - 1 && i <= 8; i++) {
    rc = localStorage.getItem("city" + i);
    if (rc) {
      $(".history").append(
        `<button id="btn-${i}" onclick="reSearch(${i})" type='button' class="btn btn-danger histBtn">${rc}</button>`
      );
    }
  }
}

//Gets and fills UvIndex data
function uvFind(a, b) {
  let uvIndex =
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
    a +
    "&lon=" +
    b +
    "&appid=b15fbded32e97830c7c19b58cb5acfd0";

  $.ajax({
    url: uvIndex,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    uvColor = response.value;
    uvAlert(parseInt(uvColor));

    uvReturn = response.value.toString(10);
    uvText = $("#uvIndex");
    uvText.empty();

    uvText.text(uvReturn);
  });
}

//Adds color to signify UV danger levels
function uvAlert(a) {
  if (a >= 3 && a <= 5) {
    $("#uvIndex").css("background-color", "yellow");
  } else if (a >= 6 && a <= 7) {
    $("#uvIndex").css("background-color", "orange");
  } else if (a >= 8 && a <= 10) {
    $("#uvIndex").css("background-color", "red");
  } else if (a >= 11) {
    $("#uvIndex").css("background-color", "violet");
  } else {
    $("#uvIndex").css("background-color", "#10f808");
  }
}

//Adds the proper suffix to day number
function daySuffix(a) {
  if (a === 1 || a === 21 || a === 31) {
    let day = a.toString(10) + "st";
    return day;
  } else if (a === 2 || a === 22) {
    let day = a.toString(10) + "nd";
    return day;
  } else if (a === 3 || a === 23) {
    let day = a.toString(10) + "rd";
    return day;
  } else {
    let day = a.toString(10) + "th";
    return day;
  }
}

//Returns month name for number given
function monthName(a) {
  let month = months[a];
  return month;
}

//Draws in all of the main panel info
function mainTile(a, b, c, d, e, f, g) {
  cityHeader = $("#cityHeader").empty();
  cityHeader.text(a);

  cityDate = $("#cityDate").empty();
  cityDate.text(b);

  temp = $("#temp").empty();
  temp.text(c);

  humid = $("#humid").empty();
  humid.text(d);

  wind = $("#wind").empty();
  wind.text(e);

  desc = $("#desc").empty();
  desc.text(g);

  $("#desc").append(f);
}
 //Stores search locally and refreshes search info and past search buttons
function storSearch(a, b) {
  localStorage.setItem(a + searchNum, b);
  searchNum++;
  localStorage.setItem("mostRecent", b);
  getAPI();
  popButtons();
}
 //Grabs past search and displays it also setting it to most recent search
function reSearch(e) {
  reQuery = localStorage.getItem("city" + e);

  localStorage.setItem("mostRecent", reQuery);
  getAPI();
}
 //Search button listener starts function and prevents null entry
$("#btn-0").click(function () {
  queryCity = $("#queryCity").val();
  if (queryCity) {
    storSearch("city", queryCity);
    $("#queryCity").empty();
  }
  $("#queryCity").empty();
});
