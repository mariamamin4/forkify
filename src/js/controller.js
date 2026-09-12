import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView  from './views/searchView.js';
import resultsView  from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView  from './views/bookmarksView.js';
import addRecipeView  from './views/addRecipeView.js';


// import icons from '../img/icons.svg' //parcel 1
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// if(module.hot){
//     module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes =async function(){

  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // renderSpinner(recipeContainer);
    //loading recipe
    await model.loadRecipe(id);
    // const {recipe} = model.state;

    //Rendering recipe 
    recipeView.render(model.state.recipe);
  
  }
  catch(err){
    // console.log(err);
    recipeView.renderError();
  };

};
const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    //Get search query
    const query =searchView.getQuery();
    if(!query) return;

    //load search results
   await model.loadSearchResults(query);
   
   //render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render the initial pagination buttons
    paginationView.render(model.state.search);

  } catch(err){
    console.log(err);
  }
};

const controlPagination= function(goToPage){
    //render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

    //render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings=function(newServings){
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Updating the recipe view.
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark=function(){
  if(!model.state.recipe.bookmarked)  model.addBookmark(model.state.recipe);
 else  model.deleteBookmark(model.state.recipe.id);


  recipeView.update(model.state.recipe);

  //Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}
const controlAddRecipe= async function(newRecipe){
  try{
    addRecipeView.renderSpinner();

   await model.uploadRecipe(newRecipe);
   console.log(model.state.recipe);
   recipeView.render(model.state.recipe);
   //SUCCESS
   addRecipeView.renderMessage();
   bookmarksView.render(model.state.bookmarks);

   window.history.pushState(null,'',`#${model.state.recipe.id}`);

   //close form
   setTimeout(function(){
    addRecipeView.toggleWindow()
   },MODAL_CLOSE_SEC*1000);

  }catch(err){
    console.error('❌',err);
    addRecipeView.renderError(err.message);
  }


}
const newFeature=function(){
  console.log('Welcome to the new Application!');
}
const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView. addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
 newFeature();
}
init();