import React from 'react';

export const Rows = ({
  currentPage,
  index,
  sale,
  currency,
  changeCheck,
  type,
}) => {
  return (
    <>
      <ul
        className='tr font-bold'
        onClick={() => changeCheck(sale.saleconnector)}>
        <li className='no'>{currentPage * 10 + 1 + index}</li>
        <li className='col-span-1 td border-r font-bold text-right  flex justify-between'>
          <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
        </li>
        <li className='td col-span-2 border-r text-right'>{sale.id}</li>
        <li className='td col-span-2 border-r text-left'>
          {sale.client ? sale.client.name : ''}
        </li>
        <li className='td col-span-3 text-right border-r-2 border-r-blue-800'>
          {currency === 'UZS'
            ? (
                Math.round(
                  sale.products.reduce(
                    (summ, product) => summ + product.totalpriceuzs,
                    0
                  ) * 1
                ) / 1
              ).toLocaleString('ru-RU')
            : (
                Math.round(
                  sale.products.reduce(
                    (summ, product) => summ + product.totalprice,
                    0
                  ) * 1000
                ) / 1000
              ).toLocaleString('ru-RU')}{' '}
          <span className='text-blue-800'>{currency}</span>
        </li>
        <li className='td  col-span-3  text-right border-r-2 border-r-green-800'>
          {currency === 'UZS'
            ? (
                Math.round(
                  sale.payments.reduce(
                    (summ, payment) => summ + payment[type + 'uzs'],
                    0
                  ) * 1
                ) / 1
              ).toLocaleString('ru-RU')
            : (
                Math.round(
                  sale.payments.reduce(
                    (summ, payment) => summ + payment[type],
                    0
                  ) * 1000
                ) / 1000
              ).toLocaleString('ru-RU')}{' '}
          <span className='text-green-800'>{currency}</span>
        </li>
      </ul>
    </>
  );
};
