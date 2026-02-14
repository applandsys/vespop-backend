
const fraudCheckRequest = async (req, res) => {
    try {
        const apiKey = process.env.FRAUD_CHECKER_API;
         const phone = req.body.phone;
      //  const phone = "01837664478";

        const formData = new FormData();
        formData.append("phone", phone);

        const response = await fetch("https://fraudchecker.link/api/v1/qc/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    fraudCheckRequest
}