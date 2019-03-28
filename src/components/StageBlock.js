import React, { useState, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import StepsBlock from './StepsBlock';
import AddStep from './AddStep';
import AddItem from './AddItem';
import Tooltip from 'react-tooltip-lite';
import Form from './Form';
import './StageBlock.scss';

const StageBlock = ({ addItem, addStep, stage, saveChange, deleteStage, deleteStep }) => {
  const [vis, setVis] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const stepFrom = useRef();
  const stepTo = useRef();
  const stageItemFrom = useRef();
  const stageItemTo = useRef();
  const itemsCount = stage.items.length;
  const toggleTooltip = () => {
    setIsOpen(!isOpen);
  }
  const calculateTime = () => {
    const results = stage.steps.reduce((acc, step) => {
      let time = step.time.split(':');
      let hours = parseInt(time[0]) + acc[0];
      let minutes = parseInt(time[1]) + acc[1];
      if (minutes >= 60) {
        hours++;
        minutes = minutes - 60;
      }
      return [hours, minutes]
    }, [0, 0]);
    return results.map(el => el < 10 ? "0" + el : el).join(":");
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
    const clone = cloneDeep(stage);
    const cloneItems = clone.steps;
    const fromIndex = stepFrom.current;
    const toIndex = stepTo.current;
    [cloneItems[fromIndex], cloneItems[toIndex]] = [cloneItems[toIndex], cloneItems[fromIndex]];
    saveChange(clone, 'stage', stage.id);
  }

  const onDragStartItem = (e, index) => {
    stageItemFrom.current = index;
  }

  const onDragOverItem = (index) => {
    stageItemTo.current = index;
    if (stageItemFrom.current === index) {
      return;
    }
  }

  const onDragEndItem = (e) => {
    e.stopPropagation();
    const clone = cloneDeep(stage);
    const cloneItems = clone.items;
    const fromIndex = stageItemFrom.current;
    const toIndex = stageItemTo.current;
    [cloneItems[fromIndex], cloneItems[toIndex]] = [cloneItems[toIndex], cloneItems[fromIndex]];
    saveChange(clone, 'stage', stage.id);
  }

  const data = <Form
                 data={stage}
                 toggleTooltip={toggleTooltip}
                 stageId={stage.id}
                 saveChange={saveChange}
                />
  return (
    <>
      <div className="stage_block">
        <div className="delete_item" onClick={() => deleteStage(stage.id)}>&times;</div>
        <div className="hide_stage" onClick={() => setVis(!vis)}>
          {
            vis ? String.fromCharCode(10134) : String.fromCharCode(10133)
          }
        </div>
        <div className="description_block">
          <Tooltip content={data} isOpen={isOpen}>
            <div className="stage" onClick={toggleTooltip}>
                { stage.name }
            </div>
          </Tooltip>
          <div className="resp" onClick={toggleTooltip}>
            { stage.resp }
          </div>
          <div className="time" onClick={toggleTooltip}>
            { calculateTime() }
          </div>
          <hr className="hr"/>
        </div>
        <div className="task_block">
          {
            stage.items.map((stageItem, index) => (
              <div
                className="item"
                key={index}
                onClick={toggleTooltip}
                draggable
                onDragStart={e => onDragStartItem(e, index)}
                onDragOver={() => onDragOverItem(index)}
                onDragEnd={(e) => onDragEndItem(e)}
              >
                <div className="image">
                  <img src={require("../img/item.png")} alt="stage item"/>
                </div>
                <div className="name">
                  { stageItem.name }
                </div>
                <hr className="hr"/>
              </div>
            ))
          }
          {
            itemsCount < 3 &&
            <div className="item">
              <AddItem stageId={stage.id} addItem={addItem} type='stage'/>
            </div>
          }
        </div>
      </div>
      <hr className="end_stage" color="white"/>
      <div hidden={!vis}>
        {
          stage.steps.map((step, index) => (
            <div
              key={step.id}
              draggable
              onDragStart={e => onDragStart(e, index)}
              onDragOver={() => onDragOver(index)}
              onDragEnd={(e) => onDragEnd(e)}
            >
              <StepsBlock
                step={step}
                stageId={stage.id}
                addItem={addItem}
                saveChange={saveChange}
                deleteStep={deleteStep}
                />
            </div>
          ))
        }
      <AddStep id={stage.id} addStep={addStep}/>
      </div>
    </>
  )
}

export default StageBlock;
