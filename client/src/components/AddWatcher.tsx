import React, { useState } from 'react';

type Props = {
  addWatcher: (e: React.FormEvent, formData: Watcher | any) => void;
}

const AddWatcher: React.FC<Props> = ({ addWatcher }) => {
  const [formData, setFormData] = useState<Watcher | {}>()

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  return (
    <form className='Form' onSubmit={(e) => addWatcher(e, formData)}>
      <div>
        <div>
          <label htmlFor='url'>Url</label>
          <input onChange={handleForm} type='text' id='url' />
        </div>
        <div>
          <label htmlFor='symbol'>Symbol</label>
          <input onChange={handleForm} type='text' id='symbol' />
        </div>
      </div>
      <button disabled={formData === undefined ? true : false} >Add Watcher</button>
    </form>
  )
};

export default AddWatcher;