"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false, showFavBox = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const loggedIn = Boolean(currentUser);
  const showFavoriteBox = Boolean(loggedIn && showFavBox)
  console.log(showFavoriteBox)

  return $(`
      <li id="${story.storyId}">
        ${showDeleteButton ? createDeleteButton(story, currentUser) : ""}
        ${showFavoriteBox ? getFavBox(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function createDeleteButton() {
  return `<button id="deleteBtn">Delete</button>`
}

function getFavBox(story, currentUser) {
  let checkStatus;
  if (currentUser.isFavorite(story)) {
    checkStatus = "checked"
  }
  else {
    checkStatus = " "
  }
  return `<input type="checkbox" id="checkbox" ${checkStatus}></input>`
}




/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, false, true);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Get and show new story when new story form is submitted. //

async function getAndShowStoryOnSubmit(evt) {
  console.debug("story submitted", evt);
  evt.preventDefault();

  const author = $("#story-author").val();
  const title= $("#story-title").val();
  const url = $("#story-url").val();
  const username = currentUser.username;

  const newStory = await storyList.addStory(currentUser, {author, title, url, username});
  currentUser.addOwnStory(newStory);
  generateStoryMarkup(newStory);
  putStoriesOnPage()

  // $addStoryForm.trigger("reset");
  $addStoryForm.hide()
}

$addStoryForm.on("submit", getAndShowStoryOnSubmit);

// Shows favorites
function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $favStoriesList.empty();

  // loop through all of our stories and generate HTML for the Favorites
  for (let story of storyList.stories) {
    if (currentUser.isFavorite(story)) {
      const $story = generateStoryMarkup(story, false, true);
      $favStoriesList.append($story);
    }
  }
  $favStoriesList.show();
}

// Favorite/Un-favorite a story with the API
async function recordAddorDeleteFavorites(evt) {
  console.debug("recordAddorDeleteFavorites")

// Find the LI assosciated with the checkbox and that story's id
  const $closestLi = evt.target.closest("li");
  const storyId = $closestLi.getAttribute("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // If the box is now checked, add to favorites
  if (evt.target.checked) {
    await currentUser.addFavorite(story)
  }
  // If the box is now unchecked, remove from favorites
  else {
    await currentUser.deleteFavorite(story);
  // reload favorite stories on page so that the deleted story is removed
    await putFavStoriesOnPage()
  }
}
// Allows recordAddorDeleteFavorites to fun whether checking on the full story list or favorites list
$allStoriesList.on("click", "#checkbox", recordAddorDeleteFavorites)
$favStoriesList.on("click", "#checkbox", recordAddorDeleteFavorites)

// Shows stories added by the user
function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");

  $ownStoriesList.empty();

  // loop through all of our stories and generate HTML for the ones we added
  for (let story of storyList.stories) {
    if (currentUser.isOwnStory(story)) {
      const $story = generateStoryMarkup(story, true, false);
      $ownStoriesList.append($story);
    }
  }
  $ownStoriesList.show();
}


// Delete own story with the API
async function recordDeleteOwnStory(evt) {
  console.debug("recordDeleteOwnStory")

  const $closestLi = evt.target.closest("li");
  const storyId = $closestLi.getAttribute("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  await storyList.deleteOwnStory(story, currentUser);
  await putOwnStoriesOnPage()
}

$ownStoriesList.on("click", "#deleteBtn", recordDeleteOwnStory)
