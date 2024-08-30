async function GET (req, res) {
  try {
    const { studentAddress } = req.params;

    if (!studentDatabase.has(studentAddress) || !studentDatabase.get(studentAddress).certificationApproved) {
      return errorResponse(res, 404, "Student not approved for certification");
    }

    const studentData = await studentDatabase.get(studentAddress);

    res.json({
      success: true,
      certId: studentData.certId,
      studentName: studentData.name,
      course: studentData.course,
      graduationDate: studentData.graduationDate,
      schoolName: "Your School Name",
      message: "Certificate is ready to be minted",
    });
    return nextResponse(res, 200, "Certificate is ready");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }

};

export { GET }