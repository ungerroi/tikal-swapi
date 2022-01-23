import {useContext, useState, useEffect} from 'react'
import DataContext from "../contexts/data";
import {getAllResource} from '../helpers/dataHelpers'

const Part_two = () => {
    
    const {selectedPlanets} = useContext(DataContext)
    const [planets, setPlanets] = useState([])

    useEffect( async () => {
        const planets = await getAllResource('planets')
        setPlanets(planets)
    }, [])

    return (
        <>
            <h2>Part two</h2>     
            <div className="bars-chart container">
                {selectedPlanets(planets).map((planet, index) => {
                    return (
                        <div key={index} style={{height: planet.height + '%'}}>
                            <div className="planet-amout-bar">{planet.population}</div>
                            <div className="planet-name-bar">{planet.name}</div>
                        </div>
                    )
                })}
            </div> 
        </>
    )
}

export default Part_two
