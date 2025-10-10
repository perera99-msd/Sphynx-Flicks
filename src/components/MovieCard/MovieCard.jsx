// In your MovieCard component
import { useAuth } from '../contexts/AuthContext';

const MovieCard = ({ movie }) => {
  const { user, favorites } = useAuth();
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }
    
    try {
      await FavoritesService.toggleFavorite(movie);
      // Refresh favorites from context or re-fetch
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="movie-card">
      {/* ... */}
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
        ♥
      </button>
    </div>
  );
};