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
      applicants: "Divyanshu Upadhyay",
      selectedMembers: "",
      tasks: [
        "Create a payment receiving page in Any Payment Gatewat with React,node.js& PostgreSQL that actually Work in a live server. Be that price 49 rupees Where Clients will Able to Pay& The Webapp will able To Receive the Money.",
        "If Creator cancels within 7days, Refund the paid price back to Attendee ",
        // "",
      ],
    },
    {
      id: 2,
      role: "Notifications System Engineer",
      value: "It ensures timely and engaging user interactions through automated notifications and reminders, enhancing user retention, satisfaction, and platform activity.",
      skills: "JavaScript, React, Node.js, Postgresql, Cron Jobs, Pollings, ",
      applicants: "Malik Towkeer Ul Islam, Vishnu Kaku",
      selectedMembers: "",
      tasks: [
        "We’ll provide codes To Work on What Kind Of Events’ Notification or Reminders To Send  users. Mentioned below 👇 ",
    "New Follower Alert to User",
	"Upcoming Sessions Reminder to User& Creator.",
	"Answers to Posted Question Alert to user",
	" Alert of Replies to Queries to users",
	"Alert of recieved Queries To Creators.",
	"New Uploded Session Alert to users.",
      ],
    },
    {
      id: 3,
      role: "Transcription System Engineer",
      value: "Providing live transcription enhances accessibility and user engagement, while delivering PDFs ensures users have a permanent record of the session for reference, improving overall user satisfaction.",
      skills: "Speech-to-Text APIs, Node.js or Python, React.js, Sendgrid or Nodemailter tools",
      applicants: "",
      selectedMembers: "",
      tasks: [
        "Generate live transcripts during sessions and send PDFs of the transcripts to users.",
        // "",
        // "",
      ],
    },
    {
      id: 4,
      role: "AI Chatbot Developer",
      value: "Enhances user engagement by Providing instant responses, Automating support tasks, and Offering a personalized experience.",
      skills: " React, NLP, Node.js or Python, AI API Integration like OPEN AI,DialogFlow, PostgreSQL",
      applicants: "",
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
        value: "Enhances user engagement by Providing instant responses, Automating support tasks, and Offering a personalized experience.",
        skills: "ElasticSearch, React, Node.js, PostgreSQL",
        applicants: "",
        selectedMembers: "",
        tasks: [
          "Designing efficient database queries.",
          "Search Related Sessions by improving search logic.",
          "Search Profiles by Their usernames",
        ],
      },
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
              <li>₹25,000: If the company generates ₹2 lakh in sales.</li>
              <li>₹50,000: If the company generates ₹5 lakh in sales.</li>
              <li>₹75,000: If the company generates ₹10 lakh in sales.</li>
              <li>₹1,00,000: If the company generates ₹20 lakh or more in sales.</li>
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
        {filteredCards.map((card) => (
          <div key={card.id} className="card">
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