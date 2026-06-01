
let button=document.getElementById("btnCharts");
button.addEventListener("click",()=>{
    createDiv();
});
let opetionBtn =document.getElementById("chartSelect");

function createDiv() {
    let opetionBtn = document.getElementById("chartSelect");
    let h = document.getElementById("heading");

    let chart = document.createElement("div");
    chart.style = "width:600px;height:400px;";

    let selectedText = opetionBtn.options[opetionBtn.selectedIndex].innerText;
    h.innerText = selectedText;

    // remove previous chart safely
    if (h.nextElementSibling) {
        h.nextElementSibling.remove();
    }

    if (opetionBtn.value === "waterfall") {
        chart.id = "waterfall";
        h.appendChild(chart);
        waterfallData();
    }

    if (opetionBtn.value === "basicbar") {
        chart.id = "basicbar";
        h.appendChild(chart);
        basicBar();
    }

    if (opetionBtn.value === "piebar") {
        chart.id = "piebar";
        h.appendChild(chart);
        pieChart();
    }

    if (opetionBtn.value === "multibar") {
        chart.id = "multibar";
        h.appendChild(chart);
        multiBar();
    }
}


function multiBar(){
let myChart = echarts.init(document.getElementById('multibar'));
option = {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  tooltip: {},
  legend: {
    data: ['sales']
    },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [23, 24, 18, 25, 27, 28, 25]
    },
    {
      type: 'bar',
      data: [26, 24, 18, 22, 23, 20, 27]
    },
    {
      type: 'bar',
      data: [26, 24, 18, 22, 23, 20, 27]
    }
  ]
};
myChart.setOption(option);
};

function pieChart(){
let myChart = echarts.init(document.getElementById('piebar'));

    option = {
  series: [
    {
      type: 'pie',
      data: [
        {
          value: 335,
          name: 'Direct Visit'
        },
        {
          value: 234,
          name: 'Union Ad'
        },
        {
          value: 1548,
          name: 'Search Engine'
        }
      ]
    }
  ]
};
myChart.setOption(option);
}

function basicBar(){
let myChart = echarts.init(document.getElementById('basicbar'));
option = {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [23, 24, 18, 25, 27, 28, 25]
    }
  ]
};
myChart.setOption(option);
}

function waterfallData(data) {
let myChart = echarts.init(document.getElementById('waterfall'));
var data = [900, 345, 393, -108, -154, 135, 178, 286, -119, -361, -203];
let help = [];
let positive = [];
let negative = [];
for (let i = 0, sum = 0; i < data.length; ++i) {
  if (data[i] >= 0) {
    positive.push(data[i]);
    negative.push('-');
  } else {
    positive.push('-');
    negative.push(-data[i]);
  }

  if (i === 0) {
    help.push(0);
  } else {
    sum += data[i - 1];
    if (data[i] < 0) {
      help.push(sum + data[i]);
    } else {
      help.push(sum);
    }
  }
}

option = {
  title: {
    text: 'Waterfall'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    splitLine: { show: false },
    data: (function() {
      let list = [];
      for (let i = 1; i <= 11; i++) {
        list.push('Oct/' + i);
      }
      return list;
    })()
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      stack: 'all',
      itemStyle: {
        normal: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        }
      },
      data: help
    },
    {
      name: 'positive',
      type: 'bar',
      stack: 'all',
      data: positive
    },
    {
      name: 'negative',
      type: 'bar',
      stack: 'all',
      data: negative,
      itemStyle: {
        color: '#f33'
      }
    }
  ]
};
myChart.setOption(option);
}
