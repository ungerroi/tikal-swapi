import React, { useState, useEffect, useRef, createContext } from "react";
import {getIdFromUrl, populate, getAllResource} from '../helpers/dataHelpers'


const DataContext = createContext();


export const DataContextProvider = props => {

    const [vehiclesWithPilotData, setVehiclesWithPilotData] = useState([])
    const readyRef = useRef(false)

    useEffect(() => {
        // get all relevant resource
        const vehiclesWithPilotData = async () => {
            const peoples = await getAllResource('people').then($ => $.filter(people => people.vehicles.length > 0))
            const planets = await getAllResource('planets')
            // populate planets in pilots
            const pilotsFinale = peoples.map($ => ({...$, homeworld: populate([getIdFromUrl($.homeworld)], planets)[0]}))
            const vehicles = await getAllResource('vehicles')
            const finale = vehicles.reduce((a, $) => {
                $.pilots.length > 0 && a.push({...$, pilots: populate($.pilots.map($ => getIdFromUrl($)), pilotsFinale)})
                return a
            }, [])
           setVehiclesWithPilotData(finale)
        }
        vehiclesWithPilotData()
    }, [])
    useEffect(() => {
        readyRef.current = true
    }, [vehiclesWithPilotData])

    const contextValue = {
        vehiclesWithPilotData: vehiclesWithPilotData,
        getVehicleLargestSum (vehicles) {
            const a = vehicles.reduce((acc, vehicle) => {
                const populations = vehicle.pilots.reduce((acc, pilot) => acc + +pilot.homeworld.population, 0)
                acc.push({name: vehicle.name, sumPopulation: populations})
                return acc
            }, [])
    
            const b = a.reduce((acc, vehicle) => {
                acc = vehicle.sumPopulation > acc.sumPopulation ? vehicle : acc
                return acc
            }, {name: '', sumPopulation: 0})
            return b.name
        },
        getDataPerVehicleByName (vehicleName) {
            const v = vehiclesWithPilotData.filter(vehicle => vehicle.name === vehicleName)
            const d = v[0].pilots.map($ => ({pilotName: $.name, planet: {name: $.homeworld.name, population: $.homeworld.population}}))
            const f = d.reduce((acc, $) => {
                acc.pilots.push($.pilotName)
                acc.planets.push($.planet)
                return acc
            }, {pilots: [], planets: []})
            return f
        },
        selectedPlanets (planets) {
            const selected = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']
            const filterd = planets.reduce((acc, $) => {
                if (selected.includes($.name)) acc.push({name: $.name, population: $.population})
                return acc
                
            }, [])
            // get the most populate planet
            const max = filterd.reduce((acc, $) => acc < +$.population ? +$.population : acc, 0)
            // calc the rest of the pupulats acurding to the most populated planet
            const a = filterd.map($ => {
                $.height = +$.population / max * 100;
                $.height = $.height < 1 ? $.height += 6 : $.height
                console.log($.height)
                return $
            })
            return a
        }
    }

    return (
        <DataContext.Provider value={contextValue}>
            {readyRef.current ? props.children : 'Please waite...'}
        </DataContext.Provider>
    );
    
};

export default DataContext;