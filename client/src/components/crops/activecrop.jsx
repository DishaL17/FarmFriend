import { FaChartPie } from "react-icons/fa";
import Cropcard from "./Cropcard";
export default function ActiveCrops(){
return (
<div >
    <div className="flex justify-between text-white font-medium text-xl"> 
        <h1>Active crops</h1>
        <span >+</span>
    </div>
    <div className="flex flex-col">
        <Cropcard Crop="Wheat" area="7 acre" date="17 july" />
        <Cropcard Crop="Potato" area="3 acre" date="13 sept " />
    </div>
    <div>
       <span className="flex items-center  text-white text-xl"> < FaChartPie className=" mr-2 " /> Status</span>
    </div>
</div>

);
}