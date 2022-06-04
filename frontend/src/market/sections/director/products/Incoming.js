import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useToast } from '@chakra-ui/react';
import { RegisterIncoming } from './Incoming/RegisterIncoming';
import { useHttp } from './../../../hooks/http.hook';
import { AuthContext } from '../../../context/AuthContext';
import { TableIncoming } from './Incoming/components/TableIncoming';
import { ReportIncomings } from './Incoming/ReportIncomings';
import { Modal } from './modal/Modal';
import { t } from 'i18next';
import { RouterBtns } from './Incoming/RouterBtns';
import { ModalTable } from './Incoming/ModalTable';

export const Incoming = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
  );
  //====================================================================
  //====================================================================

  const [currentPage, setCurrentPage] = useState(0);
  const [countPage, setCountPage] = useState(10);

  // const indexLastImport = (currentPage + 1) * countPage;
  // const indexFirstImport = indexLastImport - countPage;
  const [currentImports, setCurrentImports] = useState([]);

  //====================================================================
  //====================================================================

  // MODAL
  const [modal, setModal] = useState(false);
  //   const [modal1, setModal1] = useState(false)
  //====================================================================
  //====================================================================

  const [visibleTable, setVisibleTable] = useState(false);
  const [visibleReport, setVisibleReport] = useState(true);

  //====================================================================
  //====================================================================
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const toast = useToast();

  const notify = useCallback(
    (data) => {
      toast({
        title: data.title && data.title,
        description: data.description && data.description,
        status: data.status && data.status,
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    [toast]
  );
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SUPPLIERS
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState({});

  const getSuppliers = useCallback(async () => {
    try {
      const data = await request(
        `/api/supplier/getall`,
        'POST',
        { market: auth.market._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      let s = [
        {
          label: 'Yetkazib beruvchilar',
          value: 'all',
        },
      ];
      data.map((supplier) => {
        return s.push({
          label: supplier.name,
          value: supplier._id,
          supplier: { ...supplier },
        });
      });
      setSuppliers(s);
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      });
    }
  }, [request, auth, notify]);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // CATEGORYS
  const [categorys, setCategorys] = useState([]);

  const getCategorys = useCallback(async () => {
    try {
      const data = await request(
        `/api/products/category/getall`,
        'POST',
        { market: auth.market._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      let s = [
        {
          label: 'Barcha kategriyalar',
          value: 'all',
        },
      ];
      data.map((category) => {
        return s.push({
          label:
            category && category.name
              ? category.code + ' - ' + category.name
              : category.code,
          value: category._id,
        });
      });
      setCategorys(s);
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      });
    }
  }, [request, auth, notify]);

  const changeCategory = (e) => {
    if (e.value === 'all') {
      setProductType(productTypes);
      setProducts(allproducts);
    } else {
      const filter = productTypes.filter(
        (producttype) =>
          producttype &&
          producttype.producttype &&
          producttype.producttype.category._id === e.value
      );
      const filter2 = allproducts.filter(
        (product) => product.category === e.value
      );
      setProductType(filter);
      setProducts(filter2);
    }
  };

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // PRODUCTTYPE
  const [productType, setProductType] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const getProductType = useCallback(async () => {
    try {
      const data = await request(
        `/api/products/producttype/getall`,
        'POST',
        { market: auth.market._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      let s = [
        {
          label: 'Barcha mahsulot turlari',
          value: 'all',
        },
      ];
      data.map((producttype) => {
        return s.push({
          label: producttype.name,
          value: producttype._id,
          producttype: { ...producttype },
        });
      });
      setProductType(s);
      setProductTypes(s);
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      });
    }
  }, [request, auth, notify]);

  const changeProductType = (e) => {
    if (e.value === 'all') {
      setProducts(allproducts);
    } else {
      const filter = allproducts.filter(
        (produc) =>
          produc && produc.product && produc.product.producttype === e.value
      );
      setProducts(filter);
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // Product
  const [allproducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [incomings, setIncomings] = useState([]);
  const [incoming, setIncoming] = useState({
    totalprice: 0,
    unitprice: 0,
    pieces: 0,
    user: auth.userId,
    supplier: '',
    product: {},
    category: '',
    producttype: '',
    brand: '',
    unit: '',
  });

  const getProducts = useCallback(async () => {
    try {
      const data = await request(
        `/api/products/product/getallincoming`,
        'POST',
        { market: auth.market._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      let s = [
        {
          label: 'Barcha mahsulotlar',
          value: 'all',
        },
      ];
      data.map((product) => {
        return s.push({
          label: (
            <span className='font-bold grid grid-cols-6'>
              <span>{product.code}</span>
              <span className='col-span-3'>{product.name}</span>
              <span className='col-span-2'>
                {product.brand && product.brand.name}
              </span>
            </span>
          ),
          value: product._id,
          category: product.category._id,
          product: { ...product },
        });
      });
      setProducts(s);
      setAllProducts(s);
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      });
    }
  }, [request, auth, notify]);

  const changeProduct = (e) => {
    if (e.value === 'all') {
      return setIncoming({
        totalprice: 0,
        unitprice: 0,
        pieces: 0,
        user: auth.userId,
        supplier: '',
        product: {},
        category: '',
        producttype: '',
        brand: '',
        unit: '',
      });
    }
    setIncoming({
      totalprice: 0,
      unitprice: 0,
      pieces: 0,
      user: auth.userId,
      supplier,
      product: {
        _id: e.product._id && e.product._id,
        name: e.product.name && e.product.name,
        code: e.product && e.product.code,
      },
      category: e.product.category && e.product.category,
      producttype: e.product.producttype && e.product.producttype,
      brand: e.product.brand && e.product.brand,
      unit: e.product.unit && e.product.unit,
    });
    setModal(true);
  };

  const addIncoming = () => {
    let i = [...incomings];
    i.unshift({ ...incoming });
    setIncomings(i);
    setIncoming({
      totalprice: 0,
      unitprice: 0,
      pieces: 0,
      user: auth.userId,
      supplier: '',
      product: {},
      category: '',
      producttype: '',
      brand: '',
      unit: '',
    });
    setModal(false);
  };

  const editIncoming = (product, index) => {
    setIncoming(product);
    let i = [...incomings];
    i.splice(index, 1);
    setIncomings(i);
    setModal(true);
  };

  const removeIncoming = (index) => {
    let i = [...incomings];
    i.splice(index, 1);
    setIncomings(i);
  };

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // CONNECTORS

  const [totalprice, setTotalPrice] = useState(0);
  const [totalproducts, setTotalProducts] = useState(0);
  const [totalproducttypes, setTotalProductTypes] = useState(0);

  const [dailyConnectors, setDailyConnectors] = useState([]);

  const daily = useCallback((connectors) => {
    let price = 0;
    let producttype = 0;
    let product = 0;
    let supplier = 0;
    let connectorss = [];
    let connector = {};
    for (const key in connectors) {
      if (key === '0') {
        connector.total = connectors[key].total;
        connector.producttypes = connectors[key].incoming.length;
        connector.products = connectors[key].incoming.reduce((summ, produc) => {
          return summ + produc.pieces;
        }, 0);
        connector.suppliers = 1;
        connector.day = connectors[key].createdAt;
      } else {
        if (
          new Date(connectors[parseInt(key)].createdAt).toLocaleDateString() ===
          new Date(connectors[parseInt(key) - 1].createdAt).toLocaleDateString()
        ) {
          connector.total += connectors[key].total;
          connector.producttypes += connectors[key].incoming.length;
          connector.suppliers += 1;
          connector.products += connectors[key].incoming.reduce(
            (summ, produc) => {
              return summ + produc.pieces;
            },
            0
          );
        } else {
          connectorss.push(connector);
          connector = {};
          connector.total = connectors[key].total;
          connector.producttypes = connectors[key].incoming.length;
          connector.products = connectors[key].incoming.reduce(
            (summ, produc) => {
              return summ + produc.pieces;
            },
            0
          );
          connector.suppliers = 1;
          connector.day = connectors[key].createdAt;
        }
      }
      price += connectors[key].total;
      producttype += connectors[key].incoming.length;
      product += connectors[key].incoming.reduce((summ, produc) => {
        return summ + produc.pieces;
      }, 0);
    }
    connectorss.push(connector);
    setTotalPrice(price);
    setTotalProducts(product);
    // setSupplier(supplier);
    setTotalProductTypes(producttype);
    setDailyConnectors(connectorss);
  }, []);

  const [connectors, setConnectors] = useState([]);
  const [supplierConnector, setSupplierConnector] = useState('all');

  const getIncomingConnectors = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/products/incoming/getconnectors`,
          'POST',
          { market: auth.market._id, beginDay, endDay },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setConnectors(data);
        daily(data);
      } catch (error) {
        notify({
          title: error,
          description: '',
          status: 'error',
        });
      }
    },
    [request, auth, notify, daily]
  );

  const sortSuppliers = (e) => {
    if (e.value === 'all') {
      daily(connectors);
      setSupplierConnector('all');
    } else {
      const filter = connectors.filter((item) => item.supplier._id === e.value);
      daily(filter);
      setSupplierConnector(`${e.value}`);
    }
  };
  //====================================================================
  //====================================================================
  // IMPORTS
  const [imports, setImports] = useState([]);
  const [searchStorage, setSearchStorage] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);

  const getImports = useCallback(
    async (beginDay) => {
      try {
        const data = await request(
          `/api/products/incoming/get`,
          'POST',
          {
            market: auth.market._id,
            beginDay: new Date(new Date(beginDay).setHours(0, 0, 0, 0)),
            endDay: new Date(
              new Date(
                new Date().setDate(new Date(endDay).getDate() + 1)
              ).setHours(0, 0, 0, 0)
            ),
            currentPage,
            countPage,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        let data2 = data.filter((item) => {
          if (supplierConnector === 'all') {
            return item;
          } else {
            return item.supplier._id === supplierConnector;
          }
        });
        setImports(data2);
        setSearchStorage(data2);
        setCurrentImports(data2);
        setDataExcel(data2);
        setVisibleReport(false);
        setVisibleTable(true);
      } catch (error) {
        notify({
          title: error,
          description: '',
          status: 'error',
        });
      }
    },
    [
      request,
      auth,
      notify,
      endDay,
      setVisibleTable,
      supplierConnector,
      currentPage,
      countPage,
    ]
  );

  useEffect(() => {
    getImports(beginDay, endDay);
  }, [currentPage, countPage, getImports, beginDay, endDay]);

  //====================================================================
  //====================================================================

  const [connectorCount, setConnectorCount] = useState(0);

  const getConnectorCount = useCallback(async () => {
    try {
      const data = await request(
        '/api/products/incoming/getcount',
        'POST',
        { market: auth.market._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setConnectorCount(data);
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      });
    }
  }, [auth, request, notify]);

  //====================================================================
  //====================================================================
  // Visible
  const [visible, setVisible] = useState(false);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchCategory = (e) => {
    const searching = allproducts.filter(
      (item) =>
        item.product.category.code.toString().includes(e.target.value) ||
        item.product.category.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
    );

    setProducts(searching);
  };

  const searchSupplier = (e) => {
    const searching = searchStorage.filter((item) =>
      item.supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setImports(searching);
    setCurrentImports(searching.slice(0, countPage));
  };

  const searchCategoryTable = (e) => {
    const searching = searchStorage.filter(
      (item) =>
        String(item.category.code).includes(e.target.value) ||
        String(item.product.code).includes(e.target.value)
    );
    setImports(searching);
    setCurrentImports(searching.slice(0, countPage));
  };

  const searchProduct = (e) => {
    const searching = searchStorage.filter(
      (item) =>
        item.producttype.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.product.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setImports(searching);
    setCurrentImports(searching.slice(0, countPage));
  };

  const searchBrand = (e) => {
    const searching = searchStorage.filter((item) =>
      item.brand.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setImports(searching);
    setCurrentImports(searching.slice(0, countPage));
  };

  //====================================================================
  //====================================================================

  const setPageSize = useCallback(
    (e) => {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentImports(imports.slice(0, e.target.value));
    },
    [imports]
  );

  //====================================================================
  //====================================================================
  // InputHandler

  const inputHandler = (e) => {
    if (e.target.name === 'pieces') {
      let val = e.target.value;
      setIncoming({
        ...incoming,
        pieces: val === '' ? '' : Math.round(val * 100) / 100,
        totalprice:
          val === ''
            ? ''
            : Math.round(incoming.unitprice * e.target.value * 100) / 100,
      });
    }
    if (e.target.name === 'unitprice') {
      let val = e.target.value;
      setIncoming({
        ...incoming,
        unitprice: val === '' ? '' : Math.round(val * 100) / 100,
        totalprice:
          val === ''
            ? '0'
            : Math.round(e.target.value * incoming.pieces * 100) / 100,
      });
    }
    if (e.target.name === 'totalprice') {
      let val = e.target.value;
      setIncoming({
        ...incoming,
        unitprice:
          val === '' || val === 0
            ? ''
            : Math.round((e.target.value / incoming.pieces) * 100) / 100,
        totalprice: val === '' ? '' : Math.round(val * 100) / 100,
      });
    }
  };
  //====================================================================
  //====================================================================

  const selectRef = {
    supplier: useRef(),
    category: useRef(),
    producttype: useRef(),
    product: useRef(),
  };

  const clearSelect = useCallback(() => {
    selectRef.supplier.current.selectOption({
      label: 'Yetkazib beruvchilar',
      value: 'all',
    });
    selectRef.category.current.selectOption({
      label: 'Barcha kategoriyalar',
      value: 'all',
    });
    selectRef.producttype.current.selectOption({
      label: 'Barcha mahsulot turlari',
      value: 'all',
    });
    selectRef.product.current.selectOption({
      label: 'Barcha mahsulotlar',
      value: 'all',
    });
  }, [
    selectRef.category,
    selectRef.supplier,
    selectRef.producttype,
    selectRef.product,
  ]);

  //====================================================================
  //====================================================================

  const changeConnectors = useCallback(
    (data) => {
      daily([...data]);
      setConnectors([...data]);
    },
    [daily]
  );

  //====================================================================
  //====================================================================
  // CreateHandler
  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/products/incoming/registerall`,
        'POST',
        {
          market: auth.market._id,
          user: auth.userId,
          products: [...incomings],
          beginDay,
          endDay,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      localStorage.setItem('data', data);
      changeConnectors(data);
      clearSelect();
      setIncomings([]);
      setIncoming({
        totalprice: 0,
        unitprice: 0,
        pieces: 0,
        user: auth.userId,
        supplier: '',
        product: {},
        category: '',
        producttype: '',
        brand: '',
        unit: '',
      });
      setVisible(false);
      notify({
        title: `Mahsulotlar qabul qilindi!`,
        description: '',
        status: 'success',
      });
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      });
    }
  }, [
    auth,
    request,
    beginDay,
    endDay,
    setIncomings,
    setIncoming,
    setVisible,
    incomings,
    notify,
    clearSelect,
    changeConnectors,
  ]);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getImports(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
  };

  const changeEnd = (e) => {
    const date = new Date(
      new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
        0,
        0,
        0,
        0
      )
    );

    setEndDay(date);
    getImports(beginDay, date);
  };

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // useEffect

  const [n, setN] = useState(0);

  useEffect(() => {
    if (auth.market && !n) {
      setN(1);
      getSuppliers();
      getCategorys();
      getProducts();
      getProductType();
      // getBrand();
      getConnectorCount();
      getIncomingConnectors(beginDay, endDay);
    }
  }, [
    auth,
    getSuppliers,
    n,
    getCategorys,
    getProducts,
    getProductType,
    // getBrand,
    getConnectorCount,
    beginDay,
    endDay,
    // getProductType,
    getIncomingConnectors,
  ]);

  //====================================================================
  //====================================================================

  return (
    <div className='m-3'>
      <RouterBtns changeVisible={setVisible} visible={visible} />
      <div className={` ${visible ? '' : 'd-none'}`}>
        <RegisterIncoming
          createHandler={createHandler}
          removeIncoming={removeIncoming}
          addIncoming={addIncoming}
          inputHandler={inputHandler}
          clearSelect={clearSelect}
          searchCategory={searchCategory}
          incomings={incomings}
          editIncoming={editIncoming}
          incoming={incoming}
          changeProduct={changeProduct}
          changeCategory={changeCategory}
          changeProductType={changeProductType}
          products={products}
          categorys={categorys}
          productType={productType}
          loading={loading}
          suppliers={suppliers}
          supplier={supplier}
          setSupplier={setSupplier}
          setModal={setModal}
          selectRef={selectRef}
        />
      </div>
      <div>
        <div className='content-wrapper px-lg-5 px-3'>
          <div className='row gutters'>
            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'></div>
            <div className='w-full mt-2'>
              <button
                className='w-full btn btn-primary py-1 rounded-t text-center text-white font-bold text-base'
                onClick={() => setVisibleReport(!visibleReport)}>
                {t('Qabul qilingan mahsulotlar')}
              </button>
              <div className={`${visibleReport ? 'd-block' : 'd-none'}`}>
                <ReportIncomings
                  getImports={getImports}
                  getIncomingConnectors={getIncomingConnectors}
                  totalproducts={totalproducts}
                  totalprice={totalprice}
                  totalproducttypes={totalproducttypes}
                  dailyConnectors={dailyConnectors}
                  suppliers={suppliers}
                  sortSuppliers={sortSuppliers}
                />
              </div>
            </div>
            <div className='w-full mt-2'>
              <div className='bg-primary py-1 rounded-t text-center text-white font-bold text-base'>
                {t('Jadval')}
              </div>
              <div className={`${visibleTable ? 'd-block' : 'd-none'}`}>
                <TableIncoming
                  currentImports={currentImports}
                  imports={imports}
                  setCurrentImports={setCurrentImports}
                  setImports={setImports}
                  searchCategoryTable={searchCategoryTable}
                  searchSupplier={searchSupplier}
                  searchProduct={searchProduct}
                  searchBrand={searchBrand}
                  countPage={countPage}
                  setCountPage={setCountPage}
                  currentPage={currentPage}
                  setPageSize={setPageSize}
                  loading={loading}
                  dataExcel={dataExcel}
                  changeStart={changeStart}
                  changeEnd={changeEnd}
                  setCurrentPage={setCurrentPage}
                  connectorCount={connectorCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        modal={modal}
        setModal={setModal}
        handler={addIncoming}
        text={<ModalTable incoming={incoming} inputHandler={inputHandler} />}
      />
    </div>
  );
};
