import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bgImage from '../assets/bg3.png'; // Adjust the path according to your file structure

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [activeSection, setActiveSection] = useState(''); // State to track which section is active

  // Function to handle login button click
  const handleLoginClick = () => {
    setIsLoading(true); // Set loading state to true
    setTimeout(() => {
      // Simulate an async operation like API call, then navigate
      navigate('/login');
    }, 2000); // Simulate a delay of 2 seconds
  };

  // Function to handle section button clicks
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <Container>
      {/* Logo positioned at the top left */}
      <Logo src="/logo_pravah.png" alt="Pravah Logo" />

      <Content>
        <Heading>PRAVAH</Heading>
        <Paragraph>
          A Platform for Reliable Authentication and Verification of Accredited Holdings.
        </Paragraph>
        <LoginButton 
          onClick={handleLoginClick} 
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? 'Loading...' : 'Log In'} {/* Show loading or button text */}
        </LoginButton>

        <Sidebar>
          <SidebarButton onClick={() => handleSectionClick('about')}>About Us</SidebarButton>
          <SidebarButton onClick={() => handleSectionClick('mission')}>Our Mission</SidebarButton>
          <SidebarButton onClick={() => handleSectionClick('vision')}>Our Vision</SidebarButton>
        </Sidebar>

        <Card visible={activeSection === 'about'}>
          <CardContent>
            {/* Add your content for "About Us" here */}
            <h2>About Us</h2>
            <p>
              We are committed to providing the best services for reliable authentication and verification.
              Our team is dedicated to ensuring the highest standards of security and accuracy in all our processes.
              With years of experience and expertise, we strive to meet and exceed our clients' expectations.
              Our platform is designed to be user-friendly and efficient, offering seamless verification solutions.
              We value transparency and integrity, and our mission is to build trust through our services.
              Join us in our journey towards excellence and reliability in authentication and verification.
              Your trust and satisfaction are our top priorities.
            </p>
          </CardContent>
        </Card>

        <Card visible={activeSection === 'mission'}>
          <CardContent>
            {/* Add your content for "Our Mission" here */}
            <h2>Our Mission</h2>
            <p>
              Our mission is to revolutionize the field of authentication and verification by providing cutting-edge
              solutions that are both reliable and secure. We aim to empower individuals and organizations with tools
              that enhance trust and confidence in their dealings. Through innovation and a commitment to excellence,
              we seek to set new standards in the industry. Our focus is on delivering solutions that are both effective
              and user-centric, ensuring that our clients can achieve their goals with ease. We are dedicated to continuous
              improvement and strive to stay ahead of the curve in technology and service delivery.
              Join us in making authentication and verification processes more secure and trustworthy.
            </p>
          </CardContent>
        </Card>

        <Card visible={activeSection === 'vision'}>
          <CardContent>
            {/* Add your content for "Our Vision" here */}
            <h2>Our Vision</h2>
            <p>
              Our vision is to be the leading provider of innovative solutions in the field of authentication and verification.
              We aspire to create a world where trust and security are paramount in all transactions and interactions.
              By leveraging advanced technology and best practices, we aim to offer unparalleled service and reliability.
              Our goal is to foster a culture of integrity and transparency, where our solutions are synonymous with quality
              and trust. We envision a future where our platform is the go-to choice for individuals and organizations seeking
              secure and efficient verification processes. Together, we can achieve a higher standard of reliability and
              excellence in authentication.
            </p>
          </CardContent>
        </Card>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // Centers content horizontally
  text-align: center;
  padding: 50px;
  width: 100vw; // Full viewport width
  height: 100vh; // Full viewport height
  background-image: url(${bgImage});
  background-size: cover; // Ensures the image covers the entire container
  background-position: center; // Centers the image
  background-repeat: no-repeat; // Prevents image repetition
  color: #fff;
  gap: 20px; // Space between elements
  overflow: hidden; // Ensures no scrollbars are visible
  position: relative; // To position sidebar absolutely
`;

const Logo = styled.img`
  position: absolute; // Absolute positioning for the logo
  top: 40px; // Distance from the top of the page
  left: 50px; // Distance from the left of the page
  width: 180px; // Adjust size as needed
  height: auto; // Maintain aspect ratio
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  //margin-top: 100px; // Adds space above the content
`;

const Heading = styled.h1`
  font-size: 50px; // Font size for the heading
  margin-bottom: 20px; // Adds space below the heading
`;

const Paragraph = styled.p`
  font-size: 20px; // Font size for the paragraph
  margin-bottom: 30px; // Adds space below the paragraph
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  //margin-bottom: 50px; // Adds space below the button
  border-radius: 5px;
  font-size: 16px;
`;

const Sidebar = styled.div`
  position: absolute;
  left: 50px;
  top: 250px; // Adjust this value to position the sidebar further down
  display: flex;
  flex-direction: column;
  gap: 15px; // Space between buttons
  align-items: flex-start; // Align buttons to the left
`;

const SidebarButton = styled.button`
  padding: 10px 20px;
  background-color: #fff;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 150px; // Adjust width as needed

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

const Card = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  position: absolute;
  left: 250px; // Adjust this value to position the card beside the sidebar
  top: 250px; // Align with the sidebar buttons
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px; // Adjust width as needed
  text-align: left;
`;

const CardContent = styled.div`
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    line-height: 1.5;
  }
`;

export default Home;



