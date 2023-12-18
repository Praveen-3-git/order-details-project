/* eslint-disable react/prop-types */
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Fab, IconButton, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react"
//import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from "formik";
import * as Yup from "yup";
//import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
const Customer=()=>{
    const [view,setView]=useState(false);
    const [editid,setEditid]=useState('')
    const baseURL="https://localhost:5001/api/Customer"
    function handleView() {
        setView(false);
        closeEditid()
    }
    function handleAdd() {
        setView(true);
    }
    function getEditID(r){
        setEditid(r)
        setView(true)
    }
    function closeEditid(){
        setEditid('')
    }
    return(
        // <Container  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',}}>
        <Container maxWidth='xl'>
            {view ? <CustomerEntry handleView={handleView} editid={editid}  closeEditid={closeEditid} baseURL={baseURL}/>
                  : <CustomerList handleAdd={handleAdd} getEditID={getEditID} baseURL={baseURL}/>  }
        </Container>
    )
}

const CustomerList=({handleAdd,getEditID,baseURL})=>{
    const [displayData,setDisplayData]=useState([]);
    
    const fetchData=async ()=>{
        try {
            const response=await axios.get(baseURL);
            console.log(response.data);
            setDisplayData(response.data.rows)
        }catch(error){
            console.error("Error fetching data:",error)
        }
    }
    useEffect(()=>{
        fetchData();
    },[])
    const column=[
        {
            field:'act',headerName: 'Action',align: 'center', headerAlign: 'center', minWidth: 100,width:120, sortable: false ,disableColumnMenu:true, headerClassName: 'headercol',
            renderCell:(params)=>(
                <ButtonGroup size="small">
                    <Tooltip title="EDIT" placement="left">
                        <IconButton color="info" sx={{paddingY:'0.5rem'}} onClick={()=> getEditID(params.row)}>
                            <EditIcon/> 
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="DELETE" placement="right">
                        <IconButton color="error" sx={{paddingY:'0.5rem'}} onClick={()=> deletepost(params.row)}>
                            <DeleteIcon/> 
                        </IconButton>
                    </Tooltip>
                </ButtonGroup>
            )
        },
        { field: 'customerName', headerName: 'Customer Name', minWidth: 150, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'address', headerName: 'Address', minWidth: 200,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'street', headerName: 'Street', minWidth: 100,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'city', headerName: 'City', minWidth: 100,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'pincode', headerName: 'Pincode', minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'mobileNumber', headerName: 'Mobile Number', minWidth: 100,width:150, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'email', headerName: 'Email', minWidth: 200, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'outstandingAmount', headerName: 'Outstanding Amount', minWidth: 100, width:150, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'outstandingLimit', headerName: 'OutstandingLimit', minWidth: 100, width:150, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
    ]
    function deletepost(r){
        axios.delete(`${baseURL}/${r.customerId}`)
            .then(()=>{
                alert("Post Deleted!")
                fetchData();
            })
    }
    return(
        <Card>
            <CardHeader 
                title="CUSTOMER LIST" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab size="small" onClick={handleAdd}><AddIcon/></Fab>
                        </Tooltip> }
                />
            <CardContent>
            <Box sx={{'& .headercol': { backgroundColor: 'gray', color: "white",fontSize:'1.15em'}}}>
                    <DataGrid
                        rows={displayData} columns={column} disableRowSelectionOnClick
                        getRowId={(row) => row.customerId} 
                        initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 10,
                              },
                            },
                        }}
                        pageSizeOptions={[10, 15, 25]}
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: {
                                    variant: "outlined",
                                    size: "small",
                                    sx:{width:'20rem'}
                                },
                                printOptions: { disableToolbarButton: true },
                                csvOptions: { disableToolbarButton: true },

                            }}
                        }
                    />
                </Box>
            </CardContent>
        </Card>
    )
}

const CustomerEntry=({handleView,editid,baseURL})=>{
    //const baseURL="https://localhost:5001/api/Customer"
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
            pincode:Yup.string().required("Pincode is Required"),
            mobileNumber:Yup.string().required("Mobile Number is Required"),
            email:Yup.string().required("Email is Required"),
            outstandingAmount:Yup.number().required("Outstanding Amount is Required"),
            outstandingLimit:Yup.number().required("Outstanding Limit is Required"),
        }),
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
            document.getElementById("viewBTN").click() 
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
                document.getElementById("viewBTN").click() 
            })
            .catch((error) => {
                console.error('Error editing post:', error);
            });
    }
    function cancelBtn(){
        formik.handleReset()
        document.getElementById('viewBTN').click()         
    }
    return(
        <Card>
            <CardHeader title="CUSTOMER" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab variant="extended" size="small" id="viewBTN" color="primary" sx={{padding:'1em'}} onClick={handleView}>
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
                            <TextField fullWidth size="small" label='MobileNo' id='mobileNumber' name='mobileNumber' 
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
                </CardContent>
            </form>
        </Card>
    )
}
export default Customer