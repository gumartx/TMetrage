import Chart from "react-apexcharts"

const BarChart = () => {

    const options = {
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    };

    const mockData = {
        labels: {
            categories: [
                'Terror',
                'Comédia',
                'Ação e Aventura',
                'Suspense',
                'Documentário',
              ],
        },
        
        series: [
            {
                name: "Quantidade de filmes:",
                data: [2, 8, 7, 1, 3],
            }
        ]
    };

    return (
        <Chart
            options={{ ...options, xaxis: mockData.labels}}
            series={mockData.series}
            type="bar"
            height="240"
        />
    );
}

export default BarChart;