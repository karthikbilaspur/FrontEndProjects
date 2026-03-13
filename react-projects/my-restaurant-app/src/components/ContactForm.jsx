    // src/components/ContactForm.jsx
    import React, { useState } from 'react';
    import './ContactForm.css'; // We'll create this CSS file next

    function ContactForm() {
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      const [errors, setErrors] = useState({});
      const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
         ...prevData,
          [name]: value,
        }));
      };

      const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email address is invalid';
        }
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.message) newErrors.message = 'Message is required';
        return newErrors;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
          console.log('Form Data Submitted:', formData);
          // In a real application, you would send this data to a backend server.
          // For now, simulate success.
          setSubmissionStatus('success');
          alert('Message sent successfully!');

          // Reset form
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
          setErrors({});
        } else {
          setSubmissionStatus('error');
        }
      };

      return (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name? 'input-error' : ''}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email? 'input-error' : ''}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={errors.subject? 'input-error' : ''}
            />
            {errors.subject && <p className="error">{errors.subject}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message? 'input-error' : ''}
            ></textarea>
            {errors.message && <p className="error">{errors.message}</p>}
          </div>

          <button type="submit">Send Message</button>

          {submissionStatus === 'success' && (
            <p className="submission-message success">Your message has been sent!</p>
          )}
          {submissionStatus === 'error' && (
            <p className="submission-message error">Please correct the errors in the form.</p>
          )}
        </form>
      );
    }

    export default ContactForm;