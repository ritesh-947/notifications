import React, { useState } from 'react';
import { Box, Checkbox, TextField, Button, Typography, Grid, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import './SessionSetup.css';

const SessionSetup = ({ onSaveSetup }) => {
    const [thoughts, setThoughts] = useState('');
    const [shareThoughts, setShareThoughts] = useState(true);
    const [sessionMode, setSessionMode] = useState('');
    const [error, setError] = useState('');

    const thoughtsMaxLength = 256;

    const modes = [
        'Listening',
        'Expressing',
        'Engaging',
        'Doubt Clearing',
        'Problem Solving',
        'Brainstorming',
        'Collaboration',
        'Mentoring',
        'Discussion',
    ];

    const handleSubmitSetup = () => {
        if (!sessionMode) {
            setError('Please select a mode of session.');
            return;
        }

        if (thoughts.length > thoughtsMaxLength) {
            setError(`Your reason should be within ${thoughtsMaxLength} characters.`);
            return;
        }

        const setupData = {
            session_reason: shareThoughts ? thoughts : null, // Send session_reason
            mode: sessionMode, // Send mode
        };

        // Pass the setup data to Scheduler
        onSaveSetup(setupData);
        console.log('Setup data saved:', setupData);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" px={3}>
            <Box
                sx={{
                    maxWidth: 800,
                    width: '100%',
                    padding: 3,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h4" gutterBottom align="center" color="#444444">
                    Before You Schedule!
                </Typography>

                <Grid item xs={12} sx={{ mb: 3, mt: 4 }}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="session-mode-label">Mode of Session</InputLabel>
                        <Select
                            labelId="session-mode-label"
                            value={sessionMode}
                            onChange={(e) => setSessionMode(e.target.value)}
                            label="Mode of Session"
                        >
                            {modes.map((mode, index) => (
                                <MenuItem key={index} value={mode}>
                                    {mode}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                checked={shareThoughts}
                                onChange={(e) => setShareThoughts(e.target.checked)}
                                color="primary"
                            />
                            <Typography>Reason For Attending the Session</Typography>
                        </Box>
                        {shareThoughts && (
                            <>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    variant="outlined"
                                    placeholder="Type your thoughts here..."
                                    value={thoughts}
                                    onChange={(e) => setThoughts(e.target.value)}
                                    error={thoughts.length > thoughtsMaxLength}
                                />
                                <Typography color={thoughts.length > thoughtsMaxLength ? 'error' : 'textSecondary'}>
                                    {thoughts.length}/{thoughtsMaxLength} characters
                                </Typography>
                            </>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitSetup}
                            sx={{ mt: 2 }}
                        >
                            Save & Find A Schedule
                        </Button>
                    </Grid>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default SessionSetup;