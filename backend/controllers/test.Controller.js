const testController = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "test user data avaible",
    });
  } catch (error) {
    return res.status(404).send({
      success: false,
      message: "error to get test data",
    });
  }
};
module.exports = { testController };
