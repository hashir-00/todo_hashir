import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';


interface State extends SnackbarOrigin {
  open: boolean;
}


const PositionedSnackbar=()=> {
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const buttons = (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleClick({ vertical: 'top', horizontal: 'center' })}>
          Top-Center
        </Button>
      </Box>
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <Button onClick={handleClick({ vertical: 'top', horizontal: 'left' })}>
            Top-Left
          </Button>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Button onClick={handleClick({ vertical: 'top', horizontal: 'right' })}>
            Top-Right
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })}>
            Bottom-Left
          </Button>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })}>
            Bottom-Right
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'center' })}>
          Bottom-Center
        </Button>
      </Box>
    </React.Fragment>
  );

  return (
    <Box sx={{ width: 500 }}>
      {buttons}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key={vertical + horizontal}
      />
    </Box>
  );
}



const BasicButtons=()=> {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained">Mark as done</Button>
      
    </Stack>
  );
}
const IconLabelButtons =()=>  {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" startIcon={<DeleteIcon />}>
        Delete
      </Button>
   
    </Stack>
  );
}




const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

 const Checkboxes=()=> {
  return (
    <div>
  
      <Checkbox {...label} />
  
    </div>
  );
}


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const RowAndColumnSpacing=()=> {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
        <Grid item xs={12}>
          <Item></Item>
          
        </Grid>
       
        
        
      </Grid>
    </Box>
  );
}



const Items= styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const BasicStack=()=> {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Items>Item1 1</Items>
        
      </Stack>
    </Box>
  );


interface State extends SnackbarOrigin {
  open: boolean;
}


}




export{BasicButtons,IconLabelButtons,Checkboxes,RowAndColumnSpacing,BasicStack,PositionedSnackbar}