import React from 'react'
import "./Podcastcard.css"
import { Link } from 'react-router-dom'

const Podcastcard = ({title, displayImage, id}) => {  // podcast card  // for podcastDetails
  return (
    <Link to={`/podcast/${id}`}>
    <div className='podcast-cards' data-testid="podcast-cards" >
      <img src={displayImage} alt='img' />
      <p>{title}</p>
    </div>
    </Link>
  )
}

export default Podcastcard
