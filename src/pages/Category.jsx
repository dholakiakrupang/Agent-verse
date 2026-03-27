import { useTheme } from '../context/ThemeContext';
import categorySvg from '../assets/category.svg';

export default function Category() {
  // Category only has one dark SVG currently, so we use it for both themes.
  const { theme } = useTheme();
  
  return (
    <div className={`svg-page-container animate-fade-in theme-${theme}`}>
      <img 
        src={categorySvg} 
        alt="Categories" 
        className="svg-page-image" 
      />
    </div>
  );
}
