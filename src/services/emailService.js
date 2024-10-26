const axios = require('axios');

const sendEmail = async (to, subject, text) => {
    try {
        const response = await axios.post("http://localhost:3333/send-email", {
            to, subject, text
        });
        return response.data;
    }
    catch (error) {
        console.error("Failed to send email: ", error.message);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;