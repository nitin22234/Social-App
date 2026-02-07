import { Search, Bell, User } from 'lucide-react';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="header">
            <h1>Social App</h1>
            <div className="search-bar">
                <Search size={18} color="#65676b" />
                <input type="text" placeholder="Search promotions, users, posts..." />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <Bell size={24} color="#65676b" />
                <User size={24} color="#65676b" />
            </div>
        </header>
    );
};

export default Header;
