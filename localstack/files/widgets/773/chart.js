var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        // labels: ['2020-06-01 15:50', '2020-06-01 18:15', 'System 3', 'System 4', 'System 5', 'System 6'],
        labels: [],
        datasets: [{
            label: 'Battery',
            /// data: [12, 19, 3, 5, 2, 3],
            data: [],
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderWidth: 1,
            fill: false,
        },
        {
            label: 'Temperature',
            // data: [2, 5, 3, 17, 14, 5],
            data: [],
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1,
            fill: false,
        },
        {
            label: 'Humidity',
            // data: [2, 5, 3, 17, 14, 5],
            data: [],
            backgroundColor: 'green',
            borderColor: 'green',
            borderWidth: 1,
            fill: false,
        }
    ]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});