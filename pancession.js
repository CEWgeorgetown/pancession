var edCats = ["High school or less", "Some college", "Associate's degree", "Bachelor's degree or higher"];
var sexCats = ["Male", "Female"];
var raceCats = ["White", "Black/African-American", "Hispanic", "Other"];
Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  }
})
function drawChart(div, xaxis, cdata, chartitle="", chartsubtitle="") {
  Highcharts.chart(div, {
    chart: {
      style: {
        fontFamily: "'Open Sans', 'PT Serif Caption'"
      }
    },
    accessibility: {
        description: 'Image description: A chart that shows the percentage employed and working full time'
    },
    title: {
      text: chartitle
    },
    subtitle: {
      text: chartsubtitle
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: xaxis
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
        enabled: true
      }
    },
    tooltip: {
      // formatter: function() {
      //   }
      valueDecimals: 1,
      valueSuffix: " %",
      shared: true
    },
    plotOptions: {
    },
    legend: {
      enabled: true
    },

    series: cdata
  });
}

// function getChartObj (obj) {
//   var chartRawData = obj;
//   var xaxis = chartRawData.map((obj,i) => {
//     return obj.period;
//   });
//   var ePop = chartRawData.map((obj, i) => {
//     return {x: i,
//       y: Math.round(obj.epop*10000)/100
//     }
//   });
//   var pctFT = chartRawData.map((obj, i) => {
//     return {x: i,
//       y: Math.round(obj.pctFT*10000)/100
//     };
//   });
//   return [xaxis, ePop, pctFT];
// }

function getChartData (array) {
  var epopSeries = [];
  var ftSeries = [];
  for (var i = 0; i < array.length; i++) {
    var epopObj = {name: null, data: null, cat1: null, cat2: null, category: "Epop"};
    var ftObj = {name: null, data: null, cat1: null, cat2: null, category: "pctft"};
    var chartRawData = array[i];
    var xaxis = array[0].data.map((obj,i) => {
      return obj.period;
    });
    epopObj.cat1 = chartRawData.cat1;
    epopObj.cat2 = chartRawData.cat2;
    epopObj.name = chartRawData.category;
    epopObj.data = chartRawData.data.map((obj, i) => {
      return {x: i,
        y: Math.round(obj.epop*10000)/100
      };
    });
    epopSeries.push(epopObj)
    ftObj.cat1 = chartRawData.cat1;
    ftObj.cat2 = chartRawData.cat2;
    ftObj.name = chartRawData.category;
    ftObj.data = chartRawData.data.map((obj, i) => {
      return {x: i,
        y: Math.round(obj.pctFT*10000)/100
      };
    });
    ftSeries.push(ftObj)
  }
  return [xaxis, epopSeries, ftSeries];
}

function splitTwoCatData(obj, cat1, cat2) {
  var i, dItem, divId;
  var cat1EpopData = [], cat2EpopData = [];
  var cat1FtData = [], cat2FtData = [];
  chartData = getChartData(obj);
  for (i = 0; i < cat1.length; i++) {
    dItem = cat1[i];
    var cat1Epop = $.grep(chartData[1], function(n,i) {
      return n.cat1 == dItem
    });
    var cat1Ft = $.grep(chartData[2], function(n,i) {
      return n.cat1 == dItem
    });
    cat1EpopData.push(cat1Epop);
    cat1FtData.push(cat1Ft);
  }
  for (i = 0; i < cat2.length; i++) {
    dItem = cat2[i];
    cat2EpopData = $.grep(chartData[1], function(n,i) {
      return n.cat2 == dItem
    });
    cat2FtData = $.grep(chartData[2], function(n,i) {
      return n.cat2 == dItem
    });
  }
  return [chartData[0], cat1EpopData, cat1FtData, cat2EpopData, cat2FtData]
}
function addDivs(numDivs=2) {
  $(".chart .col-6").remove();
  for (var i = 0; i < numDivs; i++) {
    var divId = 'chart-area-' + i;
    $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
  }
}

function draw2Charts(cdata, ctitle) {
  drawChart('chart-area-0', cdata[0], cdata[1], "Employment population ratio", chartsubtitle=ctitle);
  drawChart('chart-area-1', cdata[0], cdata[2], "Percent full-time", chartsubtitle=ctitle);
}

function drawJobChart(div, bdata, chartitle='Job loss from peak to trough', chartsubtitle='Feb 2020 - Apr 2020') {
  Highcharts.chart(div, {
    chart: {
      type: 'bar',
      style: {
        fontFamily: "'Open Sans', 'PT Serif Caption'"
      }
    },
    accessibility: {
        description: 'Image description: A chart that shows the top job losses'
    },
    title: {
      text: chartitle
    },
    subtitle: {
      text: chartsubtitle
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: ''
      },
      labels: {
        enabled: true
      }
    },
    tooltip: {
    },
    plotOptions: {
    },
    legend: {
      enabled: true
    },
    series: bdata
  });
}
function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}
$(document).ready(function() {

  var allObj = $.grep(pan1, function(n,i) {
    return n.type == "All"
  });
  var edObj = $.grep(pan1, function(n,i) {
    return n.type == "Education"
  });
  var sexObj = $.grep(pan1, function(n,i) {
    return n.type == "Sex"
  });
  var raceObj = $.grep(pan1, function(n,i) {
    return n.type == "Race"
  });
  var ageObj = $.grep(pan1, function(n,i) {
    return n.type == "Age"
  });
  var sexRaceObj = $.grep(pan1, function(n,i) {
    return n.type == "Race x Sex"
  });
  var sexEdObj = $.grep(pan1, function(n,i) {
    return n.type == "Sex x education"
  });
  var raceEdObj = $.grep(pan1, function(n,i) {
    return n.type == "Race x education"
  });
  // var chartData = getChartObj(allObj[0].data);
  var ind_loss = $.grep(p2Tobj, function(n,i) {
    return n.group == "ind"
  });
  var ind_gain = $.grep(t2Cobj, function(n,i) {
    return n.group == "ind"
  });
  var occ_loss = $.grep(p2Tobj, function(n,i) {
    return n.group == "occ"
  });
  var occ_gain = $.grep(t2Cobj, function(n,i) {
    return n.group == "occ"
  });
  var chartData;
  $("#nav-all").on('click', function(n, i) {
    addDivs();
    chartData = getChartData(allObj);
    draw2Charts(chartData, "All")
  })

  $("#nav-ed").on('click', function(n, i) {
    addDivs();
    chartData = getChartData(edObj);
    draw2Charts(chartData, "Education")
  })
  $("#nav-sex").on('click', function(n, i) {
    addDivs();
    chartData = getChartData(sexObj);
    draw2Charts(chartData, "Sex")
  })
  $("#nav-race").on('click', function(n, i) {
    addDivs();
    chartData = getChartData(raceObj);
    draw2Charts(chartData, "Race")
  })
  $("#nav-age").on('click', function(n, i) {
    addDivs();
    chartData = getChartData(ageObj);
    draw2Charts(chartData, "Age")
  })
  $("#nav-sexed").on('click', function() {
    var cat2Data = splitTwoCatData(sexEdObj, sexCats, edCats);
    $(".chart .col-6").remove();
    for (var i = 0; i < cat2Data[1].length; i++) {
      var j = 2*i;
      var divId = 'chart-area-' + j;
      $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
      drawChart(divId, cat2Data[0], cat2Data[1][i], "Employment population ratio", chartsubtitle="Sex-education");
      k = 1 + 2*i;
      var divId = 'chart-area-' + k;
      $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
      drawChart(divId, cat2Data[0], cat2Data[2][i], "Percent full-time", chartsubtitle="Sex-education");
    }
  })
  $("#nav-raceed").on('click', function() {
    var cat2Data = splitTwoCatData(raceEdObj, raceCats, edCats);
    $(".chart .col-6").remove();
    for (var i = 0; i < cat2Data[1].length; i++) {
      var j = 2*i;
      var divId = 'chart-area-' + j;
      $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
      drawChart(divId, cat2Data[0], cat2Data[1][i], "Employment population ratio", chartsubtitle="Race-education");
      k = 1 + 2*i;
      var divId = 'chart-area-' + k;
      $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
      drawChart(divId, cat2Data[0], cat2Data[2][i], "Percent full-time", chartsubtitle="Race-education");
    }
  })
  $("#nav-sexrace1,#nav-sexrace2").on('click', function() {
    var cat2Data = splitTwoCatData(sexRaceObj, sexCats, raceCats);
    $(".chart .col-6").remove();
    for (var i = 0; i < cat2Data[1].length; i++) {
      var j = 2*i;
      var divId = 'chart-area-' + j;
      $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
      drawChart(divId, cat2Data[0], cat2Data[1][i], "Employment population ratio", chartsubtitle="Sex-race");
      k = 1 + 2*i;
      var divId = 'chart-area-' + k;
      $("<div>", {class: "col-6", id: divId}).appendTo(".chart");
      drawChart(divId, cat2Data[0], cat2Data[2][i], "Percent full-time", chartsubtitle="Sex-race");
    }
  });
  $("#nav-lind3").on('click', function() {
    addDivs();
    var jobData = ind_loss[0].data.map((obj,i) => {
      return [obj.ind_occ, Math.round(obj.cumChgFromPeak/1e3) * 1e3];
    });
    var barData = [{name: 'Job loss', data: jobData}];
    drawJobChart('chart-area-0', barData)
    });
  $("#nav-linded").on('click', function() {
    addDivs();
    //*** This gives data by ind/occ as x-axis ***//
    // var jobData = [];
    // for (var j = 0; j<edCats.length; j++) {
    //   var jobObj = {name: edCats[j], data: null};
    //   var d = $.grep(ind_loss[1].data, function(n,i) {
    //     return n.cat1 == edCats[j]
    //   });
    //   jobObj.data = d.map((obj,i) => {
    //     return [obj.ind_occ, Math.round(obj.cumChgFromPeak/1e3) * 1e3];
    //   });
    //   jobData.push(jobObj);
    // }
    // ** Get data by ed **//
    // var jobData = ind_loss[1].data.map((obj, i) => {
    //   var x = edCats.indexOf(obj.cat1)+1;
    //   return {ind_occ: obj.ind_occ, name: obj.cat1, x: x, y: Math.round(obj.cumChgFromPeak/1e3) * 1e3}
    // });
    // jobData = groupBy(jobData, 'ind_occ');
    // var newjobData = Object.keys(jobData).map(function (key) {
    //   return {name: key, data: jobData[key]};
    // })
    // drawJobChart('chart-area-0', newjobData)
    jobChart(ind_loss[1], edCats)
  });
  $("#nav-lindsex").on('click', function() {
    addDivs();
    jobChart(ind_loss[2], sexCats)
  });
  $("#nav-lindrace").on('click', function() {
    addDivs();
    jobChart(ind_loss[4], raceCats)
  });
  latest = 'Aug 2020';
  $("#nav-gind3").on('click', function() {
    addDivs();
    var jobData = ind_gain[0].data.map((obj,i) => {
      return [obj.ind_occ, Math.round(obj.cumChgFromTrough/1e3) * 1e3];
    });
    var barData = [{name: 'Job gains', data: jobData}];
    drawJobChart('chart-area-0', barData, 'Job gains from trough to current', 'April 2020 - '+latest)
  });
  $("#nav-ginded").on('click', function() {
    addDivs();
    jobChart(ind_gain[1], edCats, 'cumChgFromTrough', 'Job gains from trough to current', 'April 2020 - '+latest);
  });
  $("#nav-gindsex").on('click', function() {
    addDivs();
    jobChart(ind_gain[2], sexCats, 'cumChgFromTrough', 'Job gains from trough to current', 'April 2020 - '+latest)
  });
  $("#nav-gindrace").on('click', function() {
    addDivs();
    jobChart(ind_gain[4], raceCats, 'cumChgFromTrough', 'Job gains from trough to current', 'April 2020 - '+latest)
  });
  $("#nav-locc3").on('click', function() {
    addDivs();
    var jobData = occ_loss[0].data.map((obj,i) => {
      return [obj.ind_occ, Math.round(obj.cumChgFromPeak/1e3) * 1e3];
    });
    var barData = [{name: 'Job loss', data: jobData}];
    drawJobChart('chart-area-0', barData)
    });
  $("#nav-locced").on('click', function() {
    addDivs();
    jobChart(occ_loss[1], edCats)
  });
  $("#nav-loccsex").on('click', function() {
    addDivs();
    jobChart(occ_loss[2], sexCats)
  });
  $("#nav-loccrace").on('click', function() {
    addDivs();
    jobChart(occ_loss[4], raceCats)
  });
  $("#nav-gocc3").on('click', function() {
    addDivs();
    var jobData = occ_gain[0].data.map((obj,i) => {
      return [obj.ind_occ, Math.round(obj.cumChgFromTrough/1e3) * 1e3];
    });
    var barData = [{name: 'Job gains', data: jobData}];
    drawJobChart('chart-area-0', barData, 'Job gains from trough to current', 'April 2020 - '+latest)
  });
  $("#nav-gocced").on('click', function() {
    addDivs();
    jobChart(occ_gain[1], edCats, 'cumChgFromTrough', 'Job gains from trough to current', 'April 2020 - '+latest);
  });
  $("#nav-goccsex").on('click', function() {
    addDivs();
    jobChart(occ_gain[2], sexCats, 'cumChgFromTrough', 'Job gains from trough to current', 'April 2020 - '+latest)
  });
  $("#nav-gindrace").on('click', function() {
    addDivs();
    jobChart(occ_gain[4], raceCats, 'cumChgFromTrough', 'Job gains from trough to current', 'April 2020 - '+latest)
  });

  $("#nav-all").trigger('click');
})

function jobChart(inputData, inCat1, y='cumChgFromPeak', ctitle1, ctitle2) {
  var jobData = inputData.data.map((obj, i) => {
    var x = inCat1.indexOf(obj.cat1)+1;
    return {ind_occ: obj.ind_occ, name: obj.cat1, x: x, y: Math.round(obj[y]/1e3) * 1e3}
  });
  jobData = groupBy(jobData, 'ind_occ');
  var newjobData = Object.keys(jobData).map(function (key) {
    return {name: key, data: jobData[key]};
  })
  drawJobChart('chart-area-0', newjobData, ctitle1, ctitle2);
}
