import React from 'react';
import './AddStep.scss';

const AddStep = ({ id, addStep }) => {
  return (
    <div className="add_step">
      <div className="vertical_line" />
      <div className="round_outside">
        <div className="round_inside" onClick={() => addStep(id)}>
          <span role="img" aria-label="Plus">&#10133;</span>
        </div>
      </div>
    </div>
  )
}

export default AddStep;
