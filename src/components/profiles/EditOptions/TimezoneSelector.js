import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import timezoneOptions from './timezoneOptions';  // Import your timezone options file

const TimezoneSelector = ({ continent, country, timezone, onChange }) => {
    const [selectedContinent, setSelectedContinent] = useState(continent || '');
    const [selectedCountry, setSelectedCountry] = useState(country || '');
    const [selectedTimezone, setSelectedTimezone] = useState(timezone || '');

    useEffect(() => {
        setSelectedContinent(continent || '');
        setSelectedCountry(country || '');
        setSelectedTimezone(timezone || '');
    }, [continent, country, timezone]);

    const handleContinentChange = (event) => {
        const newContinent = event.target.value;
        setSelectedContinent(newContinent);
        setSelectedCountry('');
        setSelectedTimezone('');
        onChange(newContinent, '', '');  // Reset country and timezone when continent changes
    };

    const handleCountryChange = (event) => {
        const newCountry = event.target.value;
        setSelectedCountry(newCountry);
        setSelectedTimezone('');
        onChange(selectedContinent, newCountry, '');  // Reset timezone when country changes
    };

    const handleTimezoneChange = (event) => {
        const newTimezone = event.target.value;
        setSelectedTimezone(newTimezone);
        onChange(selectedContinent, selectedCountry, newTimezone);
    };

    const getCountries = () => {
        if (!selectedContinent || !timezoneOptions[selectedContinent]) return [];
        return timezoneOptions[selectedContinent].map(country => country.country);
    };

    const getTimezones = () => {
        if (!selectedCountry || !timezoneOptions[selectedContinent]) return [];
        const country = timezoneOptions[selectedContinent].find(
            country => country.country === selectedCountry
        );
        return country ? country.timezones : [];
    };

    return (
        <Box>
            <FormControl fullWidth margin="normal">
                <InputLabel>Continent</InputLabel>
                <Select
                    value={selectedContinent}
                    onChange={handleContinentChange}
                >
                    <MenuItem value="">
                        <em>Select Continent</em>
                    </MenuItem>
                    {Object.keys(timezoneOptions).map(continent => (
                        <MenuItem key={continent} value={continent}>
                            {continent}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedContinent && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Country</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                    >
                        <MenuItem value="">
                            <em>Select Country</em>
                        </MenuItem>
                        {getCountries().map(country => (
                            <MenuItem key={country} value={country}>
                                {country}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {selectedCountry && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Timezone</InputLabel>
                    <Select
                        value={selectedTimezone}
                        onChange={handleTimezoneChange}
                    >
                        <MenuItem value="">
                            <em>Select Timezone</em>
                        </MenuItem>
                        {getTimezones().map(timezone => (
                            <MenuItem key={timezone.value} value={timezone.value}>
                                {timezone.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
};

export default TimezoneSelector;