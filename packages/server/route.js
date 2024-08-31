const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Path to the JSON file
const studentFilePath = path.join(__dirname, "students.json");

// Initialize the student database if it doesn't exist
function initializeStudentDatabase() {
  if (!fs.existsSync(studentFilePath)) {
    const initialData = {
      students: {},
    };
    fs.writeFileSync(studentFilePath, JSON.stringify(initialData, null, 2));
  }
}

// Function to read the student database from JSON file
function readStudentDatabase() {
  initializeStudentDatabase(); // Ensure the file is initialized
  const data = fs.readFileSync(studentFilePath, "utf8");
  return JSON.parse(data);
}

// Function to write the student database to JSON file
function writeStudentDatabase(data) {
  fs.writeFileSync(studentFilePath, JSON.stringify(data, null, 2));
}

// Function to handle errors
function errorResponse(res, status, message) {
  return res.status(status).json({ success: false, error: message });
}

// Approve certification endpoint
app.post("/approve-certification", (req, res) => {
  try {
    const { studentAddress } = req.body;
    const studentDatabase = readStudentDatabase();

    if (!studentAddress) {
      return errorResponse(res, 400, "Student address is required");
    }

    if (!studentDatabase.students[studentAddress]) {
      return errorResponse(res, 404, "Student not found in database");
    }

    const certId = crypto.randomBytes(16).toString("hex");

    studentDatabase.students[studentAddress].certId = certId;
    studentDatabase.students[studentAddress].certificationApproved = true;
    writeStudentDatabase(studentDatabase);

    res.json({ success: true, message: "Certification approved", certId });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

// Get certificate details endpoint
app.get("/certificate", (req, res) => {
  try {
    const { studentAddress } = req.query;
    const studentDatabase = readStudentDatabase();

    if (!studentAddress) {
      return errorResponse(res, 400, "Student address is required");
    }

    if (
      !studentDatabase.students[studentAddress] ||
      !studentDatabase.students[studentAddress].certificationApproved
    ) {
      return errorResponse(res, 404, "Student not approved for certification");
    }

    const studentData = studentDatabase.students[studentAddress];

    res.json({
      success: true,
      certId: studentData.certId,
      studentName: studentData.name,
      course: studentData.course,
      graduationDate: studentData.graduationDate,
      schoolName: "Your School Name",
      message: "Certificate is ready to be minted",
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

// Add student to the database endpoint
app.post("/add-student", (req, res) => {
  const { studentAddress, name, course, graduationDate } = req.body;
  const studentDatabase = readStudentDatabase();

  if (!studentAddress || !name || !course || !graduationDate) {
    return errorResponse(res, 400, "All fields are required");
  }

  studentDatabase.students[studentAddress] = {
    name,
    course,
    graduationDate,
    certificationApproved: false,
  };

  writeStudentDatabase(studentDatabase);
  res.json({ success: true, message: "Student added to database" });
});

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to AlphaVerify Application Programming Interface");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});