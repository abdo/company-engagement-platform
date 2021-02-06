const request = async ({
  url = 'https://database-aab0.restdb.io/rest/posts?metafields=true',
  method = 'GET',
  headers = {},
  body,
}) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-apikey': '601cbdd36adfba69db8b6d9d',
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return response.json(); // parses JSON response into native JavaScript objects
};

const showFeedback = ({ text = '', duration = 2, error = false }) => {
  const feedbackContainer = document.querySelector('.feedback');
  feedbackContainer.innerHTML = `<p class='${
    error ? 'error' : ''
  }'>${text}</p>`;
  setTimeout(() => {
    feedbackContainer.innerHTML = '';
  }, duration * 1000);
};

const formatDate = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return (
    date.getMonth() +
    1 +
    '/' +
    date.getDate() +
    '/' +
    date.getFullYear() +
    '  ' +
    strTime
  );
};

const renderPosts = (passedPosts) => {
  const postsContainer = document.querySelector('.posts-container');
  const renderedPosts = passedPosts.sort(
    (a, b) => new Date(b._created) - new Date(a._created),
  );

  postsContainer.innerHTML = '';
  [...passedPosts].forEach((post) => {
    const { content, comments = [], _id, _created } = post;
    const commentButtonIdentifierClassname = `comment-button-${_id}`;
    const commentInputIdentifierClassname = `comment-input-${_id}`;
    const renderedDate = formatDate(new Date(_created));

    postsContainer.innerHTML += `<div class="post">
        <p class="content">
          ${content}
        </p>
        <p class="date">
          Created at: ${renderedDate}
        </p>
        ${comments.length !== 0 ? '<p>Comments:</p>' : ''}
        ${comments
          .map(
            (comment) => `
        <div class="comment">
          ${comment}
        </div>
        `,
          )
          .join('')}
        <div class="comment-input-container">
          <input class="comment-input comment-input-${_id}" placeholder="Create comment" oninput="onInputCommentChange('${_id}')" />
          <button class="button--secondary comment-button-${_id}" disabled onclick="onComment('${_id}')">Comment</button>
        </div>
      </div>`;
  });
};
