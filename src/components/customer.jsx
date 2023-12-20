import { Container} from "@mui/material";
import { Outlet } from "react-router-dom";

const Customer=()=>{
    return(
        <Container maxWidth='xl'>
            <Outlet/>   
        </Container>
    )
}

export default Customer