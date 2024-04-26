import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'

type Props = {
  open: boolean
  headerMessage: string
  confirmMessage: string
  buttonString: string
  onClose?: (submit: boolean) => void
}

const ConfirmDialog: React.FC<Props> = ({open, headerMessage, confirmMessage, buttonString, onClose}: Props) => {
  const handleClose = (submit: boolean) => {
    onClose?.(submit)
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {headerMessage}
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {confirmMessage}
        </DialogContentText>
        <Button
          variant="contained"
          color="error"
          sx={{ width: '100%' }}
          onClick={() => handleClose(true)}
        >
          {buttonString}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog