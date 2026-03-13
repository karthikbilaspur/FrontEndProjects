    // src/components/ReservationForm.jsx
    import React, { useState } from 'react';
    import DatePicker from 'react-datepicker';
    import 'react-datepicker/dist/react-datepicker.css'; // Don't forget to import the CSS!
    import './ReservationForm.css'; // We'll create this CSS file next

    function ReservationForm() {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [phone, setPhone] = useState('');
      const [date, setDate] = useState(new Date());
      const [time, setTime] = useState('19:00'); // Default to 7 PM
      const [guests, setGuests] = useState(2);
      const [message, setMessage] = useState('');
      const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

      const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!name ||!email ||!date ||!time ||!guests) {
          setSubmissionStatus('error');
          alert('Please fill in all required fields.');
          return;
        }

        const reservationDetails = {
          name,
          email,
          phone,
          date: date.toLocaleDateString(),
          time,
          guests,
          message,
        };

        console.log('Reservation Details:', reservationDetails);

        // In a real application, you would send this data to a backend server.
        // For this example, we'll just simulate a successful submission.
        setSubmissionStatus('success');
        alert('Reservation request sent successfully! We will confirm shortly.');

        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setDate(new Date());
        setTime('19:00');
        setGuests(2);
        setMessage('');
      };

      return (
        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (Optional):</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <DatePicker
              selected={date}
              onChange={(newDate) => setDate(newDate)}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()} // Can't book in the past
              className="form-control" // Apply form-control class
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <select id="time" value={time} onChange={(e) => setTime(e.target.value)} required>
              {/* Generate time slots, e.g., every 30 mins from 17:00 to 22:00 */}
              {Array.from({ length: 11 }, (_, i) => 17 + Math.floor(i / 2))
                   .filter((value, index, self) => self.indexOf(value) === index) // Unique hours
                   .flatMap(hour => [
                        `${hour.toString().padStart(2, '0')}:00`,
                        `${hour.toString().padStart(2, '0')}:30`
                    ])
                   .filter(t => t >= '17:00' && t <= '22:00') // Filter times within range
                   .map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="guests">Number of Guests:</label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value)))} // Min 1 guest
              min="1"
              max="10" // Example max guests
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Special Requests (Optional):</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button type="submit">Request Reservation</button>

          {submissionStatus === 'success' && (
            <p className="submission-message success">Your reservation request has been sent!</p>
          )}
          {submissionStatus === 'error' && (
            <p className="submission-message error">There was an error. Please check your inputs.</p>
          )}
        </form>
      );
    }

    export default ReservationForm;