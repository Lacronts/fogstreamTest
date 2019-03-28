import React, { useState, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import AddItem from './AddItem';
import Tooltip from 'react-tooltip-lite';
import Form from './Form'

const StepsBlock = ({ stageId, step, addItem, saveChange, deleteStep }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemsCount = step.items.length;
  const stepFrom = useRef();
  const stepTo = useRef();

  const toggleTooltip = () => {
    setIsOpen(!isOpen);
  }

  const onDragStart = (e, index) => {
    stepFrom.current = index;
  }

  const onDragOver = (index) => {
    stepTo.current = index;
    if (stepFrom.current === index) {
      return;
    }
  }

  const onDragEnd = (e) => {
    e.stopPropagation();
    const clone = cloneDeep(step);
    const cloneItems = clone.items;
    const fromIndex = stepFrom.current;
    const toIndex = stepTo.current;
    [cloneItems[fromIndex], cloneItems[toIndex]] = [cloneItems[toIndex], cloneItems[fromIndex]];
    saveChange(clone, 'step', stageId);
  }

  const data = <Form
                data={step}
                toggleTooltip={toggleTooltip}
                stageId={stageId}
                saveChange={saveChange}
               />

  return (
    <div className="steps_block">
      <div className="delete_item" onClick={() => deleteStep(stageId, step.id)}>&times;</div>
      <div className="description_block">
        <Tooltip content={data} isOpen={isOpen}>
          <div className="stage" onClick={toggleTooltip}>
            { step.name }
          </div>
        </Tooltip>
        <div className="resp" onClick={toggleTooltip}>
          { step.resp }
        </div>
        <div className="time" onClick={toggleTooltip}>
          { step.time }
        </div>
        <hr className="hr"/>
      </div>
      <div className="task_block">
        {
          step.items.map((stepItem, index) => (
            <div
              className="item"
              key={stepItem.id}
              onClick={toggleTooltip}
              draggable
              onDragStart={e => onDragStart(e, index)}
              onDragOver={() => onDragOver(index)}
              onDragEnd={(e) => onDragEnd(e)}
            >
              <div className="vertical_line" />
              <div className="image">
                <img src={require("../img/item.png")} alt="stage item"/>
              </div>
              <div className="name">
                { stepItem.name }
              </div>
              <hr className="hr"/>
            </div>
          ))
        }
        {
          itemsCount < 3 &&
          <div className="item">
            <AddItem
              stageId={stageId}
              addItem={addItem}
              type='step'
              stepId={step.id}
              />
          </div>
        }
      </div>
    </div>
  )
}

export default StepsBlock;
