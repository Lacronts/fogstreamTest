import React from 'react';
import './AddItem.scss';

const AddItem = ({ addItem, stageId, stepId, type }) => {
  return (
    <div className="add_item">
      <div className="round_outside">
        <div className="round_inside" onClick={ () => addItem(stageId, stepId, type) }>
          <span role="img" aria-label="Plus">&#10133;</span>
        </div>
      </div>
    </div>
  )
}

export default AddItem;
