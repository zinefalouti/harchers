import React from 'react'
import Def from '../images/default.png';

function Default({message}) {
  return (
    <div className="default">
        <img src={Def} alt="H.aRchers Default"/>
        <h1>{message}</h1>
    </div>
  )
}

export default Default