const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { kv } = require("@vercel/kv");

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

function errorResponse(res, status, message) {
  return res.status(status).json({ success: false, error: message });
}

app.post("/approve-certification", async (req, res) => {
  try {
    const { studentAddress } = req.body;

    if (!studentAddress) {
      return errorResponse(res, 400, "Student address is required");
    }

    const studentData = await kv.get(studentAddress);
    if (!studentData) {
      return errorResponse(res, 404, "Student not found in database");
    }

    const certId = crypto.randomBytes(16).toString("hex");

    studentData.certId = certId;
    studentData.certificationApproved = true;
    await kv.set(studentAddress, studentData);

    res.json({ success: true, message: "Certification approved", certId });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

app.get("/certificate", async (req, res) => {
  try {
    const { studentAddress } = req.query;

    if (!studentAddress) {
      return errorResponse(res, 400, "Student address is required");
    }

    const studentData = await kv.get(studentAddress);
    if (!studentData || !studentData.certificationApproved) {
      return errorResponse(res, 404, "Student not approved for certification");
    }

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

app.post("/add-student", async (req, res) => {
  const { studentAddress, name, course, graduationDate } = req.body;

  if (!studentAddress || !name || !course || !graduationDate) {
    return errorResponse(res, 400, "All fields are required");
  }

  await kv.set(studentAddress, {
    name,
    course,
    graduationDate,
    certificationApproved: false,
  });
  res.json({ success: true, message: "Student added to database" });
});

app.get("/", (req, res) => {
  res.send("Welcome to AlphaVerify Application Programming Interface");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});