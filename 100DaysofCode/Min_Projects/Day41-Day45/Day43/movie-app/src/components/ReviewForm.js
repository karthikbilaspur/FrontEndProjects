import React, { useState } from 'react';

const ReviewForm = ({ onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || review === "") {
      setError("Please select a rating and enter a review");
      return;
    }
    onAddReview({ rating, review });
    setRating(0);
    setReview("");
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <br />
      <label>Review:</label>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Add Review</button>
    </form>
  );
};

export default ReviewForm;