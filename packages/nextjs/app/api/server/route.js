const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const port = 3000;

app.use(cors()); // This enables CORS for all routes
app.use(express.json());

// Simulated database of students and their certifications
const studentDatabase = new Map();

app.post("/approve-certification", async (req, res) => {
  try {
    const { studentAddress } = req.body;

    // Check if the student exists in the database
    if (!studentDatabase.has(studentAddress)) {
      return res.status(404).json({ success: false, error: "Student not found in database" });
    }

    // Generate a unique certId
    const certId = crypto.randomBytes(16).toString("hex");

    // Update the student's record with the new certification
    const studentData = studentDatabase.get(studentAddress);
    studentData.certId = certId;
    studentData.certificationApproved = true;
    studentDatabase.set(studentAddress, studentData);

    res.json({ success: true, message: "Certification approved", certId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/certificate/:studentAddress", async (req, res) => {
  try {
    const studentAddress = req.params.studentAddress;

    // Check if the student exists and is approved for certification
    if (!studentDatabase.has(studentAddress) || !studentDatabase.get(studentAddress).certificationApproved) {
      return res.status(404).json({ success: false, error: "Student not approved for certification" });
    }

    const studentData = studentDatabase.get(studentAddress);

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
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to add a student to the database (for demonstration purposes)
app.post("/add-student", (req, res) => {
  const { address, name, course, graduationDate } = req.body;
  studentDatabase.set(address, { name, course, graduationDate, certificationApproved: false });
  res.json({ success: true, message: "Student added to database" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});