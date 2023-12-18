/* eslint-disable react/prop-types */
import { Box, ButtonGroup, Card, CardContent, CardHeader, Fab, IconButton, Tooltip } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";


const BillList = ({handleAdd,baseURL,getEditID}) => {
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
            field:'act',headerName: 'ACTION',align: 'center', headerAlign: 'center', minWidth: 120, sortable: false ,disableColumnMenu:true, headerClassName: 'headercol',
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
        { field: 'billNumber', headerName: 'BILL NUMBER ', minWidth: 150, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'billDate', headerName: 'BILL DATE', minWidth: 200,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'totalValue', headerName: 'TOTAL VALUE', minWidth: 150, align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'totalTax', headerName: 'TOTAL TAX', minWidth: 100, width:150, align:'right',  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'totalAmount', headerName: 'Total AMOUNT', minWidth: 150, align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'customerId', headerName: 'CUSTOMER ID', minWidth: 200,align:'center', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'isCredit', headerName: 'IS CREDIT', minWidth: 150, align:'center',headerAlign: 'center', headerClassName: 'headercol',},
    ]
    function deletepost(r){
        axios.delete(`${baseURL}/${r.billId}`)
            .then(()=>{
                alert("Post Deleted!")
                fetchData();
            })
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
                    <DataGrid
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
                    />
                </Box>
            </CardContent>
        </Card>
    </>
  )
}

export default BillList