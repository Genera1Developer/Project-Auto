Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: public/components/Menu.js
CONTENT: 
```js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch('api/menu-items')
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  return (
    <nav>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            <Link to={item.url}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
```