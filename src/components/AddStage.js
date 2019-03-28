import React from 'react';
import './AddStage.scss';

const AddStage = ({ addStage }) => {
  return (
    <div className="add_stage">
      <div className="vertical_line" />
      <div className="round_outside">
        <div className="round_inside" onClick={ addStage }>
          <span role="img" aria-label="Plus">&#10133;</span>
        </div>
      </div>
    </div>
  )
}

export default AddStage;
