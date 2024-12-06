import React, { useState } from 'react';

const allTopics = [
  'Accountant',
  'Actor',
  'Administrator',
  'Advertising Manager',
  'Aerospace Engineer',
  'Architect',
  'Artist',
  'Athlete',
  'Banker',
  'Barista',
  'Biologist',
  'Biomedical Engineer',
  'Business Analyst',
  'Chef',
  'Civil Engineer',
  'Computer Scientist',
  'Consultant',
  'Content Creator',
  'Copywriter',
  'Data Analyst',
  'Data Scientist',
  'Dentist',
  'Designer',
  'Digital Marketer',
  'Doctor',
  'Economist',
  'Electrical Engineer',
  'Entrepreneur',
  'Environmental Engineer',
  'Event Planner',
  'Fashion Designer',
  'Financial Analyst',
  'Fitness Trainer',
  'Graphic Designer',
  'Human Resources Manager',
  'IT Specialist',
  'Journalist',
  'Lawyer',
  'Librarian',
  'Marketing Manager',
  'Mathematician',
  'Mechanical Engineer',
  'Musician',
  'Network Administrator',
  'Nurse',
  'Occupational Therapist',
  'Operations Manager',
  'Pharmacist',
  'Photographer',
  'Physician',
  'Physicist',
  'Pilot',
  'Police Officer',
  'Product Manager',
  'Program Manager',
  'Project Manager',
  'Psychologist',
  'Public Relations Specialist',
  'Quality Assurance Manager',
  'Real Estate Agent',
  'Research Scientist',
  'Restaurant Manager',
  'Robotics Engineer',
  'Sales Engineer',
  'Sales Manager',
  'Scientist',
  'Social Media Manager',
  'Software Developer',
  'Software Engineer',
  'Statistician',
  'Systems Analyst',
  'Teacher',
  'Technical Writer',
  'Technician',
  'Tour Guide',
  'Translator',
  'Transportation Engineer',
  'Tutor',
  'UX Designer',
  'Veterinarian',
  'Video Editor',
  'Visual Designer',
  'Web Developer',
  'Writer',
  'Zoologist',
  'Administrative Assistant',
  'Aircraft Pilot',
  'Banking Analyst',
  'Bioinformatics Scientist',
  'Customer Service Representative',
  'Choreographer',
  'Cloud Engineer',
  'Cybersecurity Specialist',
  'Logistics Engineer',
  'Maintenance Technician',
  'Software Architect',
  'Surgeon',
  'Supply Chain Manager',
  'Systems Administrator',
  'Urban Planner',
  'Wind Energy Engineer',
//more 100
    'AI Engineer',
    'Animator',
    'Anthropologist',
    'Archaeologist',
    'Astronomer',
    'Audio Engineer',
    'Automation Engineer',
    'Baker',
    'Bartender',
    'Blockchain Developer',
    'Brand Strategist',
    'Business Consultant',
    'Carpenter',
    'Cartographer',
    'Chemical Engineer',
    'Chief Executive Officer (CEO)',
    'Chief Financial Officer (CFO)',
    'Chief Technology Officer (CTO)',
    'Childcare Worker',
    'Chiropractor',
    'Clinical Psychologist',
    'Compliance Officer',
    'Construction Manager',
    'Content Strategist',
    'Corporate Trainer',
    'Costume Designer',
    'Creative Director',
    'Cryptographer',
    'Customer Experience Designer',
    'Data Architect',
    'Database Administrator',
    'Dietitian',
    'Drone Operator',
    'Ecommerce Specialist',
    'Electrical Technician',
    'Emergency Medical Technician (EMT)',
    'Energy Consultant',
    'Environmental Scientist',
    'Ethical Hacker',
    'Event Coordinator',
    'Farm Manager',
    'Fashion Buyer',
    'Financial Controller',
    'Firefighter',
    'Fishery Worker',
    'Floral Designer',
    'Forensic Scientist',
    'Forestry Worker',
    'Game Developer',
    'Game Tester',
    'Geneticist',
    'Geologist',
    'Government Official',
    'Hair Stylist',
    'Health Educator',
    'Hotel Manager',
    'Import/Export Specialist',
    'Industrial Designer',
    'Information Security Analyst',
    'Insurance Agent',
    'Interior Designer',
    'Interpreter',
    'Investment Banker',
    'Journalism Photographer',
    'Laboratory Technician',
    'Landscape Architect',
    'Logistics Manager',
    'Marine Biologist',
    'Market Research Analyst',
    'Massage Therapist',
    'Media Planner',
    'Medical Technologist',
    'Meteorologist',
    'Midwife',
    'Mining Engineer',
    'Mobile App Developer',
    'Motion Graphics Artist',
    'Multimedia Specialist',
    'Neuroscientist',
    'Nuclear Engineer',
    'Occupational Health and Safety Specialist',
    'Oceanographer',
    'Operations Research Analyst',
    'Optometrist',
    'Organic Farmer',
    'Orthodontist',
    'Paramedic',
    'Patent Attorney',
    'Petroleum Engineer',
    'Philanthropy Manager',
    'Political Scientist',
    'Principal',
    'Private Investigator',
    'Production Manager',
    'Promotions Manager',
    'Public Health Specialist',
    'Radio Host',
    'Radiologist',
    'Renewable Energy Technician',
    'Risk Manager',
    'Screenwriter',
    'Script Supervisor',
    'Set Designer',
    'Social Worker',
    'Speech Therapist',
    'Sports Coach',
    'Surveyor',
    'Sustainability Consultant',
    'Talent Agent',
    'Tax Consultant',
    'Tourism Manager',
    'Veterinary Technician',
    'Video Game Designer',
    'Welding Technician',
    'Wildlife Biologist',
    'Yoga Instructor'

];

const TopicsSelector = ({ selectedTopics, setSelectedTopics }) => {
  const [topicInput, setTopicInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value;
    console.log('User input:', input); // Debug: log input value
    setTopicInput(input);

    if (input.length > 0) {
      const filteredSuggestions = allTopics
        .filter((topic) => topic.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      console.log('Filtered Suggestions:', filteredSuggestions); // Debug: log suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Add a topic when clicked from suggestions
  const handleAddTopic = (topic) => {
    if (selectedTopics.length < 3 && !selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
    setTopicInput(''); // Clear input after selecting a topic
    setSuggestions([]);
  };

  // Remove a topic from the selected list
  const handleRemoveTopic = (topic) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Topics"
        value={topicInput}
        onChange={handleInputChange}
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', marginBottom: '5px' }}
        disabled={selectedTopics.length >= 3} // Disable input if 3 topics are selected
      />

      {/* Display selected topics */}
      <div style={{ marginBottom: '-20px' }}>
        {selectedTopics.map((topic) => (
          <span
            key={topic}
            style={{
              display: 'inline-block',
              backgroundColor: '#ecf0f1',
              padding: '5px 10px',
              margin: '5px',
              borderRadius: '15px',
              cursor: 'pointer'
            }}
            onClick={() => handleRemoveTopic(topic)}
          >
            {topic} &times;
          </span>
        ))}
      </div>

      {/* Display suggestions */}
      {suggestions.length > 0 && (
        <ul style={{ listStyleType: 'none', paddingLeft: '0', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff' }}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ccc' }}
              onClick={() => handleAddTopic(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Show error if no topics selected */}
      {selectedTopics.length === 0 && <p style={{ color: 'red' }}>You must choose at least one topic</p>}
    </div>
  );
};

export default TopicsSelector;