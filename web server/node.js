const ctx = document.getElementById('realTimeChart').getContext('2d');
const voltageData = {
    labels: [],
    datasets: [{
        label: 'Voltage Output (Volts)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        data: [],
        fill: true,
        tension: 0.4
    }]
};

const config = {
    type: 'line',
    data: voltageData,
    options: {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 30,
                ticks: {
                    color: '#fff',
                    callback: function(value) {
                        return value + 'V';
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    color: '#fff'
                },
                ticks: {
                    color: '#fff'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#fff'
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuad'
        }
    }
};

const realTimeChart = new Chart(ctx, config);
let pieCharts = []; // Array to store pie charts

document.getElementById('addData').addEventListener('click', function() {
    const voltageInput = document.getElementById('voltageInput').value;
    if (voltageInput !== '') {
        const voltageValue = parseFloat(voltageInput);
        if (voltageValue >= 0 && voltageValue <= 30) {
            const time = voltageData.labels.length;
            voltageData.labels.push(time + 's');
            voltageData.datasets[0].data.push(voltageValue);

            if (voltageData.labels.length > 20) {
                voltageData.labels.shift();
                voltageData.datasets[0].data.shift();
            }

            realTimeChart.update();
            document.getElementById('voltageInput').value = ''; // Clear input field
        } else {
            alert('Please enter a value between 0 and 30 volts.');
        }
    }
});

document.getElementById('submit').addEventListener('click', function() {
    const maxVoltage = Math.max(...voltageData.datasets[0].data);
    const averageVoltage = voltageData.datasets[0].data.reduce((a, b) => a + b, 0) / voltageData.datasets[0].data.length || 0;
    const minVoltage = Math.min(...voltageData.datasets[0].data);

    // Display summary in a single line format
    document.getElementById('summaryText').innerHTML = 
        `Max Voltage: ${maxVoltage.toFixed(2)}V, Average Voltage: ${averageVoltage.toFixed(2)}V, Min Voltage: ${minVoltage.toFixed(2)}V`;

    // Create Pie Chart
    const pieCtx = document.createElement('canvas'); // Create a new canvas element
    document.getElementById('pieChartsContainer').appendChild(pieCtx); // Append the canvas to a container

    const percentageData = voltageData.datasets[0].data.map(value => (value / maxVoltage) * 100);
    const pieData = {
        labels: voltageData.labels,
        datasets: [{
            data: percentageData,
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'].concat(['rgba(75, 192, 192, 0.6)']),
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'].concat(['rgba(75, 192, 192, 1)']),
            borderWidth: 1
        }]
    };

    const newPieChart = new Chart(pieCtx, {
        type: 'pie',
        data: pieData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });

    pieCharts.push(newPieChart); // Store the new pie chart in the array

    document.getElementById('pollContainer').style.display = 'block';
});

document.getElementById('clearData').addEventListener('click', function() {
    voltageData.labels = [];
    voltageData.datasets[0].data = [];
    realTimeChart.update();
    document.getElementById('summaryText').innerText = 'No data entered yet.'; // Clear summary text
});

// Poll functionality
const pollOptions = document.querySelectorAll('.poll-option');
pollOptions.forEach(option => {
    option.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        document.getElementById('pollResult').innerText = `Thank you for your feedback! You rated: ${value}`;
        document.getElementById('pollResult').style.display = 'block';
    });
});

