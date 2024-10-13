//When page loads it performs everything inside the brackets
document.addEventListener("DOMContentLoaded", function () {
  const filmsEndpoint = 'http://localhost:3000/films';
// Function to reduce ticket count by 1 and update API
  function reduceTicket(movieId) {
    const ticketNumElement = document.getElementById("ticket-num");
    let ticketsRemaining = parseInt(ticketNumElement.textContent);
    if (ticketsRemaining > 0) {
      ticketsRemaining--;
      ticketNumElement.textContent = ticketsRemaining;
      // Update ticket count in the API using put
      fetch(`${filmsEndpoint}/${movieId}`, {
        method: 'PUT',        
        body: JSON.stringify({
          tickets_sold: ticketsRemaining
        })
      })
    } else {
      document.getElementById("buy-ticket").textContent = "Sold";
      document.getElementById("buy-ticket").disabled = true;
    }
  }
  // Function to update movie information to the page
  function updateMovieInfo(movieData) {
    document.getElementById("poster").src = movieData.poster;
    document.getElementById("title").textContent = movieData.title;
    document.getElementById("runtime").textContent = `${movieData.runtime} minutes`;
    document.getElementById("film-info").textContent = movieData.description;
    document.getElementById("showtime").textContent = movieData.showtime;
    document.getElementById("ticket-num").textContent = movieData.tickets_sold;
    document.getElementById("film-id").textContent = movieData.id; 
  }
  // Add event listener to the "Buy Ticket" button that reduces the ticket number each time its clicked
  document.getElementById("buy-ticket").addEventListener("click", function () {reduceTicket();});
  //This function deletes the movie from the api then deletes it from the list
  function deleteMovie(movieId) {
    fetch(`${filmsEndpoint}/${movieId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
      }
      return response.json();
    })
    .then(() => {
      // removes movie from the list
      const listItem = document.getElementById(`film-${movieId}`);
      if (listItem) {listItem.remove();}
    })
  }
 //Fetches the movie title from the API then makes a list. It also creates a button for each movie that deletes it
  fetch(filmsEndpoint)
    .then(response => response.json())
    .then(data => {
      const filmsList = document.getElementById("films");
      data.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.classList.add("film", "item");
        listItem.textContent = movie.title;
        listItem.id = `film-${movie.id}`;
      //Creates a delete button that deletes each movie and its details
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function () {deleteMovie(movie.id);});
        listItem.appendChild(deleteButton);
        listItem.addEventListener("click", function () {updateMovieInfo(movie);});
filmsList.appendChild(listItem);
      });
      // Display the first movie initially
      updateMovieInfo(data[0]); 
    })
});