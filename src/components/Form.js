import React, { useState, useEffect } from 'react';
import './Form.scss';

const Form = ({ data, toggleTooltip, stageId, saveChange }) => {
  const itStep = data.hasOwnProperty('time');
  const [state, setState] = useState(data);
  const [error, setError] = useState(false);
  useEffect(() => {
    setState(data)
  }, [data.items])
  const testTime = (time) => {
    const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/g;
    return re.test(time);
  }
  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    let timeIsWrong = false;
    if (key === 'time') {
      timeIsWrong = !testTime(value);
    }
    if (timeIsWrong) {
      setError(true)
    } else {
      setError(false)
    }
    if (key.indexOf(":") !== -1 ) {
      const index = +key.split(":")[1];
      const item = {...state.items[index], name: value};
      const newItems = state.items.slice(0, index).concat(item, state.items.slice(index+1));
      setState({...state, items: newItems})
    } else {
      setState({...state, [key]: value});
    }
  }

  const cancelChange = () => {
    setState(data);
  }

  const handleSave = () => {
    const type = itStep ? 'step' : 'stage';
    if (!error) {
      saveChange(state, type, stageId);
      toggleTooltip();
    } else {
      alert('Неверный формат времени')
    }
  }

  return (
    <>
      <h4>Корректировка данных {
        itStep ? 'шага' : 'этапа'
        }
      </h4>
      <div className="form">
        <div className="field">
          <label>Название:</label>
          <input type="text" name="name" value={state.name} onChange={handleChange}/>
        </div>
        <div className="field">
          <label>Ответственный:</label>
          <input type="text" name="resp" value={state.resp} onChange={handleChange}/>
        </div>
        {
          itStep &&
          <div className="field">
            <label>Время:</label>
            <input type="text" name="time" value={state.time} onChange={handleChange}/>
          </div>
        }
        {
          state.items.map((item, index) => (
            <div className="field" key={item.id}>
              <label>Элемент {index+1}:</label>
              <input type="text" name={'item:'+index} value={item.name} onChange={handleChange}/>
            </div>
          ))
        }
        <div className="form_button">
          <button onClick={() => {handleSave()}}>Сохранить</button>
        </div>
        <div className="form_button">
          <button onClick={() => {toggleTooltip(); cancelChange()}}>Отменить</button>
        </div>
      </div>
    </>
  )
}


export default Form;
