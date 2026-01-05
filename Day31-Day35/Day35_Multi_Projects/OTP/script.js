// script.js
const inputs = document.querySelectorAll(".otp-field > input");
const button = document.querySelector(".btn");

// Add event listeners for input fields
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener("keyup", (e) => {
        if (e.key === "Backspace" && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

// Add autocomplete functionality to the first input field
const ac = new Autocomplete(inputs[0], {
    data: [
        { label: '123456', value: '123456' },
        { label: '654321', value: '654321' },
        // Add more data here...
    ],
    maximumItems: 5,
    threshold: 1,
    onSelectItem: ({ label, value }) => {
        // Handle selected OTP value
        console.log(value);
        // Fill in the OTP fields
        inputs.forEach((input, index) => {
            input.value = value[index];
        });
    },
});