
// 1. Speech Recognition Setup and Button Event Listener
// Check if the browser supports SpeechRecognition API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US"; // Set language for recognition

// Event listener for voice button
document.getElementById("voiceButton").onclick = () => {
  recognition.start(); // Start listening to the user's voice
};

// Handle speech recognition result
recognition.onresult = (event) => {
  const voiceQuery = event.results[0][0].transcript; // Get the spoken text
  document.getElementById("searchinput").value = voiceQuery; // Populate the search input with the voice query
  searchrecipe(); // Call the search function to perform the recipe search
};

// Handle speech recognition errors
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  alert("Sorry, there was an issue with voice recognition.");
};


// 2. Add Item to Cart Functionality
// Function to add item to the cart
function addToCart(recipeName, recipeImage, calories, recipeUrl) {
  const cartItem = {
    name: recipeName,
    image: recipeImage,
    calories: calories,
    url: recipeUrl,
  };

  // Get the current cart from localStorage, or initialize as an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Add the new item to the cart
  cart.push(cartItem);

  // Save the updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${recipeName} has been added to your cart!`);
}


// 3. Recipe Search Function
// Function to search recipes
async function searchrecipe() {
  const searchInput = document.getElementById("searchinput").value;
  const recipeContainer = document.getElementById("recipecontainer");
  const foodCardsContainer = document.getElementById("dynamic-food-cards");
  const backButton = document.getElementById("backButton");

  if (searchInput === "") {
    alert("Please enter a recipe");
    return;
  }

  foodCardsContainer.style.display = "none"; // Hide the food cards
  backButton.style.display = "inline-block"; // Show the back button when recipes are visible

  try {
    const response = await fetch(
      `https://api.edamam.com/search?q=${searchInput}&app_id=40b53e5e&app_key=a9916ab9a735ea18f2077365e39861a5`
    );
    const data = await response.json();

    if (data.hits.length === 0) {
      recipeContainer.innerHTML = "<p>No recipes found for your search.</p>";
      return;
    }

    // Display fetched recipes
    data.hits.forEach((recipe) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      recipeDiv.innerHTML = `
        <h2>${recipe.recipe.label}</h2>
        <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
        <p>Calories: ${Math.round(recipe.recipe.calories)}</p>
        <p>Servings: ${recipe.recipe.yield}</p>
        <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        <button onclick="addToCart('${recipe.recipe.label}', '${recipe.recipe.image}', ${Math.round(recipe.recipe.calories)}, '${recipe.recipe.url}')">
            Add to Cart
        </button>
      `;

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML =
      "<p>There was an error fetching recipes. Please try again later.</p>";
  }
}


// 4. Page Load and Cart Initialization
window.onload = function () {
  // Check if user is logged in
  let isLoggedIn = window.localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    fetchFoodCards(); // Display food cards if not logged in
    document.getElementById("logoutButton").style.display = "none"; // Hide logout button
  } else {
    fetchFoodCards(); // Display food cards if logged in
    document.getElementById("logoutButton").style.display = "inline-block"; // Show logout button
  }
};



// 5. Food Cards Setup
// Function to display food cards
async function fetchFoodCards() {
  const foodItems = [
    { name: "Chicken", description: "Delicious grilled chicken with spices", imageUrl: "chicken.jpg" },
    { name: "Mutton", description: "Tender mutton curry with herbs", imageUrl: "./mutton.webp" },
    { name: "Ice Cream", description: "Creamy vanilla ice cream topped with chocolate sauce", imageUrl: "./ice cream.webp" },
    { name: "Biryani", description: "Aromatic biryani with rice and spices", imageUrl: "./Biryani.jpg" },
    { name: "Pizza", description: "Cheesy pizza with a crispy crust", imageUrl: "./pizza.jpg" },
    { name: "Pasta", description: "Creamy pasta with mushrooms and cheese", imageUrl: "./pasta.avif" },
  ];

  const foodCardsContainer = document.getElementById("dynamic-food-cards");

  // Generate food cards dynamically
  foodItems.forEach((item) => {
    const foodCard = document.createElement("div");
    foodCard.classList.add("food-card");    
    foodCard.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <button onclick="checkLoginAndSearch('${item.name}')">Search for ${item.name} Recipe</button>`;
    foodCardsContainer.appendChild(foodCard);
  });
}



// 6. Login Check Before Action
// Function to check if user is logged in before performing any action
function checkLoginAndSearch(foodItem) {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    alert("You need to login.");
    window.location.href = "login.html"; // Redirect to login page
    return;
  }

  // If logged in, proceed with searching the recipe
  searchForRecipe(foodItem);
}


// 7. Logout Button Functionality
// Logout button functionality
document.getElementById("logoutButton").addEventListener("click", function () {
  window.localStorage.removeItem("isLoggedIn"); // Remove login status
  alert("You have been logged out.");
  window.location.href = "login.html"; // Redirect to login page
});

