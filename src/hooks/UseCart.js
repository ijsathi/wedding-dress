import { useEffect, useState } from "react";
import useFirebase from "./useFirebase";

const UseCart = () => {
    const {user} = useFirebase();
    const {uid} = user;
    const [selectedBooking, setSelectedBooking] = useState([]);
    
    useEffect(()=>{
        fetch(`https://evening-basin-66678.herokuapp.com/cart/${uid}`)
        .then(res=>res.json())
        .then(data=>{
            if(data.length){
                setSelectedBooking(data)
            }
        })
        setSelectedBooking([])
    },[uid])
    
    function addToCart (dt){
        const isHave = selectedBooking.find(select => select._id === dt._id);
        delete dt._id;
        dt.uid = uid;
        dt.status = 'pending'; 
        if (isHave) { 
            alert("Already added! Go to Dashboard & Place Order")
        } else {
            fetch('https://evening-basin-66678.herokuapp.com/booking/add', {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify(dt)
            })
            .then(res=> res.json())
            .then(data =>{
                if(data.insertedId){
                    const newBooking = [...selectedBooking, dt];
                    setSelectedBooking(newBooking)
                }
            })
        }
    }
    function remove (id){
        // const selectAfterRemove = selectedBooking.filter((select)=> !(select._id === id));
        const url = `https://evening-basin-66678.herokuapp.com/booking/add/${id}`;
        fetch(url,{
            method: 'DELETE'
        })
        .then(res=> res.json())
        .then(data=>{
            if(data.deletedCount === 1){
                const selectAfterRemove = selectedBooking.filter((select)=> !(select._id === id));
                setSelectedBooking(selectAfterRemove)
            }else{
                alert('Something Wrong!')
            }
        })
    }
    return {addToCart, selectedBooking, remove };
};

export default UseCart;