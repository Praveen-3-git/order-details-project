/* eslint-disable react/prop-types */
import { Box,  ButtonGroup, Card, CardContent, CardHeader,  Fab,  Fade,  IconButton,   Snackbar,   Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from "react-router-dom";
import MuiAlert from '@mui/material/Alert';
import { useConfirm } from "material-ui-confirm";

//import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
const CustomerList=()=>{
    const baseURL="https://localhost:5001/api/Customer"
    const [displayData,setDisplayData]=useState([]);
    const [loading, setLoading] = useState(true); 
    const location = useLocation();
    const confirm=useConfirm();
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

    const fetchData=async ()=>{
        try {
            const response=await axios.get(baseURL);
            console.log(response.data);
            setDisplayData(response.data.rows)
        }catch(error){
            console.error("Error fetching data:",error)
        }finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchData();
        location.state && handleClick(location.state.status,location.state.color)
    },[])
    const column=[
        {
            field:'act',headerName: 'Action',align: 'center', headerAlign: 'center', minWidth: 80,flex:1, sortable: false ,disableColumnMenu:true, headerClassName: 'headercol',
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
        { field: 'customerName', headerName: 'Customer Name', minWidth: 120, flex:1.2, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'address', headerName: 'Address', minWidth: 100, flex:1.5,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'street', headerName: 'Street', minWidth: 100, flex:1,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'city', headerName: 'City', minWidth: 80, flex:0.5,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'pincode', headerName: 'Pincode', minWidth: 80, flex:0.5, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'mobileNumber', headerName: 'Mobile Number', minWidth: 150, flex:1, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'email', headerName: 'Email', minWidth: 100, flex:1.5, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'outstandingAmount', headerName: 'Outstanding Amount', minWidth: 100, flex:1, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'outstandingLimit', headerName: 'OutstandingLimit', minWidth: 100, flex:1, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
    ]
    function deletepost(r){
        confirm({description:`Are you sure to delete ${r.customerName}`})
            .then(()=>axios.delete(`${baseURL}/${r.customerId}`)
                .then(()=>{
                    handleClick("DELETED","success")
                    fetchData();
                })
            )
    }
    function getEditID(r){
        tocustomerEntry(r)
    }
    const navigate = useNavigate();

    const tocustomerEntry = (r) => {
        navigate("/customer/customerEntry", { state: r });
    };

    return(
        <Card>
            <CardHeader 
                title="CUSTOMER LIST" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab size="small" onClick={()=>tocustomerEntry("")} sx={{marginRight:'3em'}}><AddIcon/></Fab>
                        </Tooltip> }
                />
            <CardContent>
            <Box sx={{'& .headercol': { backgroundColor: 'gray', color: "white",fontSize:'1.15em'}}}>
                {loading 
                    ? (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src='src/assets/loading.gif'
                            alt='emptyfolder'
                            style={{ opacity: '0.5', pointerEvents: 'none', width: '9rem', height: '9rem' }}
                        ></img>
                        <Typography align='center'>LOADING ... </Typography>
                    </div>)
                    : displayData.length>0 
                        ?(<DataGrid
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
                        />)
                        :(<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src='src/assets/empty-folder.png'
                                alt='emptyfolder'
                                style={{ opacity: '0.5', pointerEvents: 'none', width: '9rem', height: '9rem' }}
                            ></img>
                            <Typography align='center'>NO RECORD FOUND</Typography>
                        </div>)
                }
                </Box>
                <Snackbar open={status.open} autoHideDuration={1000} TransitionComponent={Fade} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                        <MuiAlert severity={status.color} sx={{ width: '100%' }} variant="filled">
                            {status.text}
                        </MuiAlert>
                </Snackbar>
            </CardContent>
        </Card>
    )
}
export default CustomerList