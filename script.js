const postsContainer = document.querySelector('.posts-container');
const postInput = document.querySelector('.post-input');
const postButton = document.querySelector('.post-button');

let posts = [];

// Request function
const request = async ({ url = '', method = 'GET', headers = {}, body }) => {
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

const renderPosts = (passedPosts) => {
  postsContainer.innerHTML = '';
  [...passedPosts].reverse().forEach((post) => {
    const { content, comments = [] } = post;
    postsContainer.innerHTML += `<div class="post">
        <p class="content">
          ${content}
        </p>
        <div class="comment-input-container">
          <input class="comment-input" placeholder="Create comment" />
          <button class="button--secondary">Comment</button>
        </div>
        ${comments.length !== 0 ? '<p>Comments:</p>' : ''}
        ${comments.map(
          (comment) => `
        <div class="comment">
          ${comment}
        </div>
        `,
        )}
      </div>`;
  });
};

// Get posts request
request({
  url: 'https://database-aab0.restdb.io/rest/posts',
  method: 'GET',
})
  .then((returnedPosts) => {
    posts = returnedPosts;
    showFeedback({ text: 'Posts successfully retrieved' });

    renderPosts(returnedPosts);
  })
  .catch(() => {
    showFeedback({ text: 'Error retrieving posts', error: true });
  });

const onInputPostChange = () => {
  const postValue = postInput.value;
  if (postValue.length >= 24) {
    postButton.disabled = false;
  } else {
    postButton.disabled = true;
  }
};

const onPost = () => {
  const postValue = postInput.value;

  posts = [...posts, { content: postValue }];
  renderPosts(posts);

  // Create post request
  request({
    url: 'https://database-aab0.restdb.io/rest/posts',
    method: 'POST',
    body: { content: postValue },
  })
    .then(() => {
      showFeedback({ text: 'Post successfully created' });
    })
    .catch(() => {
      showFeedback({ text: 'Error creating post', error: true });
      posts.pop();
      renderPosts(posts);
    });
};
