import React from 'react';

const AboutUs = () => {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.subtitle}>
          Discover how Wanloft connects like-minded individuals, experts, and skilled professionals for meaningful collaboration.
        </p>
      </div>
      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.text}>
            At Wanloft, our mission is to create a platform that fosters collaboration and innovation by connecting like-minded peers, experts, and skilled individuals. We provide a space where knowledge, experience, and insights are shared, empowering everyone to grow and succeed together.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What We Do</h2>
          <p style={styles.text}>
            Wanloft is designed to bring together people with shared interests and goals. Through organized sessions, events, and discussions, we enable individuals to meet, learn, and grow. Whether you're seeking inspiration, mentorship, or a platform to showcase your skills, Wanloft is here to help you connect with the right people.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Choose Wanloft?</h2>
          <p style={styles.text}>
            In a world driven by connections and collaboration, Wanloft provides the tools and opportunities for you to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Connect with peers who share your interests and passions.
            </li>
            <li style={styles.listItem}>
              Gain insights and mentorship from industry experts.
            </li>
            <li style={styles.listItem}>
              Showcase your skills and find opportunities to grow.
            </li>
            <li style={styles.listItem}>
              Participate in knowledge-sharing sessions and events.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Meet the Community</h2>
          <p style={styles.text}>
            Wanloft is home to a vibrant community of innovators, thinkers, and doers from diverse fields. Together, we create an environment where collaboration leads to success.
          </p>
          <div style={styles.teamGrid}>
            <div style={styles.teamMember}>
              {/* <img
                src="https://via.placeholder.com/100"
                alt="Team Member"
                style={styles.teamImage}
              /> */}
              <p style={styles.teamName}>S.Ritesh</p>
              <p style={styles.teamRole}>Founder And CEO</p>
            </div>
            <div style={styles.teamMember}>
              {/* <img
                src="https://via.placeholder.com/100"
                alt="Team Member"
                style={styles.teamImage}
              /> */}
              <p style={styles.teamName}>S.Subashis</p>
              <p style={styles.teamRole}>Co-Founder And CFO</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    padding: '20px',
    maxWidth: '1200px',
    margin: '1rem auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    margin: '10px 0',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
  },
  content: {
    textAlign: 'left',
  },
  section: {
    marginBottom: '40px', // Added bottom margin for more spacing
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#007BFF',
    marginBottom: '10px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#444',
  },
  list: {
    paddingLeft: '20px',
  },
  listItem: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#444',
    marginBottom: '10px',
  },
  teamGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  teamMember: {
    textAlign: 'center',
    width: '150px',
  },
  teamImage: {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  teamName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  teamRole: {
    fontSize: '14px',
    color: '#777',
  },
};

export default AboutUs;