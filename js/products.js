/*
  
  Fields:
    id         - unique number, used to find a product later (cart, wishlist)
    name       - product name shown on the card
    category   - main category (must match filter pill text on Products page)
    subcategory- more specific grouping (not shown as a filter yet, but
                 stored now so it's ready if a subcategory filter is added)
    price      - number (not a string) so we can do maths on it directly
    rating     - number out of 5, used to build the star display
    status     - "New" | "Coming Soon" | "" (regular) — drives the
                 Newly Released / Coming Soon sections on Home
    image      - path to the product image (placeholder note added
                 for images that don't exist yet)
*/

const products = [
  // ---------- ACTION FIGURES ----------
  { id: 1, name: "Spider-Man Deluxe Figure", category: "Action Figures", subcategory: "Marvel", price: 24.99, rating: 4.8, status: "New", image: "images/action-figures/marvel/image-2026-07-24T174220.916-removebg-preview.png" },
  { id: 2, name: " Armored Batman Figure-2016", category: "Action Figures", subcategory: "DC", price: 25.99, rating: 4.8, status: "", image: "images/action-figures/dc/616dEpja3nL._AC_UF894_1000_QL80_-removebg-preview.png" },
  { id: 3, name: "Robin Figure", category: "Action Figures", subcategory: "DC", price: 19.99, rating: 4.5, status: "", image: "images/action-figures/dc/4fa4f5de-c607-40b0-8a80-b0f6e76b1477-removebg-preview.png" },
  { id: 4, name: "Avengers: Doomsday- Dr.Doom Exclusive Figure", category: "Action Figures", subcategory: "Marvel", price: 29.99, rating: 4.9, status: "Coming Soon", image: "images/action-figures/marvel/hot-toys-marvel-doctor-doom-uk.webp" },
  { id: 5, name: "Captain America Statue- Avengers: Endgame", category: "Action Figures", subcategory: "Marvel", price: 34.99, rating: 4.7, status: "", image: "images/action-figures/marvel/FIGDIA68069_1-removebg-preview.png" },
  { id: 6, name: "Wolverine Articulated Figure", category: "Action Figures", subcategory: "Marvel", price: 22.99, rating: 4.6, status: "", image: "images/action-figures/marvel/61l01wGi08L-removebg-preview.png" },

  // ---------- FUNKO POPS ----------
  { id: 7, name: "Funko Pop! Deadpool", category: "Funko Pops", subcategory: "Marvel", price: 14.99, rating: 4.7, status: "New", image: "images/funko-pops/marvel/20028179_ALT01.webp" },
  { id: 8, name: "Funko Pop! Batman", category: "Funko Pops", subcategory: "DC", price: 13.99, rating: 4.6, status: "", image: "images/funko-pops/dc/Screenshot 2026-09-10 192144.png" },
  { id: 9, name: "Funko Pop! Mr.Fantastic", category: "Funko Pops", subcategory: "Marvel", price: 16.99, rating: 4.9, status: "Coming Soon", image: "images/funko-pops/marvel/mrf.png" },
  { id: 10, name: "Funko Pop! Steve Harrington", category: "Funko Pops", subcategory: "Television", price: 13.99, rating: 4.4, status: "", image: "images/funko-pops/television/94354_POP_ST_S5_S4_POP-2_GLAM-1-WEB.png" },
  { id: 11, name: "Funko Pop! Spider-Man", category: "Funko Pops", subcategory: "Marvel", price: 14.99, rating: 4.8, status: "", image: "images/funko-pops/marvel/FN-POP-00083964.webp" },
{ id: 12, name: "Funko Pop! Hulk", category: "Funko Pops", subcategory: "Marvel", price: 14.99, rating: 4.8, status: "", image: "images/funko-pops/marvel/hulk.png" },
{ id: 13, name: "Funko Pop! Thor", category: "Funko Pops", subcategory: "Marvel", price: 14.99, rating: 4.8, status: "", image: "images/funko-pops/marvel/thor.png" },
{ id: 14, name: "Funko Pop! Superman", category: "Funko Pops", subcategory: "DC", price: 14.99, rating: 4.8, status: "", image: "images/funko-pops/dc/superman.png" },
  // ---------- MODEL CARS ----------
  { id: 15, name: "Bburago Mclaren F1 Model(MCL38)", category: "Model Cars", subcategory: "F1-Bburago", price: 39.99, rating: 4.7, status: "New", image: "images/model-cars/f1/7159pbfDbxL-removebg-preview.png" },
  { id: 16, name: "Bburago Lamborghini Diecast", category: "Model Cars", subcategory: "Bburago", price: 27.99, rating: 4.5, status: "", image: "images/model-cars/bburago/61RyZp-O8KL-removebg-preview.png" },
  { id: 17, name: "Red Bull F1 Diecast Model(RB21)", category: "Model Cars", subcategory: "F1-Bburago", price: 42.99, rating: 4.8, status: "Coming Soon", image: "images/model-cars/f1/71tAFn6EBtL._AC_UF894_1000_QL80_-removebg-preview (1).png" },
  { id: 18, name: "GTR-R34 Model Car-F&F", category: "Model Cars", subcategory: "Other", price: 21.99, rating: 4.3, status: "", image: "images/model-cars/other/JAD37771-Fast-Furious-118-1999-Nissan-Skyline-GT-R-R34-01.webp" },

  // ---------- BOARD GAMES ----------
  { id: 19, name: "Catan Board Game", category: "Board Games", subcategory: "", price: 44.99, rating: 4.9, status: "New", image: "images/board-games/images__3_-removebg-preview.png" },
  { id: 20, name: "Monopoly Classic Edition", category: "Board Games", subcategory: "", price: 24.99, rating: 4.4, status: "", image: "images/board-games/816dE7TY9xL-removebg-preview.png" },
  { id: 21, name: "Ticket to Ride", category: "Board Games", subcategory: "", price: 39.99, rating: 4.7, status: "", image: "images/board-games/images__2_-removebg-preview.png" },

  // ---------- TOYS ----------
  { id: 22, name: "Wooden Building Blocks Set", category: "Toys", subcategory: "", price: 18.99, rating: 4.5, status: "New", image: "images/toys/81tnEH0VoOL._AC_SX569_-removebg-preview.png" },
  { id: 23, name: "Remote Control Racer", category: "Toys", subcategory: "", price: 32.99, rating: 4.6, status: "Coming Soon", image: "images/toys/images__1_-removebg-preview.png" },
  { id: 24, name: "Classic Rubik's Cube", category: "Toys", subcategory: "", price: 9.99, rating: 4.2, status: "", image: "images/toys/6063968-rubik-s-cube-the-original-3x3-colour-matching-puzzle-classic-problem-solving-cube-removebg-preview.png" },
];
