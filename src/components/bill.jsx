/* eslint-disable react/prop-types */
import { Autocomplete, Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Fab, Fade, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Snackbar, TextField, Tooltip } from "@mui/material"
import BillList from "./billList";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MuiAlert from '@mui/material/Alert';
import { useConfirm } from "material-ui-confirm";
import CloseIcon from '@mui/icons-material/Close';
const Bill=()=>{
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
        setstatus({ open: false,...newstatus });
    };

    const baseURL='https://localhost:5001/api/Bill'
    function handleView() {
        setView(false);
        closeEditid();
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
        <> 
            <Container maxWidth='xl'>
            {view ? <BillEntry handleView={handleView}  baseURL={baseURL} editid={editid}  closeEditid={closeEditid} handleClick={handleClick}/>
                  : <BillList handleAdd={handleAdd} baseURL={baseURL} getEditID={getEditID} handleClick={handleClick}/>  }
                    {status.open && (<Snackbar open={status.open} autoHideDuration={3000} TransitionComponent={Fade} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                        <MuiAlert severity={status.color} sx={{ width: '100%' }} variant="filled">
                            {status.text}
                        </MuiAlert>
                    </Snackbar>) }
        </Container>
        </>
    )
}
export default Bill

const BillEntry=({handleView,editid,handleClick})=>{
    const confirm=useConfirm();
    const todayDate =  editid  ? editid.billDate.split('T')[0] : new Date().toISOString().split('T')[0]
    
    const customerAPI="https://localhost:5001/api/Customer"
    const billAPI='https://localhost:5001/api/Bill'

    const [customerdata,setcustomerdata]=useState([])
    const [selectedCustomer,setSelectedCustomer]=useState('');
    const [outamount,setoutamount]=useState("")

    const [autoBillnumber,setAutoBillnumber]=useState(editid?editid.billNumber:'')
    const [billdata,setbilldata]=useState('');
    const [billId,setbillId]=useState(editid?editid.billId:'')
    
    const [itemdata,setitemdata]=useState('');
    const [edititemid,setedititemid]=useState('')
    const [selecteditem,setselecteditem]=useState('')
    const [iquantity,setiquantity]=useState('')
    const [ivalue,setivalue]=useState("")
    const [igstvalue,setigstvalue]=useState('')
    
    const [billdetaildata,setbilldetaildata]=useState('')

    const [formValues, setFormValues] = useState({
        billNumber:"",
        billDate: "",
        totalValue: 0,
        totalTax: 0,
        totalAmount: 0,
        customerId: 0,
        customerName:"",
        isCredit: true
      });
    const [saved,setsaved]=useState(false)

    const fetchcustomerData=async ()=>{
        try {
            const response=await axios.get(customerAPI);
            //console.log(response.data);
            setcustomerdata(response.data.rows)
            //console.log(response.data.rows)
            if(editid){
                console.log(editid)
                let cd=(response.data.rows).find(item=> item.customerId==editid.customerId);
                console.log(cd)
                setSelectedCustomer(cd)
                setoutamount(cd.outstandingAmount)

            }
        }catch(error){
            console.error("Error fetching data:",error)
        }
    }
    const generateBillnumber=async()=>{
        try{
            if(autoBillnumber!='')
                return
            const response=await axios.get("https://localhost:5001/api/Bill/BillNumber");
            //console.log(response.data)
            setAutoBillnumber(response.data.billNumber)
        }catch(error){
            console.error("Error Fetching Data:",error)
        }
    }
    const fetchbillData=async (billnumber)=>{
        try {
            const response=await axios.get(billAPI);
            //console.log(response.data);
            // console.log(response.data.rows)
            setbilldata(response.data.rows)
            if(billnumber){
                let b=response.data.rows.find(item => item.billNumber==billnumber)
                setbillId(b.billId)
            }
        }catch(error){
            console.error("Error fetching data:",error)
        }
    }
    const fetchitemData=async ()=>{
        try {
            const response=await axios.get("https://localhost:5001/api/Item");
            //console.log(response.data);
            // console.log(response.data.rows)
            setitemdata(response.data.rows)
        }catch(error){
            console.error("Error fetching data:",error)
        }
    }
    const fetchbilldetaildata=async ()=>{
        try {
            const response = await axios.get("https://localhost:5001/api/BillDetails", {
                params: { billId: billId }
            });
            //console.log(response.data);
            //console.log(response.data.rows)
            setbilldetaildata(response.data.rows)
        }catch(error){
            console.error("Error fetching data:",error)
        }
    }

    useEffect(()=>{
        fetchcustomerData();
        generateBillnumber();
        fetchbillData();
        fetchitemData();
        if(billId)
            fetchbilldetaildata();
        if(edititemid){
            let a=itemdata.find(i=> i.itemId==edititemid.itemId) 
            console.log(edititemid)
            setselecteditem(a)
            setiquantity(edititemid.quantity)
            setivalue(edititemid.billValue)
            setigstvalue(edititemid.gstValue)
        }
    },[saved,edititemid])
    function customerselection(value){
        setSelectedCustomer(value)
        setoutamount(value?value.outstandingAmount:'')
        setFormValues((prevValues) => ({
            ...prevValues,
            customerId: value?.customerId || 0,
            customerName:value?.customerName|| '' ,
            billNumber:document.getElementById("billNumber").value,
            billDate:document.getElementById("billDate").value,
        }));
    }
    function itemselection(value){
        setselecteditem(value)
        setiquantity("")
        setivalue('')
        setigstvalue('')
        focustextbox()
    }
    function focustextbox(){
        const x=document.getElementById('quantity');
        x.focus(); 
    }
    function savebillPost(e){
        e.preventDefault();
        if(editid){
            editpost()
            console.log("edit")
        }else{ 
            addpost()
            console.log("add")
        }
    }
    function addpost(){
        console.log('Form Values:', formValues);
        axios.post(billAPI, formValues)
            .then((response) => {
            console.log('added')
            handleClick("Added","success")
            fetchbillData(response.data.billNumber)
            setsaved(true)
        });
    }
    function editpost(){
        console.log('Form Values:', formValues);
        console.log(formValues)
        axios.post(billAPI, {billId:editid.billId,...formValues})
            .then(() => {
            console.log('edited')
            handleClick("Updated","success")
        });
    }
    function savecheck(){
        if(billdata && billdata.find(item=>item.billNumber==autoBillnumber))
            return true
        else
            return false
    }
    function quantitychange(e){
        let iq=e.target.value
        setiquantity(iq)
        let iv=((iq) * (selecteditem ? selecteditem.rate : 0))
        setivalue(iv)
        let igstv=(iq) * (selecteditem ? selecteditem.rate : 0)*(selecteditem?selecteditem.gstRate:0)/100
        setigstvalue(igstv)
    }
    function itemadd(e){
        e.preventDefault();
        console.log(billId)
        console.log(autoBillnumber)
        const itemform={
            billDetailId:edititemid?edititemid.billDetailId:0,
            billId: billId,
            billNumber: autoBillnumber,
            itemId: selecteditem.itemId,
            itemCode: document.getElementById('itemCode').value,
            itemName: document.getElementById('itemName').value,
            stock:selecteditem.stock,
            quantity: document.getElementById('quantity').value,
            rate: document.getElementById('rate').value,
            billValue: document.getElementById('value').value,
            gstPercent: document.getElementById('gstp').value,
            gstValue: document.getElementById('gstv').value,
            amount: document.getElementById('totalValue').value,
        }
        console.log(itemform)
        if(edititemid){
            console.log('edititem')
            axios.patch("https://localhost:5001/api/BillDetails",itemform)
            .then((response) => {
                console.log('edited bill details')
                console.log(response)
                if(response.data.status=="Saved SuccessFully"){
                    handleClick("Updated items","info")
                    fetchcustomerData()
                }else{
                    handleClick(response.data.status,"error")
                }
                setselecteditem(null);
                setiquantity('');
                setivalue('')
                setigstvalue('')
                fetchbilldetaildata()
                setedititemid('')
                
            }).catch((error) => {
                console.error('Error Updating bill details:', error.message);
                handleClick("Failed to Update items", "error");
            });
        }else{
            console.log('additem')
            axios.post("https://localhost:5001/api/BillDetails",itemform)
            .then((response) => {
                console.log('added bill details')
                console.log(response)
                if(response.data.status=="Saved SuccessFully"){
                    handleClick("Added items","info")
                    fetchcustomerData()
                }else{
                    handleClick(response.data.status,"error")
                }
                setselecteditem(null);
                setiquantity('');
                setivalue('')
                setigstvalue('')
                fetchbilldetaildata()
                setedititemid('')
                
            }).catch((error) => {
                console.error('Error adding bill details:', error.message);
                handleClick("Failed to add items", "error");
            });
        }
    }   
    const column=[
        { field: 'itemName', headerName: 'Item Name ',flex:1.5, minWidth: 100, headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'quantity', headerName: 'Quantity ',flex:1 , minWidth: 100,align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'rate', headerName: 'Rate ',flex:1 , minWidth: 100, align:'right',headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'billValue', headerName: 'Value ',flex:1 , minWidth: 100,align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'gstPercent', headerName: 'GST % ',flex:1 , minWidth: 100,align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'gstValue', headerName: 'GST Value ',flex:1 , minWidth: 100,align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'amount', headerName: 'Total Value ',flex:1 , minWidth: 100,align:'right', headerAlign: 'center', headerClassName: 'headercol',},
        { field: 'act', headerName: 'Action ',flex:1 , minWidth: 100,align:'center', headerAlign: 'center', headerClassName: 'headercol', sortable: false ,disableColumnMenu:true,
        renderCell:(params)=>(
            <ButtonGroup size="small">
                <Tooltip title="EDIT" placement="left">
                    <IconButton color="info" sx={{paddingY:'0.5rem'}} onClick={()=> getitemEditID(params.row)}>
                        <EditIcon/> 
                    </IconButton>
                </Tooltip>
                <Tooltip title="DELETE" placement="right">
                    <IconButton color="error" sx={{paddingY:'0.5rem'}} onClick={()=> deleteitem(params.row)} >
                        <DeleteIcon/> 
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        )
        },
    ]
    function getitemEditID(row){
        console.log(row)
        setedititemid(row)
    }
    function deleteitem(r){
        confirm({description:`Are you sure to delete ${r.itemName} ${r.itemCode}`})
            .then(()=>axios.delete(`https://localhost:5001/api/BillDetails/${r.billDetailId}`)
                .then(()=>{
                    fetchbilldetaildata();
                    fetchcustomerData();
                    handleClick("Removed items","info")
                })
            ).catch(() => console.log("Deletion cancelled."));
        
    }
    function itemselectioncancel(){
        setselecteditem(null);
        setiquantity('');
        setivalue('')
        setigstvalue('')
        fetchbilldetaildata()
        setedititemid('')
    }
    
    return(
        <>
        <Card className="my-2">
            <CardHeader 
                title="BILLING SERVICES"
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab size="small" id="viewBTN" sx={{padding:'1em'}} onClick={handleView} >
                                <CloseIcon/>
                            </Fab>
                        </Tooltip> }
            />
            <CardContent>
                <form id="form1" onSubmit={savebillPost}>
                <div className="row">
                    <div className="col-sm-6 my-2">
                        {/* <TextField fullWidth size="small" label='Customer Name' id='customerName' name='customerName'
                        /> */}
                        <Autocomplete fullWidth size="small" disablePortal options={customerdata} getOptionKey={(option) => option.customerId} getOptionLabel={(option) => option.customerName}
                            value={selectedCustomer ? selectedCustomer : null} readOnly={editid?true:false}
                            onChange={(e,value)=>{
                                console.log(value)
                                customerselection(value)
                            }}
                             renderInput={(params) => (
                                <TextField
                                  label="Customer Name" required
                                  {...params}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.customerId === value.customerId}
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Bill Number' id='billNumber' name='billNumber' required InputProps={{readOnly:true}}
                            value={autoBillnumber}
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth label='Customer Details' id='customerDetails' name='customerDetails' multiline rows={3} required InputProps={{readOnly:true}}
                            value={selectedCustomer ? (selectedCustomer.address +"\n"+ selectedCustomer.street +"\n"+ selectedCustomer.city +" "+ selectedCustomer.pincode):"" }
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Bill Date' id='billDate' name='billDate' required InputProps={{readOnly:true}}
                            type="date" value={todayDate} inputProps={{max: todayDate}}
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Outstanding Amount' id='outstandingAmount' name='outstandingAmount' required InputProps={{readOnly:true}}
                            //value={selectedCustomer?selectedCustomer.outstandingAmount:""}
                            value={outamount}
                        />
                    </div>
                    <div className="col-sm-6 my-2 row">
                        <div className="col-sm-5" >
                            <FormLabel id="paymentRadioLabel" sx={{marginTop:'0.6rem',paddingLeft:'1rem'}}>Payment Mode</FormLabel>
                        </div>
                        <div className="col-sm-7">
                            <RadioGroup row aria-labelledby="paymentRadioLabel" id="paymentRadio" name="paymentRadio" value={formValues.isCredit ? "1":"0"} 
                                onChange={(e) => {
                                    setFormValues((prevValues) => ({
                                      ...prevValues,
                                      isCredit: e.target.value=="1" ? true: false,
                                    }));
                                  }}
                            >
                                <FormControlLabel value="1" control={<Radio />} sx={{marginX:'1em'}} label="Credit" />
                                <FormControlLabel value="0" control={<Radio />} sx={{marginX:'1em'}} label="Cash" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Outstanding Limit' id='outstandingLimit' name='outstandingLimit' required InputProps={{readOnly:true}}
                            value={selectedCustomer ? (selectedCustomer.outstandingLimit):''}
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Total Amount' id='totalAmount' name='totalAmount' required InputProps={{readOnly:true}} sx={{pointerEvents:'none'}}
                            value={billdetaildata && billdetaildata.reduce((sum,acc)=>sum+acc.amount,0)}
                        />
                    </div>
                    <div className="text-end my-2">
                        <Button variant="contained" type="submit">SAVE</Button>
                    </div>
                </div>
                </form>
            </CardContent>
        </Card>
        {(saved || savecheck()) && (
            <>
                <Card className="my-2">
                    <CardContent>
                        <form id="form2" onSubmit={itemadd}>
                        <div className="row">
                            <div className="col-sm-3 my-2">
                                <Autocomplete fullWidth size="small" id="itemCode"
                                    disablePortal options={itemdata} getOptionKey={(option) => option.itemId} getOptionLabel={(option) => option.itemCode}
                                    value={selecteditem ? selecteditem : null}
                                    onChange={(e,value)=>{
                                        console.log(value)
                                        itemselection(value)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            label="Item Code" required
                                            {...params}
                                            />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.itemId === value.itemId}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <Autocomplete fullWidth size="small" id="itemName"
                                    disablePortal options={itemdata} getOptionKey={(option) => option.itemId} getOptionLabel={(option) => option.itemName}
                                    value={selecteditem ? selecteditem : null}
                                    onChange={(e,value)=>{
                                        console.log(value)
                                        itemselection(value)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            label="Item Name" required
                                            {...params}
                                            />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.itemId === value.itemId}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Rate' id='rate' name='rate' type="number"  InputProps={{readOnly:true}}
                                    value={selecteditem ? selecteditem.rate:""}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Quantity' id='quantity' name='quantity' type="number" required 
                                    value={iquantity}  onChange={quantitychange}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Value' id='value' name='value' type="number" InputProps={{readOnly:true}}
                                    value={ivalue}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='GST %' id='gstp' name='gstp' type="number" InputProps={{readOnly:true}}
                                    value={selecteditem ? selecteditem.gstRate:""}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='GST Value' id='gstv' name='gstv' type="number" InputProps={{readOnly:true}}
                                    value={igstvalue}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total Amount' id='totalValue' name='totalValue' type="number" InputProps={{readOnly:true}}
                                    value={ivalue+igstvalue}
                                />
                            </div>
                            <div className="text-end my-2">
                                {edititemid 
                                    ? (<Button variant="contained" color="info" sx={{marginX:'1em'}} type="submit">ADD</Button>)
                                    : (<Button variant="contained" color="success" sx={{marginX:'1em'}} type="submit">ADD</Button>) }
                                <Button variant="contained" color="error" type="reset" sx={{marginX:'1em'}} onClick={itemselectioncancel}>CANCEL</Button>
                            </div>
                        </div>
                        </form>
                    </CardContent>
                </Card>
                <Card className="my-2">
                    <CardContent>
                    <Box sx={{'& .headercol': { backgroundColor: 'gray', color: "white",fontSize:'1.1em'}}}>
                    {billdetaildata.length>0 && (
                        <DataGrid
                            rows={billdetaildata} columns={column} disableRowSelectionOnClick
                            getRowId={(row) => row.billDetailId} 
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
                    )}
                </Box>
                    </CardContent>
                </Card>
                <Card className="my-2">
                    <CardContent>
                        <form id="form3">
                        <div className="row">
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total Value' id='value' name='value' type="number" InputProps={{readOnly:true}} sx={{pointerEvents:'none'}}
                                    value={billdetaildata && billdetaildata.reduce((sum,acc)=>sum+acc.billValue,0)}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total GST Value' id='totalGst' name='totalGst' type="number" InputProps={{readOnly:true}} sx={{pointerEvents:'none'}}
                                    value={billdetaildata && billdetaildata.reduce((sum,acc)=>sum+acc.gstValue,0)}
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total Amount' id='amount' name='amount' type="number"  InputProps={{readOnly:true}} sx={{pointerEvents:'none'}}
                                    value={billdetaildata && billdetaildata.reduce((sum,acc)=>sum+acc.amount,0)}
                                />
                            </div>
                        </div>
                        <div className="text-end">
                            <Button type="reset" variant="contained" color="error" >CLEAR</Button>
                        </div>
                        </form>
                    </CardContent>
                </Card>
            </>
        )}
        
        </>
    )
}