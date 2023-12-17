import { Button, Card, CardContent, CardHeader, Container, Fab, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material"

const Bill=()=>{
    return(
        <>
            <Container maxWidth='xl'>
                <BillEntry/>
            </Container>
        </>
    )
}

export default Bill

const BillEntry=()=>{
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    return(
        <>
        <Card className="my-2">
            <CardHeader 
                title="BILLING SERVICES"
                action={<Tooltip title="View" placement="top" arrow>
                            <Fab variant="extended" size="small" id="viewBTN" color="primary" sx={{padding:'1em'}} >
                                View
                            </Fab>
                        </Tooltip> }
            />
            <CardContent>
                <form id="form1">
                <div className="row">
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Customer Name' id='customerName' name='customerName'
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Bill Number' id='billNumber' name='billNumber'
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth label='Bill Number' id='billNumber' name='billNumber' multiline rows={3}
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Bill Date' id='billDate' name='billDate'
                            type="date" value={todayDate} inputProps={{max: todayDate}}
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Outstanding Amount' id='outstandingAmount' name='outstandingAmount'
                        />
                    </div>
                    <div className="col-sm-6 my-2 row">
                        <div className="col-sm-5" >
                            <FormLabel id="paymentRadioLabel" sx={{marginTop:'0.6rem',paddingLeft:'1rem'}}>Payment Mode</FormLabel>
                        </div>
                        <div className="col-sm-7">
                            <RadioGroup row aria-labelledby="paymentRadioLabel" name="paymentRadio">
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Outstanding Limit' id='outstandingLimit' name='outstandingLimit'
                        />
                    </div>
                    <div className="col-sm-6 my-2">
                        <TextField fullWidth size="small" label='Total Amount' id='totalAmount' name='totalAmount'
                        />
                    </div>
                    <div className="text-end my-2">
                        <Button variant="contained">SAVE</Button>
                    </div>
                </div>
                </form>
            </CardContent>
        </Card>
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
                        <Button variant="contained" sx={{marginX:'1em'}}>ADD</Button>
                        <Button variant="contained" sx={{marginX:'1em'}}>CANCEL</Button>
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
                            <TableRow sx={{backgroundColor:'gray'}}>
                                <TableCell sx={{color:'white'}}>Item Name</TableCell>
                                <TableCell sx={{color:'white'}}>Quantity</TableCell>
                                <TableCell sx={{color:'white'}}>Rate</TableCell>
                                <TableCell sx={{color:'white'}}>Value</TableCell>
                                <TableCell sx={{color:'white'}}>GST %</TableCell>
                                <TableCell sx={{color:'white'}}>GST Value</TableCell>
                                <TableCell sx={{color:'white'}}>Total</TableCell>
                                <TableCell sx={{color:'white'}}>Action</TableCell>
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
                    <Button type="reset" size="small" variant="contained" color="error" >CLEAR</Button>
                </div>
                </form>
            </CardContent>
        </Card>
        </>
    )
}