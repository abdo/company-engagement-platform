const postInput = document.querySelector('.post-input');
const postButton = document.querySelector('.post-button');

let posts = [];

// Retrieve posts
request({
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

  const tempPostId = String(Math.random()).replace('.', '');

  posts = [...posts, { content: postValue, _id: tempPostId, _created:new Date() }];
  renderPosts(posts);

  // Create post request
  request({
    method: 'POST',
    body: { content: postValue },
  })
    .then((createdPost) => {
      posts = posts.map((post) => {
        if (post._id === tempPostId) {
          post._id = createdPost._id;
        }
        return post;
      });
      renderPosts(posts);
      showFeedback({ text: 'Post successfully created' });
    })
    .catch(() => {
      showFeedback({ text: 'Error creating post', error: true });
      posts.pop();
      renderPosts(posts);
    });
};

const onInputCommentChange = (postId) => {
  const inputClassname = `comment-input-${postId}`;
  const buttonClassname = `comment-button-${postId}`;

  const commentInput = document.querySelector(`.${inputClassname}`);
  const commentButton = document.querySelector(`.${buttonClassname}`);

  const commentValue = commentInput.value;
  if (commentValue.length >= 3) {
    commentButton.disabled = false;
  } else {
    commentButton.disabled = true;
  }
};

const onComment = (postId) => {
  const inputClassname = `comment-input-${postId}`;
  const commentInput = document.querySelector(`.${inputClassname}`);

  const commentValue = commentInput.value;

  let newComments = [];
  posts = posts.map((post) => {
    if (post._id === postId) {
      newComments = [...(post.comments || []), commentValue];
      post.comments = newComments;
    }
    return post;
  });
  renderPosts(posts);

  // Create comment request
  request({
    url: `https://database-aab0.restdb.io/rest/posts/${postId}`,
    method: 'PUT',
    body: { comments: newComments },
  })
    .then(() => {
      showFeedback({ text: 'Comment successfully created' });
    })
    .catch(() => {
      showFeedback({ text: 'Error creating comment', error: true });
    });
};
