import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
  Box,
  Typography,
} from '@mui/material';

const reportOptions = [
  { category: 'Hate', description: 'Slurs, Racist or sexist stereotypes, Dehumanization, Incitement of fear or discrimination, Hateful references, Hateful symbols & logos' },
  { category: 'Abuse & Harassment', description: 'Insults, Unwanted Sexual Content & Graphic Objectification, Unwanted NSFW & Graphic Content, Violent Event Denial, Targeted Harassment and Inciting Harassment' },
  { category: 'Violent Speech', description: 'Violent Threats, Wish of Harm, Glorification of Violence, Incitement of Violence, Coded Incitement of Violence' },
  { category: 'Child Safety', description: 'Child sexual exploitation, grooming, physical child abuse, underage user' },
  { category: 'Privacy', description: 'Sharing private information, threatening to share/expose private information, sharing non-consensual intimate images, sharing images of me that I don’t want on the platform' },
  { category: 'Spam', description: 'Fake engagement, scams, fake accounts, malicious links' },
  { category: 'Suicide or self-harm', description: 'Encouraging, promoting, providing instructions or sharing strategies for self-harm.' },
  { category: 'Sensitive or disturbing media', description: 'Graphic Content, Gratuitous Gore, Adult Nudity & Sexual Behavior, Violent Sexual Conduct, Bestiality & Necrophilia, Media depicting a deceased individual' },
  { category: 'Impersonation', description: 'Pretending to be someone else, including non-compliant parody/fan accounts' },
  { category: 'Violent & hateful entities', description: 'Violent extremism and terrorism, hate groups & networks' },
];

const ReportQueries = ({ open, onClose, onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reportReason, setReportReason] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedCategory.trim()) {
      onSubmit({ category: selectedCategory, reason: reportReason });
      setSelectedCategory('');
      setReportReason('');
    } else {
      alert('Please select a category.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Query or Reply</DialogTitle>
      <DialogContent dividers>
        <Typography>Please select the type of issue you are reporting:</Typography>
        <Box sx={{ maxHeight: '300px', overflowY: 'auto', mt: 2, pr: 1 }}>
          <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
            {reportOptions.map((option) => (
              <Box key={option.category} mb={1}>
                <FormControlLabel
                  value={option.category}
                  control={<Radio />}
                  label={option.category}
                />
                <Collapse in={selectedCategory === option.category}>
                  <Box pl={4} mt={1}>
                    <Typography variant="body2" color="textSecondary">
                      {option.description}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </RadioGroup>
        </Box>

        {/* Integrated TextField */}
        <Box mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Provide More Details"
            placeholder="Anything Wrong You Feel With Creator's Reply?"
            multiline
            rows={3}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="error" disabled={!selectedCategory}>
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportQueries;