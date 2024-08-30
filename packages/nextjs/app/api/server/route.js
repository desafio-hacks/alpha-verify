const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const studentDatabase = new Map();

function errorResponse(res, status, message) {
  return res.status(status).json({ success: false, error: message });
}

app.post("/approve-certification", (req, res) => {
  try {
    const { studentAddress } = req.body;

    if (!studentAddress) {
      return errorResponse(res, 400, "Student address is required");
    }

    if (!studentDatabase.has(studentAddress)) {
      return errorResponse(res, 404, "Student not found in database");
    }

    const certId = crypto.randomBytes(16).toString("hex");

    const studentData = studentDatabase.get(studentAddress);
    studentData.certId = certId;
    studentData.certificationApproved = true;
    studentDatabase.set(studentAddress, studentData);

    res.json({ success: true, message: "Certification approved", certId });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

app.get("/certificate", (req, res) => {
  try {
    const { studentAddress } = req.query;

    if (!studentAddress) {
      return errorResponse(res, 400, "Student address is required");
    }

    if (!studentDatabase.has(studentAddress) || !studentDatabase.get(studentAddress).certificationApproved) {
      return errorResponse(res, 404, "Student not approved for certification");
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
    errorResponse(res, 500, error.message);
  }
});

app.post("/add-student", (req, res) => {
  const { address, name, course, graduationDate } = req.body;

  if (!address || !name || !course || !graduationDate) {
    return errorResponse(res, 400, "All fields are required");
  }

  studentDatabase.set(address, { name, course, graduationDate, certificationApproved: false });
  res.json({ success: true, message: "Student added to database" });
});

app.get("/", (req, res) => {
  res.send("Welcome to AlphaVerify Application Programming Interface");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// {"address": "0xb7B943fFbA78e33589971e630AD6EB544252D88C", "name": "Nobel Samuel", "course": "Programming", "graduationDate": "21-08-2024"}