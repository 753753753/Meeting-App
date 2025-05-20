// src/utils/api.js
const API_URL = "http://localhost:5000/api"; // Update with your backend URL

// Helper to get the auth token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Function to handle user login
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data; // Return the response for further processing (like saving JWT token)
};

// Google login
export const googleLoginUser = async (email, name, uid , image) => {
  const response = await fetch(`${API_URL}/auth/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, uid , image}),
  });

  const data = await response.json();
  return data;
};


// Function to handle user registration
export const registerUser = async (name, email, password, role = "user") => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await response.json();
  return data; // Return the response for further processing (like saving JWT token)
};

// Function to handle googleuser registration
export const googleRegisterUser = async (email, name, uid, role = "user" , image) => {
  const res = await fetch(`${API_URL}/auth/google-register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, uid , role , image }),
});

  return await res.json();
};



// Function to handle Admin registration
export const AdminregisterUser = async (
  name,
  email,
  password,
  role = "admin"
) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await response.json();
  return data; // Return the response for further processing (like saving JWT token)
};

// ✅ Create (Schedule) a meeting
export const createMeeting = async (title, date, participants = []) => {
  const token = localStorage.getItem("authToken"); // Assuming JWT stored in localStorage
  console.log(token);
  const response = await fetch(`${API_URL}/Upcomingmeetings/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, date, participants }),
  });

  const data = await response.json();
  return data;
};

// ✅ Get all meetings for logged-in user
export const getMeetings = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/Upcomingmeetings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// ✅ Delete a meeting by ID
export const deleteMeeting = async (id) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/Upcomingmeetings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const updateMeeting = async (meeting) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/Upcomingmeetings/edit/${meeting._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: meeting.title,
        date: meeting.date,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Update failed");
  return data.updatedMeeting;
};

// Create Personal Meeting
export const createPersonalMeeting = async (
  title,
  date,
  password,
  participants = []
) => {
  const token = localStorage.getItem("authToken"); // Assuming JWT stored in localStorage
  console.log(token);
  const response = await fetch(`${API_URL}/Personalmeetings/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, date, password, participants }),
  });

  const data = await response.json();
  return data;
};

// ✅ Get all personal meetings for logged-in user
export const getPersonalMeetings = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/Personalmeetings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const deletePersonalMeeting = async (id) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/Personalmeetings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const updatePersonalMeeting = async (meeting) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/Personalmeetings/edit/${meeting._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: meeting.title,
        date: meeting.date,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Update failed");
  return data.updatedMeeting;
};

// Move a meeting to "previous"
export const endMeeting = async (id) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(
    `${API_URL}/Previousmeetings/end-meeting/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // Optional: parse and show error message from server
    const errorText = await response.text();
    throw new Error(errorText || "Failed to end meeting");
  }

  const data = await response.json().catch(() => ({})); // In case backend sends plain text
  return data;
};

// Get all previous meetings
export const getPreviousMeetings = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/Previousmeetings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const deletePreviousMeeting = async (id) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/Previousmeetings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// Function to save meeting data (transcript + AI summary)
export const saveMeetingData = async (roomid, transcript) => {
  const token = localStorage.getItem("authToken"); // Assuming JWT token is stored in localStorage

  try {
    // Make the POST request using fetch
    const response = await fetch(`${API_URL}/notes/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token for authentication
      },
      body: JSON.stringify({ roomid, transcript }), // Sending roomid and transcript
    });

    if (!response.ok) {
      throw new Error("Failed to save meeting");
    }

    const data = await response.json();

    // Log and return the AI summary
    console.log("Meeting saved:", data);
    return data.summary; // Return AI summary if everything is successful
  } catch (error) {
    console.error("Error saving meeting:", error);
    throw new Error("Failed to save meeting");
  }
};

// Fetch all notes
export async function getAllNotes() {
  const response = await fetch(`${API_URL}/notes/notes`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  return await response.json();
}

// Delete a note by ID
export async function deleteNoteById(id) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete note with id ${id}`);
  }
  return await response.json(); // or return true/false based on your API
}

// Download a note’s file blob for download
export async function downloadNoteById(id) {
  const response = await fetch(`${API_URL}/notes/download-notes/${id}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      // Do not set 'Content-Type' for blob downloads
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to download note with id ${id}`);
  }
  return await response.blob();
}
