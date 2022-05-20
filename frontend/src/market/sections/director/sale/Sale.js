import { useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import { Modal } from '../components/Modal'
import { InputProduct } from './components/InputProduct'
// import { Payment } from './Payment'
import { Products } from './Products'
import { Selling } from './Selling'
// import { Card } from './payment/Card'

export const Sale = () => {

    //====================================================================
    //====================================================================
    const toast = useToast()

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            })
        },
        [toast]
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // AUTH
    const { request } = useHttp()
    const auth = useContext(AuthContext)

    const [modal, setModal] = useState(false)
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [categories, setCategories] = useState([{
        label: "Barcha kategoriyalar",
        value: "all"
    }])

    const getCategories = useCallback(async () => {
        try {
            const data = await request(
                `/api/products/category/getall`,
                "POST",
                { market: auth.market._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            )
            let c = [{
                label: "Barcha kategoriyalar",
                value: "all"
            }]
            data.map((category) => {
                return c.push({
                    label: category.code,
                    type: "Category",
                    value: category
                })
            })
            setCategories(c)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            })
        }
    }, [request, auth, notify])

    const changeCategory = (e) => {
        if (e.value === 'all') {
            return setProductTypes(allproducttypes)
        }
        const filter = allproducttypes.filter((producttype) => {
            return producttype.value.category._id === e.value._id
        })
        setProductTypes(filter)
        getProducts(e)
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [allproducttypes, setAllProductTypes] = useState([])
    const [producttypes, setProductTypes] = useState([])

    const getProductTypes = useCallback(async () => {
        try {
            const data = await request(
                `/api/products/producttype/getall`,
                "POST",
                { market: auth.market._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            )
            let c = []
            data.map((type) => {
                return c.push({
                    label: type.name,
                    type: "ProductType",
                    value: type
                })
            })
            setProductTypes(c)
            setAllProductTypes(c)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            })
        }
    }, [request, auth, notify])

    const changeProductType = (e) => {
        getProducts(e)
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [brands, setBrands] = useState([])

    const getBrand = useCallback(async () => {
        try {
            const data = await request(
                `/api/products/brand/getall`,
                "POST",
                { market: auth.market._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            )
            let c = []
            data.map((type) => {
                return c.push({
                    label: type.name,
                    type: "Brand",
                    value: type
                })
            })
            setBrands(c)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            })
        }
    }, [request, auth, notify])

    const changeBrand = (e) => {
        getProducts(e)
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [products, setProducts] = useState([])
    const [saleproduct, setSaleProduct] = useState()

    const getProducts = useCallback(async (type) => {
        try {
            const data = await request(
                `/api/products/product/getsale`,
                "POST",
                { market: auth.market._id, type: type.type, typeid: type.value._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            )
            let c = []
            data.map((type) => {
                return c.push({
                    label: type.code + " " + type.name,
                    type: "product",
                    value: type
                })
            })
            setProducts(c)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            })
        }
    }, [request, auth, notify])

    const changeProduct = (e) => {
        setModal(true)
        setSaleProduct({
            ...e.value,
            totalprice: e.value.price.sellingprice,
            pieces: 1,
            unitprice: e.value.price.sellingprice
        });
    }

    const setCounts = (e) => {
        let pieces = saleproduct.pieces
        let unitprice = saleproduct.unitprice
        let totalprice = saleproduct.totalprice
        if (e.target.name === 'pieces') {
            totalprice = (!unitprice ? 0 : unitprice) * parseInt(e.target.value)
            setSaleProduct({
                ...saleproduct,
                pieces: parseInt(e.target.value),
                totalprice: e.target.value === '' ? 0 : totalprice
            })
        }
        if (e.target.name === 'unitprice') {
            totalprice = (!pieces ? 0 : pieces) * parseInt(e.target.value)
            setSaleProduct({
                ...saleproduct,
                unitprice: parseInt(e.target.value),
                totalprice: e.target.value === '' ? 0 : totalprice
            })
        }
    }
    //====================================================================
    //====================================================================

    // ===================================================================
    // ===================================================================
    const [packmans, setPackmans] = useState([])

    const getPackmans = useCallback(async (type) => {
        try {
            const data = await request(
                `/api/sales/packman/getall`,
                "POST",
                { market: auth.market._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            )
            let v = []

            data.map((type) => {
                return v.push({
                    label: type.name,
                    value: type._id
                })
            })
            setPackmans(v)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            })
        }
    }, [request, auth, notify])
    //====================================================================
    //====================================================================


    //====================================================================
    //====================================================================

    const [clients, setClients] = useState([])

    const getClients = useCallback(async (type) => {
        try {
            const data = await request(
                `/api/sales/client/getall`,
                "POST",
                { market: auth.market._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            )
            let v = []

            data.map((type) => {
                return v.push({
                    label: type.name,
                    value: type._id
                })
            })
            setClients(v)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            })
        }
    }, [request, auth, notify])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================

    const [packman, setPackman] = useState({})

    const changePackman = (e) => {
        setPackman({
            name: e.label,
            _id: e.value
        })
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [client, setClient] = useState({})

    const changeClient = (e) => {
        setClient({
            name: e.label,
            _id: e.value
        })
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [t, setT] = useState()
    useEffect(() => {
        if (!t) {
            setT(1)
            getCategories()
            getProductTypes()
            getBrand()
            getPackmans()
            getClients()

        }
    }, [getCategories, getProductTypes, getBrand, getPackmans, getClients, t])
    //====================================================================
    //====================================================================

    return (
        <div className='p-3'>
            {/* <Card/> */}
            {/* <Payment /> */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                <div className='md:col-span-2 w-full'>
                    <Products
                        changeProduct={changeProduct}
                        changeBrand={changeBrand}
                        changeProductType={changeProductType}
                        changeCategory={changeCategory}
                        categories={categories}
                        producttypes={producttypes}
                        brands={brands}
                        products={products}
                    /></div>
                <div className='md:col-span-3 w-full'><Selling packmans={packmans} clients={clients} changePackman={changePackman} changeClient={changeClient} /></div>
            </div>

            <Modal
                modal={modal}
                setModal={setModal}
                basic={<InputProduct setCounts={setCounts} product={saleproduct} />}
            // text={"mahsulotnti o'chirishni tasdiqlaysizmi?"}
            // handler={deleteHandler}
            />
        </div>
    )
}
