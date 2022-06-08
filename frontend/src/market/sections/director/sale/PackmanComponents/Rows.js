import React from 'react';
import { DeleteBtn, EditBtn } from '../../components/TableButtons';

export const Rows = ({
  currentPage,
  index,
  p,
  setPackman,
  setRemove,
  setModal,
}) => {
  return (
    <ul className='tr'>
      <li className='no col-span-2'>{currentPage * 10 + 1 + index}</li>
      <li className='col-span-6 td border-r'>{p.name}</li>
      <li className='td-btn col-span-2 border-r'>
        {<EditBtn editHandler={() => setPackman({ ...p })} />}
      </li>
      <li className='td-btn col-span-2'>
        {
          <DeleteBtn
            deleteHandler={() => {
              setRemove({ ...p });
              setModal(true);
            }}
          />
        }
      </li>
    </ul>
  );
};
