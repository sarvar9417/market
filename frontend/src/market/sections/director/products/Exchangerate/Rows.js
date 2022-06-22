import React from 'react';
import { DeleteBtn, EditBtn } from '../../components/TableButtons';

export const Rows = ({
  s,
  index,
  setExchangerate,
  setRemove,
  setModal,
  remove,
}) => {
  return (
    <ul className='tr'>
      <li className='no'>{1 + index}</li>
      <li className='col-span-3 td border-r font-bold'>
        {new Date(s.createdAt).toLocaleDateString()}
      </li>
      <li className='col-span-4 td border-r font-bold'>{s.exchangerate}</li>
      <li className='td-btn col-span-2 border-r'>
        {<EditBtn editHandler={() => setExchangerate({ ...s })} />}
      </li>
      <li className='td-btn col-span-2'>
        {
          <DeleteBtn
            deleteHandler={() => {
              setRemove({ ...remove, ...s });
              setModal(true);
            }}
          />
        }
      </li>
    </ul>
  );
};