
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
    
    function handleView() {
        setView(false);
    }
    
    function handleBack() {
        setView(true);
    }

    return(
        <Container  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {view ? <CustomerEntry handleView={handleView}/>
                  : <CustomerList handleBack={handleBack} />  }
        </Container>
    )
}

// eslint-disable-next-line react/prop-types
const CustomerList=({handleBack})=>{

    const [displayData,setDisplayData]=useState([]);
    const baseURL="https://localhost:5001/api/Customer"

    useEffect(()=>{
        const fetchData=async ()=>{
            try {
                const response=await axios.get(baseURL);
                console.log(response.data);
                setDisplayData(response.data.rows)
            }catch(error){
                console.error("Error fetching data:",error)
            }
        }
        fetchData();
    },[])
    const column=[
        {
            field:'act',headerName: 'Action', flex: 0.5, align: 'center', headerAlign: 'center', minWidth: 150, sortable: false , headerClassName: 'headercol',
            renderCell:()=>(
                <ButtonGroup size="small">
                    <Tooltip title="EDIT" placement="left">
                        <IconButton color="info" sx={{paddingY:'0.5rem'}}>
                            <EditIcon/> 
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="DELETE" placement="right">
                        <IconButton color="error" sx={{paddingY:'0.5rem'}}>
                            <DeleteIcon/> 
                        </IconButton>
                    </Tooltip>
                </ButtonGroup>
            )
        },
        { field: 'customerName', headerName: 'Customer Name', flex: 1, minWidth: 150, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'address', headerName: 'Address', flex: 1, minWidth: 150,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'street', headerName: 'Street', flex: 1, minWidth: 150,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'city', headerName: 'City', flex: 1, minWidth: 100,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'pincode', headerName: 'Pincode', flex: 1, minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'mobileNumber', headerName: 'Mobile Number', flex: 1, minWidth: 150, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 150, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'outstandingAmount', headerName: 'Outstanding Amount', flex: 1, minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'outstandingLimit', headerName: 'OutstandingLimit Amount', flex: 1, minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
    ]

    return(
        <Card>
            <CardHeader 
                title="CUSTOMER LIST" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab size="small" color="primary" onClick={handleBack}><AddIcon/></Fab>
                        </Tooltip> }
                />
            <CardContent sx={{ margin: "auto", '& .headercol': { backgroundColor: 'gray', color: "white"} }}>
               <Box sx={{width:"85vw"}}>
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

// eslint-disable-next-line react/prop-types
const CustomerEntry=({handleView})=>{
    const baseURL="https://localhost:5001/api/Customer"
    const formik=useFormik({
        initialValues:{
            customername:"",
            address:"",
            street:'',
            city:'',
            pincode:'',
            mobileNumber:"",
            email:'',
            outstandingamount:'',
            outstandinglimit:'',
        },
        validationSchema:Yup.object({
            customername:Yup.string().required("Customer Name is Required"),
            address:Yup.string().required("Address is Required"),
            street:Yup.string().required("Street is Required"),
            city:Yup.string().required("City is Required"),
            pincode:Yup.string().required("Pincode is Required"),
            mobileNumber:Yup.string().required("Mobile Number is Required"),
            email:Yup.string().required("Email is Required"),
            outstandingamount:Yup.number().required("Outstanding Amount is Required"),
            outstandinglimit:Yup.number().required("Outstanding Limit is Required"),
        }),
        onSubmit:(values)=>{
            console.log(values)
            // axios.post(baseURL, {
            //     customername:"",
            //     address:"",
            //     street:'',
            //     city:'',
            //     pincode:'',
            //     mobileNumber:"",
            //     email:'',
            //     outstandingamount:'',
            //     outstandinglimit:'',
            // }).then(() => {
            //     console.log('added')
            // });
        }
    })


    return(
        <Card>
            <CardHeader title="CUSTOMER" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab variant="extended" size="small" color="primary" sx={{padding:'1em'}} onClick={handleView}>
                                {/* <CalendarViewDayIcon sx={{ mr: 2 }} /> */}
                                View
                            </Fab>
                        </Tooltip> }
            />
            <form className="myform" onSubmit={formik.handleSubmit}>
                <CardContent>
                    <div className="row">
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Customer Name' id='customername' name='customername'  
                                value={formik.values.customername} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.customername && Boolean(formik.errors.customername)}
                                helperText={formik.touched.customername && formik.errors.customername}     
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
                            <TextField fullWidth size="small" label='Outstanding Amount' id='outstandingamount' name='outstandingamount' 
                                value={formik.values.outstandingamount} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.outstandingamount && Boolean(formik.errors.outstandingamount)}
                                helperText={formik.touched.outstandingamount && formik.errors.outstandingamount}
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Outstanding Limit' id='outstandinglimit' name='outstandinglimit' 
                                value={formik.values.outstandinglimit} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.outstandinglimit && Boolean(formik.errors.outstandinglimit)}
                                helperText={formik.touched.outstandinglimit && formik.errors.outstandinglimit}
                            />
                        </div>
                    </div>
                    <div className="text-center text-md-end my-3">
                        <Button variant="contained" color="primary" sx={{marginX:'1em'}} type="submit">SAVE</Button>
                        <Button variant="contained" color="error" sx={{marginX:'1em'}}>CANCEL</Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}


export default Customer