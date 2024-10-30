const axios = require('axios');

const sendEmail = async (to, subject, text) => {
    try {
        const response = await axios.post("http://localhost:3333/send-email", {
            to, subject, text
        });
        console.log("Email sent successfully: ", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Failed to send email: ", error?.response?.data || error.message); // Log full error details
        console.error("Failed to send email: ", error.message);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;