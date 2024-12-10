import React from "react";
import ReactApexChart from 'react-apexcharts';

const  Chart = ({options, series, type, height}) =>{
    return(
        <div>
            <ReactApexChart options={options} series={series} type={type} height={height || 350} />
        </div>
    )
}

export default Chart;