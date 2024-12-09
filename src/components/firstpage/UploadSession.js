import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';
import TimezoneDisplay from './TimezoneDisplay';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import LockIcon from '@mui/icons-material/Lock';
import {
  daysOptions,
  timeOptions,
  durationOptions,
} from './dropdownOptions';
import axios from 'axios';



const UploadSession = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null); // State for error message
  const [formData, setFormData] = useState({
    session_title: '',
    video_url: '',
    description: '',
    price: '', // Set initial price as an empty string
    availability_timeperiod: {
      start: '09:00 AM',
      end: '06:00 PM',
    },
    availability_days: [],
    duration: 'default',
    category: '',
    languages: '',
    visibility: '',
    timezone: '',
  });
  const [maxSessionLimit, setMaxSessionLimit] = useState(4); // Default session limit
  const [sessionCount, setSessionCount] = useState(0);
  const [creatorId, setCreatorId] = useState(null);
  const navigate = useNavigate();
  const [monetization, setMonetization] = useState(false);
  const [subscription, setSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
     // Base price options with lock status and tooltip messages
  const basePriceOptions = [
    { value: 'free', label: 'Free', locked: false },
    { value: '49', label: '₹49', locked: false },
    { value: '99', label: '₹99', locked: true, tooltip: 'Monetization required' },
    { value: '249', label: '₹249', locked: true, tooltip: 'Monetization required' },
    { value: '729', label: '₹729', locked: true, tooltip: 'Subscription required' },
  ];
  const [availablePriceOptions, setAvailablePriceOptions] = useState(basePriceOptions);
  
  


  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        // Retrieve session_id from localStorage
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          console.warn('No session ID found. Redirecting to login...');
          // window.location.href = '/login'; // Redirect to login if no session_id
          return;
        }
  
        // Make the API request with Authorization header
        // const response = await axios.get(`http://localhost:3310/user-status?creator_id=${creatorId}`, {
        const response = await axios.get(`https://upload-server-ld7m.onrender.com/user-status?creator_id=${creatorId}`, {
          headers: {
            Authorization: `Bearer ${sessionId}`, // Send session_id as Bearer token
          },
        });
  
        // Extract user status from response
        const { monetization, subscription } = response.data;
        console.log('User Status:', { monetization, subscription }); // Debugging line
  
        // Update monetization and subscription states
        setMonetization(monetization);
        setSubscription(subscription);
  
        // Adjust max session limit dynamically
        const limit = subscription ? 10 : monetization ? 6 : 4;
        setMaxSessionLimit(limit);
  
        // Unlock options based on monetization and subscription status
        const updatedPriceOptions = basePriceOptions.map((option) => {
          if (option.value === '99' || option.value === '249') {
            option.locked = !monetization; // Unlock if monetization is true
          }
          if (option.value === '729') {
            option.locked = !subscription; // Unlock if subscription is true
          }
          return option;
        });
  
        setAvailablePriceOptions(updatedPriceOptions);
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('Unauthorized or session expired. Redirecting to login...');
          localStorage.removeItem('sessionId'); // Clear invalid session_id
          // window.location.href = '/login'; // Redirect to login
        } else {
          console.error('Error fetching user data:', error.response?.data || error.message);
          setLoading(false);
        }
      }
    };
  
    if (creatorId) {
      fetchUserStatus();
    }
  }, [creatorId]);

  useEffect(() => {
    const getCreatorIdFromLocalStorage = () => {
      const creatorId = localStorage.getItem('sessionId');
      console.log(creatorId);
      return creatorId;
    };
  
    const creator_id = getCreatorIdFromLocalStorage();
  
    if (!creator_id) {
      console.warn('No creator ID found. Redirecting to become-creator page...');
      window.location.href = '/become-creator';
    } else {
      setCreatorId(creator_id);
    }
  }, [navigate]);

  
  useEffect(() => {
    const checkSessionLimit = async () => {
      if (!creatorId) return;
  
      try {
        // Retrieve session_id from localStorage
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          console.warn('No session ID found. Redirecting to login...');
          // window.location.href = '/login'; // Redirect to login if no session_id
          return;
        }
  
        // Fetch session count using session_id in Authorization header
        const response = await axios.get(
          `https://upload-server-ld7m.onrender.com/session-count?creator_id=${creatorId}`,
          // `http://localhost:3310/session-count?creator_id=${creatorId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionId}`, // Pass session_id as Bearer token
            },
          }
        );
  
        // Destructure response data correctly
        const { count, maxLimit } = response.data;
        console.log(count, maxLimit, 'count, maxLimit');
  
        // Handle session limit exceeded
        if (count >= maxLimit) {
          setError(`
            <div style="
              background-color: #ffe6e6; 
              padding: 15px; 
              border: 1px solid #ff4d4d; 
              border-radius: 8px; 
              color: #cc0000; 
              font-size: 16px; 
              margin-bottom: 20px;
            ">
              Looks like You have reached your session limit (${maxLimit}). 
              Please consider 
              <a href="/subscriptions" 
                 style="color: #0073e6; 
                          font-weight: bold; 
                          text-decoration: none; 
                          border-bottom: 1px dashed #0073e6;"
                 onmouseover="this.style.color='#005bb5';" 
                 onmouseout="this.style.color='#0073e6';">
                 creator subscription plans
              </a> 
              to scale up.
            </div>
          `);
        } else {
          setError(null);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('Unauthorized or session expired. Redirecting to login...');
          localStorage.removeItem('sessionId'); // Clear invalid session_id
          // window.location.href = '/login'; // Redirect to login
        } else {
          console.error('Error fetching session count:', error.response?.data || error.message);
          setLoading(false);
        }
      }
    };
  
    checkSessionLimit();
  }, [creatorId]);

  useEffect(() => {
    const fetchSessionCount = async () => {
      if (!creatorId) return;
  
      try {
        // Retrieve session_id from localStorage
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          console.warn('No session ID found. Redirecting to login...');
          // window.location.href = '/login'; // Redirect to login if no session_id
          return;
        }
  
        // Fetch session count using session_id in Authorization header
        const response = await axios.get(
          // `http://localhost:3310/session-count?creator_id=${creatorId}`,
          `https://upload-server-ld7m.onrender.com/session-count?creator_id=${creatorId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionId}`, // Pass session_id as Bearer token
            },
          }
        );
  
        // Extract count from response data
        const { count } = response.data;
  
        setSessionCount(count);
  
        // Check if user has exceeded session limit
        if (count >= maxSessionLimit) {
          setError(`
            <div style="
              background-color: #ffe6e6; 
              padding: 15px; 
              border: 1px solid #ff4d4d; 
              border-radius: 8px; 
              color: #cc0000; 
              font-size: 16px; 
              margin-bottom: 20px;
            ">
              Looks like You have reached your session limit (${maxSessionLimit}). 
              Please consider 
              <a href="/subscriptions" 
                 style="color: #0073e6; 
                          font-weight: bold; 
                          text-decoration: none; 
                          border-bottom: 1px dashed #0073e6;"
                 onmouseover="this.style.color='#005bb5';" 
                 onmouseout="this.style.color='#0073e6';">
                 creator subscription plans
              </a> 
              to scale up.
            </div>
          `);
        } else {
          setError(null);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('Unauthorized or session expired. Redirecting to login...');
          localStorage.removeItem('sessionId'); // Clear invalid session_id
          // window.location.href = '/login'; // Redirect to login
        } else {
          console.error('Error fetching session count:', error.response?.data || error.message);
          setLoading(false);
        }
      }
    };
  
    fetchSessionCount();
  }, [creatorId, maxSessionLimit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (name === 'visibility') {
      processedValue = value === '18plusYes' ? true : false;
    }

    setFormData({ ...formData, [name]: processedValue });
  };
  const handlePriceChange = (selectedOption) => {
    if (selectedOption.value === 'custom') {
      setFormData({ ...formData, price: selectedOption.value, customPrice: '' });
    } else {
      setFormData({ ...formData, price: selectedOption.value, customPrice: '' });
    }
  };



  const handleCustomPriceChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, customPrice: value });
  };

  const handleDaysChange = (selectedOptions) => {
    setFormData({
      ...formData,
      availability_days: selectedOptions.map((option) => option.value),
    });
  };

  const handleTimeChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      availability_timeperiod: {
        ...formData.availability_timeperiod,
        [name]: selectedOption.value,
      },
    });
  };

  const handleTimezoneChange = (continent, country, timezone) => {
    setFormData({ ...formData, timezone });
  };

  const validateStep1 = () => {
    const { session_title, video_url, description, price } = formData;

    if (!session_title.trim()) {
      alert('Title is required.');
      return false;
    }
    if (session_title.length > 100) {
      alert('Title exceeds the maximum length of 100 characters.');
      return false;
    }
    if (
      !video_url.match(
        /^https:\/\/www\.youtube\.com\/watch\?v=|^https:\/\/youtu\.be\//
      )
    ) {
      alert('Invalid YouTube URL format.');
      return false;
    }
    if (description.length > 500) {
      alert('Description exceeds the maximum length of 500 characters.');
      return false;
    }
    if (!price || price === '') {
      alert('Please select a price.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { availability_days, availability_timeperiod, duration, timezone } =
      formData;
    if (availability_days.length === 0) {
      alert('Please select availability days.');
      return false;
    }
    if (!availability_timeperiod.start || !availability_timeperiod.end) {
      alert('Please select a valid availability time period.');
      return false;
    }
    if (duration === 'default') {
      alert('Please select a duration.');
      return false;
    }
    if (!timezone) {
      alert('Please select a timezone.');
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault(); // Prevents form submission

    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    setStep(step + 1);
  };


  const handlePreviousStep = (e) => {
    e.preventDefault(); // Prevents form submission
    setStep(step - 1);
  };
  console.log('formData',formData);

  const validateStep3 = () => {
    const { category, languages, visibility } = formData;
    if (!category) {
      alert('Please select a category.');
      return false;
    }
    if (!languages) {
      alert('Please enter at least one language.');
      return false;
    }
    if (visibility === '') {
      alert('Please select the visibility option.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Step 3 validation
    if (!validateStep3()) return;
  
    // Session limit check
    if (sessionCount >= maxSessionLimit) {
      alert(`You have reached your session limit (${maxSessionLimit}).`);
      return;
    }
  
    // Prepare form data with creator_id
    const formWithCreatorId = { ...formData, creator_id: creatorId };
    console.log('Submitting session data:', formWithCreatorId); // Log payload

    try {
      // Retrieve session_id from localStorage
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        alert('Session expired. Please log in again.');
        // window.location.href = '/login';
        return;
      }
  
      // Make the POST request with axios
      const response = await axios.post(
        'https://upload-server-ld7m.onrender.com/create-session',
        // 'http://localhost:3310/create-session',
        formWithCreatorId,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionId}`, // Pass session_id in Authorization header
          },
        }
      );
  
      // Handle successful response
      alert('Session created successfully!');
      console.log('Form Data:', response.data);
    } catch (error) {
      // Handle error cases
      if (error.response) {
        if (error.response.status === 401) {
          console.warn('Unauthorized or session expired. Redirecting to login...');
          localStorage.removeItem('sessionId'); // Clear invalid session_id
          // window.location.href = '/login'; // Redirect to login
        } else {
          console.error('Error creating session:', error.response.data);
          alert('Failed to create session: ' + (error.response.data.message || 'Unknown error'));
        }
      } else {
        console.error('Network or server error:', error.message);
        alert('A network or server error occurred. Please try again later.');
      }
    }
  };

  
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      color: state.data.locked ? 'grey' : 'black',
      cursor: state.data.locked ? 'not-allowed' : 'pointer',
      backgroundColor: state.isFocused ? (state.data.locked ? '#f0f0f0' : '#e6f7ff') : 'white',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };


  return (
    <form onSubmit={handleSubmit} className="session-form">
      {error && (
  <div
    className="error-message"
    dangerouslySetInnerHTML={{ __html: error }}
  />
)}

      <span className="step-indicator">Step {step} of 3</span>

      {step === 1 && (
        <>
          <div className="form-group">
            <label htmlFor="session_title">Title (Max 100 characters):</label>
            <input
              type="text"
              id="session_title"
              name="session_title"
              value={formData.session_title}
              onChange={handleChange}
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="video_url">
              Video URL:
              <Tooltip title="Please provide the URL of your YouTube video. The video should be set either public or unlisted.">
                <InfoIcon fontSize="small" className="tooltip-icon" />
              </Tooltip>
            </label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="eg.https://youtu.be/your-video-id"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Max 500 characters):</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength="500"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <Select
              id="price"
              value={availablePriceOptions.find(
                (option) => option.value === formData.price
              )}
              onChange={handlePriceChange}
              options={availablePriceOptions}
              placeholder="Select Price"
              styles={customStyles}
              formatOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {option.locked && <LockIcon style={{ marginRight: '5px', color: 'grey' }} />}
                  {option.label}
                  {option.locked && (
                    <Tooltip title={option.tooltip} placement="right">
                      <InfoIcon fontSize="small" style={{ marginLeft: '5px', color: 'grey' }} />
                    </Tooltip>
                  )}
                </div>
              )}
              isOptionDisabled={(option) => option.locked}
            />
          </div>
          </>
      )}

      {step === 2 && (
        <>
          <div className="form-group">
            <label>
              Availability Days:
              <Tooltip title="Your availability settings (time, days, duration, and timezone) will be updated for all previously created sessions.">
                <InfoIcon fontSize="small" className="tooltip-icon" />
              </Tooltip>
            </label>
            <Select
              isMulti
              value={daysOptions.filter((option) =>
                formData.availability_days.includes(option.value)
              )}
              onChange={handleDaysChange}
              options={daysOptions}
              className="days-dropdown"
              placeholder="Select availability days..."
            />
          </div>

          <div className="form-group">
            <label>Availability Time Period:</label>
            <div className="time-select">
              <Select
                value={timeOptions.find(
                  (option) => option.value === formData.availability_timeperiod.start
                )}
                onChange={(selectedOption) =>
                  handleTimeChange('start', selectedOption)
                }
                options={timeOptions}
                className="time-dropdown"
              />
              <span>to</span>
              <Select
                value={timeOptions.find(
                  (option) => option.value === formData.availability_timeperiod.end
                )}
                onChange={(selectedOption) =>
                  handleTimeChange('end', selectedOption)
                }
                options={timeOptions}
                className="time-dropdown"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Timezone:
            </label>
            <TimezoneDisplay onChange={handleTimezoneChange} />
          </div>
          <div className="form-group">
            <label htmlFor="duration">
              Duration:
              <Tooltip title="Select session duration. You can choose both for flexibility.">
                <InfoIcon fontSize="small" className="tooltip-icon" />
              </Tooltip>
            </label>
            <Select
              id="duration"
              value={durationOptions.find(option => option.value === formData.duration)}
              onChange={(selectedOption) => handleChange({ target: { name: 'duration', value: selectedOption.value } })}
              options={durationOptions.filter(option => option.value !== 'default')}
              required
            />
          </div>

        </>
      )}

      {step === 3 && (
        <>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
          <option value="">Select a category</option>
          <option value="Career & Education Guidance">🎓 Career & Education Guidance</option>
<option value="Mental Health & Wellness">🧠 Mental Health & Wellness</option>
<option value="Financial Planning & Investments">💰 Financial Planning & Investments</option>
<option value="Health & Fitness">🏋️‍♂️ Health & Fitness</option>
<option value="Parenting & Family Relationships">👨‍👩‍👧‍👦 Parenting & Family Relationships</option>
<option value="Technology & Digital Skills">💻 Technology & Digital Skills</option>
<option value="Sustainable Living & Environment">🌍 Sustainable Living & Environment</option>
<option value="Spirituality & Personal Growth">🧘 Spirituality & Personal Growth</option>
<option value="Legal & Taxation Advice">⚖️ Legal & Taxation Advice</option>
<option value="Entrepreneurship & Startups">🚀 Entrepreneurship & Startups</option>

          {/* Add more categories as needed */}
        </select>
          </div>

          <div className="form-group">
            <label htmlFor="languages">
              Languages:
              <Tooltip title="Enter Your Speaking Language(s) Separated By Commas. Maximum 3 Allowed.">
                <InfoIcon fontSize="small" className="tooltip-icon" />
              </Tooltip>
            </label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="Enter Languages Separated By Commas. Maximum 3 Allowed"
            />
            {formData.languages && (
              <div className="languages-feedback">
                {formData.languages.split(',').map((lang, index) => (
                  <span key={index} className="language-tag">
                    {lang.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Is this content suitable for below age 18?
            </label>
            <div className="radio-group-container">
              <div className="radio-group">
                <input
                  type="radio"
                  id="18plusYes"
                  name="visibility"
                  value="18plusYes"
                  checked={formData.visibility === true}
                  onChange={handleChange}
                />
                <label htmlFor="18plusYes">Yes</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="18plusNo"
                  name="visibility"
                  value="18plusNo"
                  checked={formData.visibility === false}
                  onChange={handleChange}
                />
                <label htmlFor="18plusNo">No</label>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="step-navigation">
        {step > 1 && (
          <button type="button" onClick={handlePreviousStep} className="prev-button">
            <ArrowBackIosIcon />
            Prev
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={handleNextStep} className="next-button next-blue">
            Next <ArrowForwardIosIcon />
          </button>
        ) : (
          <button type="submit" className="submit-button" disabled={sessionCount >= maxSessionLimit}>Submit</button>
        )}
      </div>
    </form>
  );
};

export default UploadSession;