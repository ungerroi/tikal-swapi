import {useContext, useState, useEffect} from 'react'
import DataContext from "../contexts/data";
const Part_one = () => {
    const {getVehicleLargestSum, getDataPerVehicleByName, vehiclesWithPilotData} = useContext(DataContext)

    return (
        <>
            <h2>Part one</h2>
            {console.log(vehiclesWithPilotData)}
            <table className="table table-bordered border-primary">
                <tbody>
                    <tr>
                        <td>Vehicle name with the largest sum</td>
                        <td>{getVehicleLargestSum(vehiclesWithPilotData)}</td>
                    </tr>
                    <tr>
                        <td>Related home planets and their respective population</td>
                        <td>{getDataPerVehicleByName(getVehicleLargestSum(vehiclesWithPilotData)).planets.map($ => `${$.name}: ${$.population}`)}</td>
                    </tr>
                    <tr>
                        <td>Related pilot names</td>
                        <td>{getDataPerVehicleByName(getVehicleLargestSum(vehiclesWithPilotData)).pilots}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Part_one
