import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Food} from "../../model/Food";
import FormCreate from "./FormCreate";

export default function Create() {
    const [food] = useState(new Food())
    const navigate = useNavigate()
    const {id} = useParams();

    return (
        <>
            <FormCreate food={food} idShop = {id} naviage={navigate}/>
        </>
    )
}
