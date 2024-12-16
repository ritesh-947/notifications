import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import timezoneOptions from './timezoneOptions';
import './TimezoneDisplay.css';  // Import the CSS file

const TimezoneDisplay = ({ onChange }) => {
    const [continent, setContinent] = useState('');
    const [country, setCountry] = useState('');
    const [timezone, setTimezone] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        if (timezone) {
            const interval = setInterval(() => {
                const now = new Date().toLocaleString('en-US', { timeZone: timezone });
                setCurrentTime(now);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timezone]);

    const handleContinentChange = (selectedOption) => {
        setContinent(selectedOption.value);
        setCountry('');
        setTimezone('');
        setCurrentTime('');
        onChange(selectedOption.value, '', '');
    };

    const handleCountryChange = (selectedOption) => {
        setCountry(selectedOption.value);
        setTimezone('');
        setCurrentTime('');
        onChange(continent, selectedOption.value, '');
    };

    const handleTimezoneChange = (selectedOption) => {
        setTimezone(selectedOption.value);
        onChange(continent, country, selectedOption.value); // Pass timezone upwards
    };

    const getCountries = () => {
        if (!continent || !timezoneOptions[continent]) return [];
        return timezoneOptions[continent].map(country => ({
            value: country.country,
            label: country.country,
        }));
    };

    const getTimezones = () => {
        if (!country || !timezoneOptions[continent]) return [];
        const selectedCountry = timezoneOptions[continent].find(
            item => item.country === country
        );
        return selectedCountry ? selectedCountry.timezones.map(tz => ({
            value: tz.value,
            label: tz.label,
        })) : [];
    };

    return (
        <div>
            <div className="form-group">
                <label htmlFor="continent">Continent</label>
                <Select
                    id="continent"
                    value={{ value: continent, label: continent }}
                    onChange={handleContinentChange}
                    options={Object.keys(timezoneOptions).map(cont => ({ value: cont, label: cont }))}
                    placeholder="Select Continent"
                    className="select-container"
                />
            </div>

            <div className="form-group">
                <label htmlFor="country">Country</label>
                <Select
                    id="country"
                    value={{ value: country, label: country }}
                    onChange={handleCountryChange}
                    options={getCountries()}
                    placeholder="Select Country"
                    isDisabled={!continent}
                    className="select-container"
                />
            </div>

            <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <Select
                    id="timezone"
                    value={{ value: timezone, label: timezone }}
                    onChange={handleTimezoneChange}
                    options={getTimezones()}
                    placeholder="Select Timezone"
                    isDisabled={!country}
                    className="select-container"
                />
            </div>

            {timezone && (
                <div className="current-time">
                    <p>Current Date and Time: {currentTime}</p>
                </div>
            )}
        </div>
    );
};

export default TimezoneDisplay;