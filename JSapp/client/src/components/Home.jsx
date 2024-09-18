import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import bgImage from '../assets/bg3.png'; // Adjust the path according to your file structure
import Chatbot from './chatbot';
import { AiFillInstagram, AiFillFacebook, AiFillLinkedin, AiFillPhone, AiFillMail } from 'react-icons/ai';

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('about'); // State to track active section

  // Function to handle navigation click and update active section
  const handleNavClick = (section) => {
    setActiveSection(section);
    if (section === 'signin') {
      navigate('/login');
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Logo src="/logo_pravah.png" alt="Pravah Logo" />
        <Nav>
          <NavItem active={activeSection === 'about'} onClick={() => handleNavClick('about')}>About</NavItem>
          <NavItem active={activeSection === 'team'} onClick={() => handleNavClick('team')}>Our Team</NavItem>
          <NavItem active={activeSection === 'faq'} onClick={() => handleNavClick('faq')}>FAQ</NavItem>
          <NavItem active={activeSection === 'signin'} onClick={() => handleNavClick('signin')}>Sign In</NavItem>
        </Nav>
      </Header>

      {/* Body */}
      <Body>
        <Section className={activeSection === 'about' ? 'active' : ''}>
          <h2>About Us</h2>
          <p>
            PRAVAH: Platform for Reliable Authentication and Verification of Accredited Holdings <br/>
            We are committed to providing the best services for reliable authentication and verification.
            Our platform is designed to be user-friendly and efficient, offering seamless verification solutions.
          </p>
        </Section>
        
        <Section className={activeSection === 'mission' ? 'active' : ''}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to revolutionize authentication and verification by providing cutting-edge solutions that are reliable and secure.
          </p>
        </Section>
        
        <Section className={activeSection === 'vision' ? 'active' : ''}>
          <h2>Our Vision</h2>
          <p>
            Our vision is to be the leading provider of innovative solutions in the field of authentication and verification.
          </p>
        </Section>

        <DotsNav>
          <Dot active={activeSection === 'about'} onClick={() => handleNavClick('about')} />
          <Dot active={activeSection === 'mission'} onClick={() => handleNavClick('mission')} />
          <Dot active={activeSection === 'vision'} onClick={() => handleNavClick('vision')} />
        </DotsNav>
      </Body>

      {/* Footer */}
      <Footer>
        <LeftSection>
          <h3>Social Media</h3>
          <SocialMedia>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <AiFillInstagram size={20} color='white' />
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <AiFillFacebook size={20} color='white' />
              Facebook
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <AiFillLinkedin size={20} color='white' />
              LinkedIn
            </a>
          </SocialMedia>
        </LeftSection>

        <RightSection>
          <h3>Contact Us</h3>
          <div>
            <AiFillMail size={20} />
            <span>pravah@gmail.com</span>
          </div>
          <Divider />
          <div>
            <AiFillPhone size={20} />
            <span>+123-456-7890</span>
          </div>
        </RightSection>
      </Footer>

      <CopyRight>© 2024-2025 Intell Alpha / PRAVAH</CopyRight>

      <Chatbot />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  

`;

const Header = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10;
`;

const Logo = styled.img`
  width: 150px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.div`
  font-size: 20px;
  color: ${(props) => (props.active ? '#007bff' : '#fff')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Body = styled.main`
  flex: 1;
  padding: 20px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Section = styled.section`
  display: none;
  &.active {
    display: block;
  }

  h2 {
    font-size: 40px;
    font-weight: bold;
    color: white; 
    margin-bottom: 10px;
  }

  p {
    font-size: 24px;
    line-height: 1.6;
    color: white; 
    
  }
`;

const DotsNav = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Dot = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${(props) => (props.active ? '#007bff' : '#ddd')};
  border-radius: 50%;
  cursor: pointer;
  margin: 0 5px;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  align-items: flex-start;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3 {
    margin-bottom: 10px;
    font-size: 20px;
  }
`;

const SocialMedia = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  a {
    display: flex;
    align-items: center;
    color: #fff;
    text-decoration: none;
    font-size: 18px;
    gap: 10px; /* Space between icon and text */

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3 {
    margin-bottom: 10px;
    font-size: 20px;
  }

  div {
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      font-size: 18px;
    }
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #fff;
  margin: 10px 0;
`;

const CopyRight = styled.div`
  text-align: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`;

export default Home;
