import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'



interface AlertDialogProps
{
  message: string,
  open: boolean
}


const AlertDialog:React.FC<AlertDialogProps> = ({message,open})  => {
  return (
   <Dialog open={open}>
    <DialogTitle>attention!!</DialogTitle>
    <DialogContent>
      <Box sx={{width:{xs:'100%',md:'150px',lg:'350px'},height:'100px'}}>
          <Typography sx={{fontSize:{xs:'10px', sm:'20px','md':'30px'}}}>{message}</Typography>
      </Box>
    </DialogContent>
   </Dialog>
  )
}

export default AlertDialog