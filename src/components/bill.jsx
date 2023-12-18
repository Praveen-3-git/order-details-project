/* eslint-disable react/prop-types */
import { Autocomplete, Button, Card, CardContent, CardHeader, Container, Fab, FormControlLabel, FormLabel, Radio, RadioGroup, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material"
import BillList from "./billList";
import { useEffect, useState } from "react";
import axios from "axios";
const Bill=()=>{
    const [view,setView]=useState(true);
    const [editid,setEditid]=useState('')
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
            {view ? <BillEntry handleView={handleView}  baseURL={baseURL} editid={editid}  closeEditid={closeEditid}/>
                  : <BillList handleAdd={handleAdd} baseURL={baseURL} getEditID={getEditID}/>  }
        </Container>
        </>
    )
}
export default Bill

const BillEntry=({handleView,editid})=>{
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const customerAPI="https://localhost:5001/api/Customer"
    const [customerdata,setcustomerdata]=useState([])
    const [selectedCustomer,setSelectedCustomer]=useState('');
    const [autoBillnumber,setAutoBillnumber]=useState(editid?editid.billNumber:'')
    const [billdata,setbilldata]=useState('')
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
    const billAPI='https://localhost:5001/api/Bill'
    const fetchcustomerData=async ()=>{
        try {
            const response=await axios.get(customerAPI);
            //console.log(response.data);
            setcustomerdata(response.data.rows)
            //console.log(response.data.rows)
            if(editid){
                console.log(editid)
                let cd=(response.data.rows).find(item=> item.customerId==editid.customerId);
                setSelectedCustomer(cd)
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
    const fetchbillData=async ()=>{
        try {
            const response=await axios.get(billAPI);
            //console.log(response.data);
            // console.log(response.data.rows)
            setbilldata(response.data.rows)
        }catch(error){
            console.error("Error fetching data:",error)
        }
    }
    useEffect(()=>{
        fetchcustomerData();
        generateBillnumber();
        fetchbillData();
    },[])
    function customerselection(value){
        setSelectedCustomer(value)
        setFormValues((prevValues) => ({
            ...prevValues,
            customerId: value?.customerId || 0,
            customerName:value?.customerName|| '' ,
            billNumber:document.getElementById("billNumber").value,
            billDate:document.getElementById("billDate").value,
        }));
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
            .then(() => {
            console.log('added')
            // document.getElementById("viewBTN").click() 
            fetchcustomerData()
        });
    }
    function editpost(){
        console.log('Form Values:', formValues);
        console.log(formValues)
        axios.post(billAPI, {billId: editid.billId,...formValues})
            .then(() => {
            console.log('edited')
            // document.getElementById("viewBTN").click() 
        });
    }

    function savecheck(){
        
        if(billdata && billdata.find(item=>item.billNumber==autoBillnumber))
            return true
        else
            return false 
    }
    return(
        <>
        <Card className="my-2">
            <CardHeader 
                title="BILLING SERVICES"
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab variant="extended" size="small" id="viewBTN" color="primary" sx={{padding:'1em'}} onClick={handleView} >
                                View
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
                            value={selectedCustomer ? selectedCustomer : null}
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
                            value={selectedCustomer ? (selectedCustomer.outstandingAmount):""}
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
                        <TextField fullWidth size="small" label='Total Amount' id='totalAmount' name='totalAmount'
                            onChange={(e) => {
                                setFormValues((prevValues) => ({
                                  ...prevValues,
                                  totalAmount: e.target.value,
                                }));
                              }}
                        />
                    </div>
                    <div className="text-end my-2">
                        <Button variant="contained" type="submit">SAVE</Button>
                    </div>
                </div>
                </form>
            </CardContent>
        </Card>
        {savecheck() && (
            <>
                <Card className="my-2">
                    <CardContent>
                        <form id="form2">
                        <div className="row">
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='Item Code' id='itemCode' name='itemCode'
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='Item Name' id='itemName' name='itemName'  
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='Rate' id='rate' name='rate' type="number"
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='Quantity' id='quantity' name='quantity' type="number"
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='Value' id='value' name='value' type="number"
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='GST %' id='gstp' name='gstp' type="number"
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='GST Value' id='gstv' name='gstv' type="number"
                                />
                            </div>
                            <div className="col-sm-2 my-2">
                                <TextField fullWidth size="small" label='Total Amount' id='totalValue' name='totalValue' type="number"
                                />
                            </div>
                            <div className="text-end my-2">
                                <Button variant="contained" color="success" sx={{marginX:'1em'}}>ADD</Button>
                                <Button variant="contained" color="error" type="reset" sx={{marginX:'1em'}}>CANCEL</Button>
                            </div>
                        </div>
                        </form>
                    </CardContent>
                </Card>
                <Card className="my-2">
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor:'#333232'}}>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>Item Name</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>Quantity</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>Rate</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>Value</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>GST %</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>GST Value</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>Total</TableCell>
                                        <TableCell sx={{color:'white',fontWeight:'bold'}}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                <Card className="my-2">
                    <CardContent>
                        <form id="form3">
                        <div className="row">
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total Value' id='value' name='value' type="number"
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total GST Value' id='totalGst' name='totalGst' type="number"
                                />
                            </div>
                            <div className="col-sm-3 my-2">
                                <TextField fullWidth size="small" label='Total Amount' id='amount' name='amount' type="number"
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