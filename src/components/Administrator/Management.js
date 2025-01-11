import React, { useState } from "react";
import "./Management.css";

const Management = () => {
  const [selectedRole, setSelectedRole] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [showSalaryInfo, setShowSalaryInfo] = useState(false);

  const cards = [
    {
      id: 1,
      role: "Payment Specialist",
      value: "It enables seamless payment processing and refund management, enhancing user trust, convenience, and the web app’s credibility.",
      skills: " React, Node.js, Postgresql, Cron Jobs (automatically process refund requests), webhooks, Payment Gateway APIs, ACID-compliant transactions. ",
      applicants: "Divyanshu Upadhyay, Karthik Tumala",
      selectedMembers: "",
      tasks: [
        "Create a payment receiving page in Any Payment Gatewat with React,node.js& PostgreSQL that actually Work in a live server. Be that price 49 rupees Where Clients will Able to Pay& The Webapp will able To Receive the Money.",
        "If Creator cancels within 7days, Refund the paid price back to Attendee ",
        "Create user-specific wallets (experts and peers).",
        "Build a transaction history page for transparency.",

        // "",
      ],
    },
    {
      id: 2,
      role: "Notifications System Engineer",
      value: "It ensures timely and engaging user interactions through automated notifications and reminders, enhancing user retention, satisfaction, and platform activity.",
      skills: "JavaScript, React, Node.js, Postgresql, Cron Jobs, Pollings, ",
      applicants: "Vishnu Kaku",
      selectedMembers: "",
      tasks: [
        "We’ll provide codes To Work on What Kind Of Events’ Notification or Reminders To Send  users. Mentioned below 👇 ",
    "New Follower Alert to User",
	"Upcoming Sessions Reminder to User& Creator before 1hour.",
	"Answers to Posted Question Alert to user",
	" Alert of Replies to Queries to users",
	"Alert of recieved Queries To Creators.",
	"New Uploded Session Alert to users.",
  "when someone gets specific number of impressions(100,1000,10000) to all thier sessions"
      ],
    },
    {
      id: 3,
      role: "Transcription System Engineer",
      value: "Providing live transcription enhances accessibility and user engagement, while delivering PDFs ensures users have a permanent record of the session for reference, improving overall user satisfaction.",
      skills: "Speech-to-Text APIs, Node.js or Python, React.js, Sendgrid or Nodemailter tools",
      applicants: "Dirisala Srilakshmi",
      selectedMembers: "",
      tasks: [
        "Generate live transcripts during sessions",
        "send PDFs of the transcripts to users after their Session.",
        // "",
        // "",
      ],
    },
    {
      id: 4,
      role: "AI Chatbot Developer",
      value: "Enhances user engagement by Providing instant responses, Automating support tasks, and Offering a personalized experience.",
      skills: " React, NLP, Node.js or Python, AI API Integration like OPEN AI,DialogFlow, PostgreSQL",
      applicants: "Utkarshinfinity",
      selectedMembers: "",
      tasks: [
        "Build an AI Chat Assistant Bot.",
        // "Document bugs and issues.",
        // "Ensure all features meet quality standards.",
      ],
    },
    {
        id: 5,
        role: "Search Functionality Developer",
        value: "Ease searching functionality whether of sessions or creators.",
        skills: "ElasticSearch, React, Node.js, PostgreSQL",
        applicants: "Mayank Tanwar",
        selectedMembers: "",
        tasks: [
          "Search Sessions by improving search logic.Near Match sessions should be fetched",
          "Search Profiles by a user's username.",
        ],
      },
      {
        id: 6,
        role: "Social Media Page Developer",
        value: "Creates a highly engaging social media-like platform by implementing functionalities such as likes for questions/answers and fetching questions by category, enhancing user interaction and content discoverability.",
        skills: "React, Node.js, PostgreSQL, REST APIs, Frontend UI Design, State Management (Redux or Context API)",
        applicants: "",
        selectedMembers: "",
        tasks: [
          "Add 'like/ tick' functionality to questions and answers with separate buttons for each (e.g., a like button for questions and a tick button for answers).",
          "Design and implement a system to fetch and display questions based on their categories for improved content organization.",
          "Create an intuitive and visually appealing social media-like interface to allow users to interact with questions and answers seamlessly.",
        ],
      },
      {
        id: 7,
        role: "UI Designer",
        value: "Strong frontend expertise to join our startup and play a pivotal role in enhancing our platform’s user experience.",
        skills: "React, Node.js, UI/UX design, Figma, Adobe Photoshop, UI design,  REST APIs",
        applicants: "",
        selectedMembers: "",
        tasks: [
          "Implement dark mode & Improve the Below Components",
          "Homepage, Upload Page, User-Profile Page",
          "Session Booking Page, Upcoming Sessions Page",
          "Queries Page For Visitor & Creator",
          "Categories Page",
          "Video Call Page, Messaging Page",
          "About More Page, Ratings & Reviews Page"
        ],
      },
      {
        id: 8,
        role: "Chat Component Developer",
        value: "Experienced developer to manage and enhance the chat component for seamless real-time communication on our platform.",
        skills: "React, Socket.IO, WebRTC, Node.js, PostgreSQL, WebSocket Debugging, CSS (Flexbox, Grid), Responsive Design",
        applicants: "sTRaNgEr",
        selectedMembers: "",
        tasks: [
          "Implement and maintain the messaging interface",
          "Optimize real-time chat functionality using Socket.IO",
          "Develop and test message editing and deletion features",
          "Display timestamps for messages in a user-friendly format",
          "Effectively show the typing indicator for real-time user feedback",
          "Add 'message seen' status or read receipts for better user experience",
          "Integrate a search functionality to find messages within the chat history",
          "Secure chat communication to prevent XSS or CSRF vulnerabilities"
        ],
      },
      {
  id: 9,
  role: "Google Login/Signup Developer",
  value: "Skilled developer to integrate a seamless Google Login/Signup feature into our platform using OAuth 2.0, enhancing accessibility and user experience.",
  skills: "JavaScript, OAuth 2.0, Node.js, React, PostgreSQL, REST APIs, Security Best Practices",
  applicants: "Vikesh Mishra",
  selectedMembers: "",
  tasks: [
    "Integrate Google Login/Signup using OAuth 2.0 for secure user authentication.",
    "Ensure compatibility with existing backend (Node.js) and database (PostgreSQL).",
    "Implement token-based authentication and secure session handling.",
    "Test and validate the feature to ensure a smooth user onboarding experience.",
  ]
},
{
  "id": 10,
  "role": "Session Booking Developer",
  "value": "Developer to enhance the scheduling and booking modules by integrating data persistence, timezone synchronization, and improving user experience with advanced functionalities.",
  "skills": "JavaScript, React, Node.js, PostgreSQL, Browser APIs, Material-UI, Timezone Handling, UX Design",
  "applicants": "",
  "selectedMembers": "",
  "tasks": [
    "Implement local storage to save drafts of selected date, time, and duration, ensuring user progress is preserved during refresh.",
    "Incorporate real-time timezone detection and synchronization using browser APIs like Intl.DateTimeFormat().resolvedOptions().timeZone.",
    "Ensure server-side validation to prevent session overlap across different bookings.",
    "Fetch available time slots based on global timezone and dynamically update the schedule.",
    "Provide visual indications for session statuses (e.g., upcoming, ended, or joinable) using distinct colors or icons.",
    "Add filters for sessions by type (e.g., upcoming, past, or joinable) for better user experience.",
  ]
},
{
  "id": 11,
  "role": "Homepage Optimization Developer",
  "value": "Developer to enhance the Homepage with improved video management and user-friendly exploration features, optimizing load time and user engagement.",
  "skills": "React, JavaScript, Node.js, Pagination Libraries, Material-UI, Performance Optimization, UX Design",
  "applicants": "",
  "selectedMembers": "",
  "tasks": [
    "Add sorting options such as 'Language' or 'Rating' (upto 3, 4, 5) to help users filter sessions effectively.",
    "Implement pagination or infinite scrolling using libraries like 'react-infinite-scroll-component' to manage large numbers of videos.",
    "Optimize page load by only loading videos visible on the screen (lazy loading).",
    "Break videos into smaller groups and incorporate a 'Load More' button after displaying 12 sessions.",
    "Use visual indicators like badges or labels (e.g., 'Top Rated', 'Popular') to highlight standout sessions.",
    "Count wishlisted count and impressions count for the Homepage.js"
  ]
},
{
  "id": 12,
  "role": "WebRTC Specialist and UI/UX Expert",
  "value": "A mission-driven role focusing on real-time communication features and responsive design for a knowledge-sharing platform.",
  "skills": [
    "WebRTC APIs (RTCPeerConnection, MediaStream) , React , Node.js ,STUN/TURN servers and real-time communication protocols , Material-UI or Tailwind CSS",

  ],
  "applicants": [],
  "selectedMembers": [],
  "tasks": [
    
 "Develop and optimize WebRTC video call & chat features (1-to-1 calls).",
 "Design a responsive, cross-platform video call interface (desktop and mobile).",
 "Implement advanced features like screen sharing, recording, and background blur.",
 "Enhance performance to ensure low-latency, high-quality calls.",
"Integrate WebRTC with backend signaling (Socket.io, Firebase, or a custom signaling server).",
"Stay updated with WebRTC APIs and best practices to improve the platform.",

  ]
}
  ];

  const handleSelectChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const toggleViewMore = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

   const toggleSalaryInfo = () => {
    setShowSalaryInfo((prev) => !prev);
  };

  const handleApply = (roleId) => {
    const message = `Hi, I would like to apply for role #${roleId}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/8658880791?text=${encodedMessage}`, "_blank");
  };


  const filteredCards =
    selectedRole === "All"
      ? cards
      : cards.filter((card) => card.role === selectedRole);

  return (
    <div>


       {/* Salary Info Section */}
       <div className="salary-info-section">
        <button className="salary-info-button" onClick={toggleSalaryInfo}>
          {showSalaryInfo ? "Hide Salary Info" : "Show Salary Info"}
        </button>
        {showSalaryInfo && (
          <div className="salary-info">
            <h4>Performance-Based Salary Model</h4>
            <ul>
              <li>₹25,000: If the company generates ₹2 lakh in sales'profit.</li>
              <li>₹50,000: If the company generates ₹5 lakh in sales'profit.</li>
              <li>₹75,000: If the company generates ₹10 lakh in sales'profit.</li>
              <li>₹1,00,000: If the company generates ₹20 lakh or more in sales'profit.</li>
            </ul>
            <p>
              As the company grows and generates more revenue, your compensation
              also increases.
            </p>
          </div>
        )}
      </div>

      <div className="dropdown" >
        <label htmlFor="role-select">Filter by Role:</label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={handleSelectChange}
        >
          <option value="All">All</option>
          {Array.from(new Set(cards.map((card) => card.role))).map((role, idx) => (
            <option key={idx} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredCards.map((card,index) => (
          <div key={card.id} 
          className={`card ${index === filteredCards.length - 1 ? "last-card" : ""}`}
          >
            <h4 className="card-title">{`#${card.id}`}</h4>
            <h5 className="card-subtitle">Role:</h5>
            <p className="card-text role">{card.role}</p>
            <h5 className="card-subtitle">Skills Required:</h5>
            <p className="card-text">{card.skills}</p>
            <h5 className="card-subtitle">Applicants:</h5>
            <p className="card-text">{card.applicants}</p>
            <h5 className="card-subtitle">Selected Members:</h5>
            <p className="card-text">{card.selectedMembers}</p>

            {expandedCard === card.id ? (
              <>
                <h5 className="card-subtitle">Tasks:</h5>
                <ol className="card-text">
                  {card.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ol>
                <h5 className="card-subtitle">What Value it Provides:</h5>
                <p className="card-text">{card.value}</p>
                <button
                  className="toggle-button"
                  onClick={() => toggleViewMore(card.id)}
                >
                  View Less
                </button>
              </>
            ) : (
              <button
                className="toggle-button"
                onClick={() => toggleViewMore(card.id)}
              >
                View More
              </button>
            )}

<button
              className="apply-button"
              onClick={() => handleApply(card.id)}
            >
              Apply
            </button>
          </div>
        ))}
      </div>


     
      
    </div>
  );
};

export default Management;