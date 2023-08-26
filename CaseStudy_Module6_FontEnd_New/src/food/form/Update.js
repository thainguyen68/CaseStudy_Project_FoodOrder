import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import FormUpdate from "./FormUpdate";

export default function Update() {
    const [food, setFood] = useState({})
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`).then((res) => {
            setFood(res.data)
        })
    }, [id])

    return (
        <>
            <FormUpdate food={food} naviage={navigate}/>
        </>
    )
}
