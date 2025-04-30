import './SearchColumn.css';
import SearchBar from '../SearchBar/SearchBar';

const SearchColumn = ({ onSearch }) => {
    return (
        <div className='searchcolumn-wrapper'>
            <SearchBar onSearch={onSearch} />
        </div>
    );
};

export default SearchColumn;