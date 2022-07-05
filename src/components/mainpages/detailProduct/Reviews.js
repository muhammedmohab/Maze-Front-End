import axios from 'axios'
// import React, { useState ,useEffect } from 'react'
import {  useNavigate  } from 'react-router-dom'
import { useContext } from "react"
import { GlobalState } from "../../../GlobalState"
function Reviews({ reviews, id }) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const navigate = useNavigate()
    const deleteReview = (reviewID) => {
        try {
            axios.delete(`http://localhost:3000/api/reviews?id=${reviewID}&productId=${id}` ,
            {
                headers: {
                    "Authorization": state.token[0]
                }
            }).then ( ()=>{
                navigate('/')
            })
        } catch (err) {
            alert(err)
        }
    }
    return (
        <div>
            <h3>Reviews : </h3>
            {reviews.map((review) => (
                <div key={review._id} className="card">
                    <div className='card-body'>
                        <h5 className="card-title">{review.comment}</h5>
                        <span className="card-subtitle mb-2 text-muted">{review.rating} / 5  </span>
                        {isAdmin&&<button onClick={()=>deleteReview(review._id)} className="btn btn-danger">X</button>}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Reviews