import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link , useNavigate  } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Reviews from './Reviews'


function DetailProduct() {
    const navigate = useNavigate()
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])
    const [rate, setRate] = useState(0)
    const [comment, setComment] = useState("")
    const [reviews , setReviews] = useState([])
    const [isAdmin] = state.userAPI.isAdmin

    

    let handleRating = async (e) => {
        e.preventDefault()
        try {
            await axios.post(' http://localhost:3000/api/products/review', {
                product_id: detailProduct._id,
                rating: rate,
                comment: comment
            }, {
                headers: {
                    "Authorization": state.token[0]
                }
            })
            setReviews([ ...reviews , {comment: comment , rating :rate  }])
            navigate('/')
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        if (params.id) {

            products.forEach(product => {
                if (product._id === params.id){
                    setDetailProduct(product)
                    // setReviews(product.reviews)
                } 
                    
            })
        }
    }, [params.id, products ])

    useEffect(  () => {
        try {
             axios.get(`http://localhost:5000/api/reviews?id=${params.id}`).then(res=>{
                setReviews(res.data.reviews)
            })
        } catch (err) {
            alert(err)
        }
    }, [params.id ])

    if (detailProduct.length === 0) return null;

    return (
        <>
            <div className="detail">
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                        <h6>#id: {detailProduct.product_id}</h6>
                    </div>
                    <span>$ {detailProduct.price}</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    {/* <p>Sold: {detailProduct.sold}</p> */}
                    <p>Stock: {detailProduct.stock}</p>

                    
                    {isAdmin ?  <></>
                    :
                    detailProduct.stock === 0 ?
                        <p>Sorry This item out of stock ! </p>
                         : <Link to="/cart" className="cart"
                        onClick={() => addCart(detailProduct)}>
                        Buy Now
                    </Link>}
                   

                    <form onSubmit={handleRating}>
                        <div className="form-group">
                            <label>
                                Rating
                            </label>
                            <select className="custom-select" name="rate" id="rate" value={rate}
                                onChange={(e) => setRate(e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>
                                Your Comment :
                            </label>
                            <textarea cols="10" rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button className='btn btn-secondary'>Add Review</button>
                    </form>

                    {/* <h3>Reviews : </h3>
                    {reviews.map((review , index) => (
                        <div key={index} className="card">
                            <div className='card-body'>
                                <h5 className="card-title">{review.comment}</h5>
                                <span className="card-subtitle mb-2 text-muted">{review.rating} / 5  </span>
                            </div>
                        </div>
                    ))} */}

                    <Reviews reviews = {reviews} id={params.id}/>

                </div>
            </div>

            <div>
                <h2>Related products</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailProduct
