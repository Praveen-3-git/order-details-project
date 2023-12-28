/* eslint-disable react/prop-types */
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Fab, Fade, IconButton, Snackbar, TextField, Tooltip, Typography } from "@mui/material"
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MuiAlert from '@mui/material/Alert';
import { useConfirm } from "material-ui-confirm";
const Item=()=>{
    const [view,setView]=useState(false);
    const [editid,setEditid]=useState('')

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

    const baseURL="https://localhost:5001/api/Item"
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
        <Container maxWidth='xl'>
            {view ? <ItemEntry handleView={handleView} editid={editid}  closeEditid={closeEditid} baseURL={baseURL} handleClick={handleClick} handleClose={handleClose} status={status} />
                  : <ItemList handleAdd={handleAdd} getEditID={getEditID} baseURL={baseURL} handleClick={handleClick}/>  }
                  {status.open && (<Snackbar open={status.open} autoHideDuration={1000} TransitionComponent={Fade} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                        <MuiAlert severity={status.color} sx={{ width: '100%' }} variant="filled">
                            {status.text}
                        </MuiAlert>
                    </Snackbar>)}
                  
        </Container>
    )
}


const ItemList=({handleAdd,getEditID,baseURL,handleClick})=>{
    const [displayData,setDisplayData]=useState([]);
    const [loading, setLoading] = useState(true); 
    const confirm=useConfirm();
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
            field:'act',headerName: 'ACTION',align: 'center', headerAlign: 'center',flex:1, minWidth: 100,width:120, sortable: false,disableColumnMenu:true , headerClassName: 'headercol',
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
        { field: 'itemCode', headerName: 'ITEM CODE', flex:1, minWidth: 150, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'itemName', headerName: 'ITEM NAME', flex:1, minWidth: 200,  headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'stock', headerName: 'STOCK', flex:1, minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'rate', headerName: 'RATE', flex:1, minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'gstRate', headerName: 'GSTRATE', flex:1, minWidth: 100, align: 'right', headerAlign: 'center', headerClassName: 'headercol',},
    ]
    function deletepost(r){
        confirm({description:`Are you sure to delete ${r.itemName} ${r.itemCode}`})
            .then(()=>axios.delete(`${baseURL}/${r.itemId}`)
                .then(()=>{
                    handleClick("DELETED","success")
                    fetchData();
                })
            ).catch(() => console.log("Deletion cancelled."));
    }
    return(
        <Card>
            <CardHeader 
                title="ITEM LIST" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab size="small" onClick={handleAdd}><AddIcon/></Fab>
                        </Tooltip>}
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
                        : displayData.length>0 
                            ?(<DataGrid
                                rows={displayData} columns={column} disableRowSelectionOnClick
                                getRowId={(row) => row.itemId} 
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
    )
}
const ItemEntry=({handleView,editid,baseURL,handleClick})=>{
    const formik=useFormik({
        initialValues:{
            itemCode:editid?editid.itemCode:'',
            itemName:editid?editid.itemName:'',
            stock:editid?editid.stock:'',
            rate:editid?editid.rate:'',
            gstRate:editid?editid.gstRate:'',
        },
        validationSchema:Yup.object({
            itemCode:Yup.string().required("Item Code is Required"),
            itemName:Yup.string().required("Item Name is Required"),
            stock:Yup.number().required("Stock is Required"),
            rate:Yup.number().required("Rate is Required"),
            gstRate:Yup.number().required("GST rate is Required"),
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
            itemCode:values.itemCode,
            itemName:values.itemName,
            stock:values.stock,
            rate:values.rate,
            gstRate:values.gstRate,
        }).then(() => {
            console.log('added')
            handleClick("Added","success")
            document.getElementById("viewBTN").click() 
        });
    }
    function editPost(values){
        console.log(editid.Id)
        axios
            .patch(baseURL, {
                itemId:editid.itemId,
                itemCode:values.itemCode,
                itemName:values.itemName,
                stock:values.stock,
                rate:values.rate,
                gstRate:values.gstRate,
            })
            .then((response) => {
                console.log(response)
                handleClick("Updated","success")
                document.getElementById("viewBTN").click() 
            })
            .catch((error) => {
                console.error('Error editing post:', error);
            });
    }
    function cancelBtn(){
        formik.handleReset
        document.getElementById('viewBTN').click()         
    }
    return(
        <Card>
            <CardHeader title="ITEM" 
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab variant="extended" size="small" id="viewBTN" color="primary" sx={{padding:'1em'}} onClick={handleView}>
                                View
                            </Fab>
                        </Tooltip> }
            /> 
            <form className="myitemform" onSubmit={formik.handleSubmit}>
                <CardContent>
                    <div className="row">
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Item Code' id='itemCode' name='itemCode'  
                                value={formik.values.itemCode} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.itemCode && Boolean(formik.errors.itemCode)}
                                helperText={formik.touched.itemCode && formik.errors.itemCode}     
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Item Name' id='itemName' name='itemName'  
                                value={formik.values.itemName} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.itemName && Boolean(formik.errors.itemName)}
                                helperText={formik.touched.itemName && formik.errors.itemName}     
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Stock' id='stock' name='stock' type="number" 
                                value={formik.values.stock} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.stock && Boolean(formik.errors.stock)}
                                helperText={formik.touched.stock && formik.errors.stock}     
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='Rate' id='rate' name='rate' type="number"
                                value={formik.values.rate} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.rate && Boolean(formik.errors.rate)}
                                helperText={formik.touched.rate && formik.errors.rate}     
                            />
                        </div>
                        <div className="col-sm-4 my-3">
                            <TextField fullWidth size="small" label='GST Rate' id='gstRate' name='gstRate' type="number" 
                                value={formik.values.gstRate} onChange={formik.handleChange}  onBlur={formik.handleBlur}
                                error={formik.touched.gstRate && Boolean(formik.errors.gstRate)}
                                helperText={formik.touched.gstRate && formik.errors.gstRate}     
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
export default Item