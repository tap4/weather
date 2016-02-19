'use strict';

var weatherData = (function() {

  var results;
  var citySelected;
  var colorScheme = ['CornflowerBlue', 'NavyBlue', 'BlueJay',
                     'MarbleBlue', 'SlateGray', 'JetGray',
                     'BlueGray', 'Platinum', 'PinkBubblegum',
                     'LightPink', 'PinkDaisy', 'BlushRed',
                     'VioletRed', 'PinkLemonade', 'DimorphothecaMagenta'];

  //Input: c = CloudCoverData
  //Output: Best cloudImage to represent the day
  function pickCloudImage(c){
    var cloudPath;
    if (c<=33){cloudPath='./img/cloud0.png';}
    if (c>33 && c<=66){cloudPath='./img/cloud1.png';}
    if (c>66) {cloudPath='./img/cloud2.png';}
    return cloudPath;
  }

  //Input: t=TempData
  //Output: Best PrecipImage to represent the day
  function pickPrecipImage(t){
    var precipPath;
    if (t>0){precipPath='./img/rainCloud.png';}
    else {precipPath='./img/snowCloud.png';}
    return precipPath;
  }

  //Input: t = Temp Data
  //Output: Best TempImage to represent the day
  function pickTempImage(t){
    var tempPath;
    if (t<=0){
      tempPath='./img/temp0.png';}
    if (t>0 && t<=10){tempPath='./img/temp1.png';}
    if (t>10  && t<=20) {tempPath='./img/temp2.png';}
    if (t>20) {tempPath='./img/temp3.png';}
    return tempPath;
  }

  //ColorScheme is a set of 15 color options. We will assume a typical temp
  //will be between -40 and +40. Temp range is divided into sub-ranges of 5
  //degrees.  Each subrange is assigned a color option, taken from the
  //colorScheme array.
  function chooseTempColor(t){
    var color;
    var tempCode = (t+40)/5;
    //Safeguard against extreme temps...
    if (tempCode<0) {tempCode=0;}
    if (tempCode>14) {tempCode=14;}
    color = colorScheme[tempCode];
    return color;
  }

  //Input: days = # of Days requested by User
  //Output: One Panel for each day requested
  function createPanel(days) {

    $('#weatherpanels').html('');
    var j;
    var indices=[0,24,48,64,72,80,86,90];
    var yesterday=0;

    //---Create our Legend for City Selected -----------------------
      var legend= document.createElement('legend');
      var cityName=getCitySelection()[1];
    
      var cityNode = document.createTextNode('Your ' + days + '-day forecast for ' + cityName + ':');
      legend.appendChild(cityNode);
      $('#weatherpanels').prepend(legend);
    //---------------------------------------------------------------

    for (var i=0; i<days;i++)
    {
      j=indices[i];

      //--Safeguard to make sure we are iterating thru days correctly--------
      var dateArray=(results[0].forecast[j].ftime).split(' ');
      var dateText=dateArray[0];
      dateText=dateText.slice(5);
      var month=dateText.slice(0,2);
      var day=dateText.slice(3);
      dateText= day + '/' + month;

      while (dateText === yesterday)
      {
        j=j+1;
        dateArray=(results[0].forecast[j].ftime).split(' ');
        dateText=dateArray[0];
        dateText=dateText.slice(5);
        month=dateText.slice(0,2);
        day=dateText.slice(3);
        dateText= day + '/' + month;
      }
      if (i===0){dateText='Today';}
      if (i===1){dateText='Tomorrow';}
      //------------------------------------------------------------------


      //-----Access to checkboxes...what does User want to see? -----------
      var tempRequested =document.getElementById('tempCheckBox');
      var cloudRequested = document.getElementById('cloudCheckBox');
      var windRequested = document.getElementById('windCheckBox');
      var precipRequested = document.getElementById('precipCheckBox');
      //------------------------------------------------------------------


      //----Initialize the new HTML elements--------------------------------
      var panel = document.createElement( 'div' );
      $(panel).addClass('panel panel-info col-md-2');
      var heading=document.createElement('div');
      $(heading).addClass('panel-heading');
      var title=document.createElement('h3');
      $(title).addClass('panel-title');
      var body=document.createElement('div');
      $(body).addClass('panel-body');
     //------------------------------------------------------------------


      //------Create our text/data variables-----------------------------------
      var date = document.createTextNode(dateText);
      var cloudText = results[0].forecast[j].N;
      var tempText = results[0].forecast[j].T;
      var windText = results[0].forecast[j].F;
      var precipText = results[0].forecast[j].R;
      var htmlBreak1 =document.createElement('br');
      var htmlBreak2 =document.createElement('br');
      var htmlBreak3 =document.createElement('br');
      var htmlBreak4 =document.createElement('br');
      var cloudNode = document.createTextNode('Cloud: ' + cloudText +'%');
      var tempNode = document.createTextNode('Temp: ' + tempText + '°' + ' C');
      var windNode = document.createTextNode('Wind Speed: ' + windText + ' m/s');
      var precipNode = document.createTextNode('Prec: ' + precipText + ' mm/h');
    //------------------------------------------------------------------


      //--Create our image variables-----------------------------------
      var cloudImageElement = document.createElement('img');
      cloudImageElement.src = pickCloudImage(cloudText);
      var tempImageElement = document.createElement('img');
      tempImageElement.src = pickTempImage(tempText);
      var precipImageElement = document.createElement('img');
      //------------------------------------------------------------------


      //-Build our basic daily Weather panel--------------------------
      title.appendChild(date);
      heading.appendChild(title);
      panel.appendChild(heading);
      panel.appendChild(body);
      //------------------------------------------------------------------


      //--Set the color of the panel----------------------
      var panelColor = chooseTempColor(tempText);
      panel.style.border = '2px solid ' + panelColor;
      panel.style.border = '1px solid ' + panelColor;
      heading.style.background = panelColor;
      //------------------------------------------------------------------

      //--If User wants to see Temperature-------------------------------
      if (tempRequested.checked){
        body.appendChild(tempNode);
        body.appendChild(htmlBreak1);
        panel.appendChild(tempImageElement);}
      //-------------------------------------------------------


      //--Add our optional image (for frost)---------------
      if (tempText<=0)
        {
          var frostImageElement = document.createElement('img');
          frostImageElement.src = './img/frost.png';
          panel.appendChild(frostImageElement);}
      //------------------------------------------------------------------


      //--If User wants to see Cloud Cover-------------------------------
      if (cloudRequested.checked){
        body.appendChild(cloudNode);
        body.appendChild(htmlBreak2);
        panel.appendChild(cloudImageElement);}
      //------------------------------------------------------------------


      //--If User wants to see Wind Speed-------------------------------
      if (windRequested.checked){
        body.appendChild(windNode);
        body.appendChild(htmlBreak3);}
      //------------------------------------------------------------------


      //--If User wants to see Precipitation-------------------------------
      if (precipRequested.checked){
        body.appendChild(precipNode);
        body.appendChild(htmlBreak4);
        if (precipText>0.5){
            precipImageElement.src=pickPrecipImage(tempText);
            console.log(precipImageElement);
            panel.appendChild(precipImageElement);}}
      //------------------------------------------------------------------


      $('#weatherpanels').append(panel);
      yesterday= dateText;

    }
  }

  //This function returns the numeric data-source value for
  //the user's selected city. We need this to query Apis.
  function getCitySelection() {
    var cityCheckBoxes = document.getElementsByName('city');
    var cityValue=1;
    var cityID="Reyk";
    for (var i=0; i < cityCheckBoxes.length; i++){
      if (cityCheckBoxes[i].checked){
        cityValue=cityCheckBoxes[i].value;
        cityID=cityCheckBoxes[i].id;
      }
    }
    var city = [cityValue,cityID];
    return city;
  }

  function getData(source, days) {
    $.ajax({
      url: 'http://apis.is/weather/forecasts/en',
      data: {'stations': source},
      success: function(data) {
        results = data.results;
        createPanel(days);
      }
    });
  }

  function init() {
    $('#submitButton').click(function() {
      var days=$('#days option:selected').text();
      var citySource = getCitySelection()[0];
      citySelected=citySource;
      getData(citySource,days);
    });
    getData();
  }
  return {
    init: init
  };

})();

weatherData.init();
