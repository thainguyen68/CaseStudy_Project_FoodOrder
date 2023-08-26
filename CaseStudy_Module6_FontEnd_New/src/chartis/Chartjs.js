import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from "chart.js";
import { Link } from "react-router-dom";
import FilterBill from "../filter/FillterBill";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

export default function Chartjs() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    const [bill, setBill] = useState([]);
    const [displayType, setDisplayType] = useState("day");

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/bills/bill-chartjs/${userId}`)
            .then((response) => {
                if (response.data != null) {
                    console.log(response.data);
                    setBill(response.data);
                } else {
                    setBill([]);
                }
            });
    }, [userId]);
    const sortByShop = (data) => {
        setBill(data)
    }

    const sortByDate = (a, b) => {
        const dateA = new Date(a.localDateTime.split("T")[0]);
        const dateB = new Date(b.localDateTime.split("T")[0]);
        return dateA - dateB;
    };

    const handleDisplayTypeChange = (type) => {
        setDisplayType(type);

        if (type === "day") {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            const startDate = new Date(currentYear, currentMonth, lastDayOfCurrentMonth - 30);
            const endDate = new Date(currentYear, currentMonth, lastDayOfCurrentMonth);

            const filteredBills = bill.filter((item) => {
                const billDate = new Date(item.localDateTime.split("T")[0]);
                return billDate >= startDate && billDate <= endDate;
            });

            const sortedBills = filteredBills.sort(sortByDate);

            updateChart(sortedBills);
        } else if (type === "month") {
            const currentYear = new Date().getFullYear();
            const filteredBills = bill.filter((item) => {
                const billYear = new Date(item.localDateTime.split("T")[0]).getFullYear();
                return billYear === currentYear;
            });

            const monthlyData = {};
            filteredBills.forEach((item) => {
                const billDate = new Date(item.localDateTime.split("T")[0]);
                const monthYear = `${billDate.getMonth() + 1}-${billDate.getFullYear()}`;

                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = 0;
                }
                monthlyData[monthYear] += item.total;
            });

            const dateLabels = Object.keys(monthlyData);
            const totalAmounts = dateLabels.map((monthYear) => monthlyData[monthYear]);

            const updatedChartData = {
                labels: dateLabels,
                datasets: [
                    {
                        label: "Tổng doanh thu",
                        data: totalAmounts,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            };

            setChartData(updatedChartData);
        } else if (type === "year") {
            const currentYear = new Date().getFullYear();
            const filteredBills = bill.filter((item) => {
                const billYear = new Date(item.localDateTime.split("T")[0]).getFullYear();
                return billYear;
            });

            const yearlyData = {};
            filteredBills.forEach((item) => {
                const billYear = new Date(item.localDateTime.split("T")[0]).getFullYear();

                if (!yearlyData[billYear]) {
                    yearlyData[billYear] = 0;
                }
                yearlyData[billYear] += item.total;
            });

            const dateLabels = Object.keys(yearlyData);
            const totalAmounts = dateLabels.map((year) => yearlyData[year]);

            const updatedChartData = {
                labels: dateLabels,
                datasets: [
                    {
                        label: "Tổng doanh thu",
                        data: totalAmounts,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            };

            setChartData(updatedChartData);
        }
    };

    const updateChart = (filteredBills) => {
        const sortedBills = filteredBills.sort(sortByDate);

        const updatedDateTotals = {};
        sortedBills.forEach((item) => {
            const date = new Date(item.localDateTime.split("T")[0]);
            const formattedDate = date.toISOString().split("T")[0];

            if (!updatedDateTotals[formattedDate]) {
                updatedDateTotals[formattedDate] = 0;
            }
            updatedDateTotals[formattedDate] += item.total;
        });

        const dateLabels = Object.keys(updatedDateTotals);
        const totalAmounts = dateLabels.map((date) => updatedDateTotals[date]);

        const updatedChartData = {
            labels: dateLabels,
            datasets: [
                {
                    label: "Tổng doanh thu",
                    data: totalAmounts,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };

        setChartData(updatedChartData);
    };

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Tổng doanh thu",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    });

    return (
        <>
            {bill.length > 0 ? (
                <div>
                    <div>
                        <div className={`row`} style={{ marginTop: "50px", marginBottom: "20px" }}>
                            <div className={`col-md-12`}>
                                <Link to={'/products-carts-merchant'}
                                      style={{ textDecoration: `none`, position: `relative`, top: `-20px`, fontSize: `20px`, color: `orange` }}>
                                    <i className="fa-solid fa-backward"></i>
                                    <span> Trở lại trang quản lý</span>
                                </Link>
                            </div>
                            <div className={`col-md-8`}>
                                <p>THỐNG KÊ</p>
                            </div>
                            <div className={`col-md-4`}>
                                <div className="d-flex statistical">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button
                                            type="button"
                                            className={`btn btn-secondary btn-${displayType === "day" ? "danger" : "light"}`}
                                            onClick={() => handleDisplayTypeChange("day")}
                                        >
                                            Ngày
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-secondary btn-${displayType === "month" ? "danger" : "light"}`}
                                            onClick={() => handleDisplayTypeChange("month")}
                                        >
                                            Tháng
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-secondary btn-${displayType === "year" ? "danger" : "light"}`}
                                            onClick={() => handleDisplayTypeChange("year")}
                                        >
                                            Năm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="display_chart">
                            {displayType === "day" ? (
                                <Line data={chartData} />
                            ) : (
                                <Bar data={chartData} />
                            )}
                        </div>

                    </div>
                </div>
            ) : (
                <>
                    <div className={`col-md-12 mrTopData`}>
                        <Link to={'/products-carts-merchant'}
                              style={{
                                  textDecoration: `none`,
                                  position: `relative`,
                                  top: `-20px`,
                                  fontSize: `20px`,
                                  color: `orange`
                              }}>
                            <i className="fa-solid fa-backward"></i>
                            <span> Trở lại trang quản lý</span>
                        </Link>
                    </div>
                    <div className="view_data-NoItem mrTopData ">
                        <div className="view_data-NoItem-container">
                            <img src="../static/img/empty-data.png" />
                            <p className="view_data-NoItem-container-h"> Dữ liệu trống ... </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

