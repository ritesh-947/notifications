import React, { useState } from 'react';

const ReplyForm = ({ answerId, onReplySubmit }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReplySubmit(answerId, replyText);
    setReplyText('');
  };

  return (
    <form onSubmit={handleReplySubmit}>
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply"
        required
      />
      <button type="submit">Submit Reply</button>
    </form>
  );
};

export default ReplyForm;