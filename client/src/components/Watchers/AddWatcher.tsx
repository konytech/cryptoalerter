import { Box, Card, CardContent, Typography, TextField } from '@mui/material';
import React, { useState } from 'react';
import theme from '../../theme';

type Props = {
  addWatcher: (e: React.FormEvent, formData: Watcher | any) => void;
}

const AddWatcher: React.FC<Props> = ({ addWatcher }) => {
  const [formData, setFormData] = useState<Watcher | {}>()

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>Add watcher</Typography>
      <Card sx={{ width: { xl: '50%' }, backgroundColor: theme.colors.fourth }}>
        <CardContent>
          <form className='Form' onSubmit={(e) => addWatcher(e, formData)}>
            <div>
              <Box>
                <TextField sx={{ width: { xs: '100%', md: '80%' }, marginBottom: "8px" }}
                  required
                  id="outlined-required"
                  label="URL"
                  placeholder="https://"
                />
              </Box>
            </div>
            <button disabled={formData === undefined ? true : false} >Add Watcher</button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
};

export default AddWatcher;