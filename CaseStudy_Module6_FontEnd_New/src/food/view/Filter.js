import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Filter({filter}) {
    const [selectedFilter, setSelectedFilter] = useState('');
    const handleFilterChange = (event) => {
        const string = event.target.value;
        setSelectedFilter(string);

        axios.get(`http://localhost:8080/api/products/${string}`).then((res) => {
            filter(res.data)
        });

    };

    return (
        <div className="grid__row borderUnderLine">
            <div className="filter_sort_food">
                <select value={selectedFilter} onChange={handleFilterChange}
                className="filter_sort_food_select">
                    <option value="sort_price_asc">Giá tăng dần</option>
                    <option value="sort_price_desc">Giá giảm dần</option>
                    <option value="sort_view_desc">Xem nhiều nhất</option>
                </select>
            </div>
        </div>
    );
}

export default Filter;
