export default function Cropcard({Crop, area, date}){
return (
<div className="flex justify-between bg-lime-500/15 backdrop-blur-xl border border-lime-200/20 shadow-xl rounded-2xl p-2 m-1 
hover:">
    <h1>{Crop}</h1>
    <p>{area}</p>
    <p>{date}</p>
</div>
);
}