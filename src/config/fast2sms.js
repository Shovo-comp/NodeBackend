const axios = require('axios');

const sendOTP = async (phone, otp) => {
    try {
      const response = await axios.post(
        `https://www.fast2sms.com/dev/bulkV2`,
        {
          route: 'otp',
          variables_values: otp,
          message: `Your OTP is ${otp}`,
          numbers: phone,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
          },
        }
      );
      console.log('OTP sent successfully:', response.data)
      return response.data;
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      console.log(error);
      throw new Error('Could not send OTP');
    }
}
  
module.exports = { sendOTP };