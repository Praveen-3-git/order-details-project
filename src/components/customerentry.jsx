/* eslint-disable react/prop-types */
import {  Button, Card, CardContent, CardHeader, Fab, Fade, Snackbar, TextField, Tooltip} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import MuiAlert from '@mui/material/Alert';

const CustomerEntry=()=>{
    const location = useLocation();
    const editid = location.state && location.state.customerId ? location.state :'' 

    const [status, setstatus] =useState({
        open: false,
        text: '',
        color: 'success',
        vertical:'top',
        horizontal:'center' 
    });

    const handleClick = (text,color) => {
        setstatus({open: true,text:text,color:color });
    };
    
    const handleClose = (event, reason,newstatus) => {
        if (reason === 'clickaway') {
          return;
        }
        setstatus({ ...newstatus, open: false });
    };

    useEffect(()=>{
        console.log(location)
        if(location.state !=null && location.state.status)
            location.state && handleClick(location.state.status,location.state.color)
        
        
    },[])

    const baseURL="https://localhost:5001/api/Customer"
    const mobileregex=/^([+]\d{2})?\d{10}$/
    const formik=useFormik({
        initialValues:{
            customerName:editid ? editid.customerName:"",
            address:editid ? editid.address:"",
            street:editid ? editid.street:'',
            city:editid ? editid.city:'',
            pincode:editid ? editid.pincode:'',
            mobileNumber:editid ? editid.mobileNumber:"",
            email:editid ? editid.email:'',
            outstandingAmount:editid ? editid.outstandingAmount:'',
            outstandingLimit:editid ? editid.outstandingLimit:'',
        },
        validationSchema:Yup.object({
            customerName:Yup.string().required("Customer Name is Required"),
            address:Yup.string().required("Address is Required"),
            street:Yup.string().required("Street is Required"),
            city:Yup.string().required("City is Required"),
            pincode:Yup.string().required("Pincode is Required").max(6,"Need Valid Pincode").min(6,"Need Valid Pincode"),
            mobileNumber:Yup.string().required("Mobile Number is Required").matches(mobileregex,"Need Valid Mobile Number"),
            email:Yup.string().required("Email is Required").email('Need valid Mail'),
            outstandingAmount:Yup.number().required("Outstanding Amount is Required"),
            outstandingLimit:Yup.number().required("Outstanding Limit is Required"),
        }),
        validate:(values)=>{
            const errors={};
            console.log(values.outstandingAmount)
            if(values.outstandingAmount>values.outstandingLimit){
                errors.outstandingAmount ="Ouststanding Amount do not Exceed Limit";
            }
            return errors;
        },
        onSubmit:(values)=>{
            console.log(values)
            if(editid){     
                console.log(editid.customerId)
                editPost(values)
                //closeEditid()
            }
            else{
                console.log('add')
                addPost(values)
            }  
        }
    })
    function addPost(values){
        console.log(values)
        axios.post(baseURL, {
            customerName:values.customerName,
            address:values.address,
            street:values.street,
            city:values.city,
            pincode:values.pincode,
            mobileNumber:values.mobileNumber,
            email:values.email,
            outstandingAmount:values.outstandingAmount,
            outstandingLimit:values.outstandingLimit,
        }).then(() => {
            console.log('added')
            navigate("/customer/customerList",{state: {status:'Added',color:'success'}});
        });
    }
    function editPost(values){
        // console.log(editid.customerId)
        // console.log(values.customerName)
        axios
            .patch(baseURL, {
                customerId:editid.customerId,
                customerName:values.customerName,
                address:values.address,
                street:values.street,
                city:values.city,
                pincode:values.pincode,
                mobileNumber:values.mobileNumber,
                email:values.email,
                outstandingAmount:values.outstandingAmount,
                outstandingLimit:values.outstandingLimit,
            })
            .then((response) => {
                console.log(response)
                navigate("/customer/customerList",{state: {status:'Updated',color:'success'}});
            }) 
            .catch((error) => {
                console.error('Error editing post:', error);
            });
    }
    function cancelBtn(){
        formik.handleReset()  
        navigate("/customer/customerList");   
    }
    const navigate = useNavigate();

    const tocustomerlist = () => {
        navigate("/customer/customerList");
    };
    return(
        <Card>
            <CardHeader title="CUSTOMER" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab variant="extended" size="small" id="viewBTN" color="primary" sx={{padding:'1em'}} onClick={tocustomerlist}>
                                {/* <CalendarViewDayIcon sx={{ mr: 2 }} /> */}
                                View
                            </Fab>
                        </Tooltip> }
            />
            <form className="mycustomerform" onSubmit={formik.handleSubmit} >
                <CardContent>
                    <div className="row">
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Customer Name' id='customerName' name='customerName'  
                                value={formik.values.customerName} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                                helperText={formik.touched.customerName && formik.errors.customerName}     
                            />
                        </div>
                        <div className="col-sm-4  my-3">
                            <TextField fullWidth size="small" label='Address' id='address' name='address'  
                                value={formik.values.address} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Street' id='street' name='street'  
                                value={formik.values.street} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.street && Boolean(formik.errors.street)}
                                helperText={formik.touched.street && formik.errors.street}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='City' id='city' name='city'  
                                value={formik.values.city} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.city && Boolean(formik.errors.city)}
                                helperText={formik.touched.city && formik.errors.city}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Pincode' id='pincode' name='pincode' 
                                value={formik.values.pincode} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                                helperText={formik.touched.pincode && formik.errors.pincode}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='MobileNo' id='mobileNumber' name='mobileNumber' inputProps={{ maxLength: 10 }}
                                value={formik.values.mobileNumber} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber} 

                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Email' id='email' name='email' 
                                value={formik.values.email} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" type="number" label='Outstanding Amount' id='outstandingAmount' name='outstandingAmount' 
                                // inputProps={{style: { textAlign: "right" }}}
                                value={formik.values.outstandingAmount} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.outstandingAmount && Boolean(formik.errors.outstandingAmount)}
                                helperText={formik.touched.outstandingAmount && formik.errors.outstandingAmount}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" type="number" label='Outstanding Limit' id='outstandingLimit' name='outstandingLimit' 
                                value={formik.values.outstandingLimit} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.outstandingLimit && Boolean(formik.errors.outstandingLimit)}
                                helperText={formik.touched.outstandingLimit && formik.errors.outstandingLimit}
                            />
                        </div>
                    </div>
                    <div className="text-center text-md-end my-3">
                    {editid 
                            ? (<Button variant="contained" color="primary" sx={{marginX:'1em'}} type="submit">UPDATE</Button>)
                            : (<Button variant="contained" color="primary" sx={{marginX:'1em'}} type="submit">SAVE</Button>) }  
                        <Button variant="contained" color="error" sx={{marginX:'1em'}} type="reset" onClick={cancelBtn} >CANCEL</Button>
                    </div>
                    {status.open && (<Snackbar open={status.open} autoHideDuration={1000} TransitionComponent={Fade} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                        <MuiAlert severity={status.color} sx={{ width: '100%' }} variant="filled">
                            {status.text}
                        </MuiAlert>
                    </Snackbar>) }
                    
                </CardContent>
            </form>
        </Card>
    )
}

export default CustomerEntry