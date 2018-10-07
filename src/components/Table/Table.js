import React from 'react';
import './Table.css';

const Table = ({list, onClick, searchKey}) => {  
   
    return (
    <div className="photo-table">
     {list.map(item => 
        <div key={item.id} className="photo-item">
          <img 
            src={item.urls.thumb} 
            alt='' 
            onClick ={() => onClick(item.id)}
            />
        </div>
      )}  
    </div>
    )
};

export default Table;