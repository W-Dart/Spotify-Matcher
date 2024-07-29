import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);


const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';

        const text = chart.options.plugins.centerText.text;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 1.75;

        ctx.fillText(text, textX, textY);
        ctx.save();
    },
};

ChartJS.register(centerTextPlugin); // Register the custom plugin

const DoughnutChart = (props) => {

    
    const percentage = props.percentage;
    const data = {
        labels: props.labels,
        datasets: [
            {
                label: props.label,
                data: props.data,
                backgroundColor: [
                    
                    '#1DB954',  
                    '#535353'  
                ],
                borderColor: [
                    '#1DB954',         
                    '#535353',     
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
            centerText: {
                display: true,
                text: `${percentage}%`,
            },
        },
    };

    

    return (
        <div className="justify-content-center" style ={{width: '300px', height: '300px', }}>
             <Doughnut data={data} options={options} />
             <h2 style ={{textAlign: 'center' }}>{props.title}</h2>
        </div>
    )
}

export default DoughnutChart;