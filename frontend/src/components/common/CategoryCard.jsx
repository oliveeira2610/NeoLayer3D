import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css'; // Create CSS for styling

function CategoryCard({ category }) {
  return (
    <div className="category-card">
      <Link to={`/categorias?id=${category.id}`}> {/* Adjust link as needed, maybe /produtos?categoria=${category.id} */}
        <img 
          src={category.image_url || '/images/placeholder.png'} 
          alt={category.name} 
          className="category-card-img" 
          onError={(e) => { e.target.onerror = null; e.target.src='/images/placeholder.png'; }} // Fallback image
        />
        <div className="category-card-content">
          <h3 className="category-card-title">{category.name}</h3>
          {/* <p className="category-card-description">{category.description?.substring(0, 50)}...</p> */}
        </div>
      </Link>
    </div>
  );
}

export default CategoryCard;

