"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// Show Add Story Form on click on "submit" //

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $addStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $('.nav-center').show();
}

// Shows the user their list of favorite stories
function navFavStories(evt) {
  console.debug("navFavStories", evt);
  hidePageComponents();
  putFavStoriesOnPage();
}

$navFavorites.on("click", navFavStories);


// Shows the user their list of own stories
function navOwnStories(evt) {
  console.debug("navOwnStories", evt);
  hidePageComponents();
  putOwnStoriesOnPage();
}

$navMyStories.on("click", navOwnStories);