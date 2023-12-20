import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Sidebarmini from "./components/sidebar"
import Home from "./components/home.jsx"
import Customer from './components/customer.jsx'
import Item from './components/item.jsx'
import Bill from "./components/bill.jsx"
import CustomerEntry from "./components/customerentry.jsx"
import CustomerList from "./components/customerlist.jsx"

const router =createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Sidebarmini/>}>
            <Route index element={<Home/>} ></Route>
            <Route path="customer" element={<Customer/>}>
                <Route index element={<CustomerList/>}/>
                <Route path="customerList" element={<CustomerList/>}/>
                <Route path="customerEntry" element={<CustomerEntry/>}/>
            </Route>
            <Route path="item" element={<Item/>}></Route>
            <Route path="bill" element={<Bill/>}></Route>
        </Route>
    )
)

function Land(){
    return(
        <>
            <RouterProvider router={router}/>
            {/* <Sidebarmini/> */}
        </>
    )
}
export default Land