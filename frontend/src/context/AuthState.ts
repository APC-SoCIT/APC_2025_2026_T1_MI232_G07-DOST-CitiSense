// Reference: https://gemini.google.com/share/79cc96b83b56

// Set a variable to hold the boolean if the user is logged in or not
let loggedIn: boolean = false;

// Setter function for the loggedIn
export const setLoggedIn = (value: boolean) => {
  loggedIn = value;
};

// Get the current value of the loggedIn (true/false)
export function getLoggedIn() {
  return loggedIn;
}
