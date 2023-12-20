/* eslint-disable react/prop-types */
import { Box, ButtonGroup, Card, CardContent, CardHeader, Fab, IconButton, Tooltip, Typography } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CreditCardIcon from '@mui/icons-material/CreditCard';


const BillList = ({handleAdd,baseURL,getEditID,handleClick}) => {
    const [displayData,setDisplayData]=useState([]);
    const [loading, setLoading] = useState(true); 

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
    },[])
    const column=[
        {
            field:'act',headerName: 'ACTION',align: 'center', headerAlign: 'center', minWidth: 100,width:120, sortable: false ,disableColumnMenu:true, headerClassName: 'headercol', cellClassName:'actcell',
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
        { field: 'billNumber', headerName: 'BILL NUMBER ', minWidth: 100, flex:1, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'billDate', headerName: 'BILL DATE', minWidth: 100, flex:1, headerAlign: 'center', headerClassName: 'headercol',
            renderCell:(params)=>(
                (params.row.billDate).slice(0,10)
            )
        },
        { field: 'customerName', headerName: 'CUSTOMER NAME', minWidth: 100, flex:1, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'customerId', headerName: 'CUSTOMER ID', minWidth: 100, flex:1, align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'totalValue', headerName: 'TOTAL VALUE', minWidth: 100, flex:1, align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'totalTax', headerName: 'TOTAL TAX', minWidth: 100, flex:1, align:'right',  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'totalAmount', headerName: 'Total AMOUNT', minWidth: 100, flex:1, align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'isCredit', headerName: 'IS CREDIT', minWidth: 100, flex:1, align:'center', headerAlign: 'center', headerClassName: 'headercol',
            renderCell:(params)=>(
                (params.row.isCredit 
                    ? <Tooltip title="Credit" placement="right"><CreditCardIcon color="primary"/></Tooltip>
                    : <Tooltip title="Cash" placement="right"><CurrencyRupeeIcon color="success"/></Tooltip>
                )
            )
        },
    ]
    function deletepost(r){
        if(confirm("Are you want to delete")==true){
            axios.delete(`${baseURL}/${r.billId}`)
                .then(()=>{
                    handleClick("DELETED","success")
                    fetchData();
                })
        }
    }
  return (
    <>
       <Card>
            <CardHeader 
                title="BILL LIST" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab size="small" onClick={handleAdd}><AddIcon/></Fab>
                        </Tooltip> }
                />
            <CardContent>
                <Box sx={{'& .headercol': { backgroundColor: 'gray', color: "white",fontSize:'1.1em'}}}>
                    {loading 
                        ?(<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src='src/assets/loading.gif'
                                alt='emptyfolder'
                                style={{ opacity: '0.5', pointerEvents: 'none', width: '9rem', height: '9rem' }}
                            ></img>
                            <Typography align='center'>LOADING ... </Typography>
                        </div>)
                        :displayData.length>0 
                            ?(<DataGrid
                                rows={displayData} columns={column} disableRowSelectionOnClick
                                getRowId={(row) => row.billId} 
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
            </CardContent>
        </Card>
    </>
  )
}

export default BillList