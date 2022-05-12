const { Router } = require('express')
const router = Router()
const auth = require('../../middleware/auth.middleware')
//========================================================
// CATEGORY
// CRUD
router.post('/category/register', auth, (req, res) => {
  require('./category').register(req, res)
})

router.post('/category/getall', auth, (req, res) => {
  require('./category').getAll(req, res)
})

router.put('/category/update', auth, (req, res) => {
  require('./category').update(req, res)
})

router.delete('/category/delete', auth, (req, res) => {
  require('./category').delete(req, res)
})

//========================================================
// PRODUCT
router.post('/product/registerall', auth, (req, res) => {
  require('./product').registerAll(req, res)
})

router.post('/product/register', auth, (req, res) => {
  require('./product').register(req, res)
})

router.put('/product/update', auth, (req, res) => {
  require('./product').update(req, res)
})

router.delete('/product/delete', auth, (req, res) => {
  require('./product').delete(req, res)
})

router.post('/product/getallcategory', auth, (req, res) => {
  require('./product').getAllcategory(req, res)
})

router.post('/product/getall', auth, (req, res) => {
  require('./product').getAll(req, res)
})

router.delete('/product/deleteall', auth, (req, res) => {
  require('./product').deleteAll(req, res)
})

router.delete('/product/deleteallcategory', auth, (req, res) => {
  require('./product').deleteAllcategory(req, res)
})

//========================================================
// PRODUCTTYPE
router.post('/producttype/register', auth, (req, res) => {
  require('./producttype').register(req, res)
})

router.put('/producttype/update', auth, (req, res) => {
  require('./producttype').update(req, res)
})

router.delete('/producttype/delete', auth, (req, res) => {
  require('./producttype').delete(req, res)
})

router.post('/producttype/getall', auth, (req, res) => {
  require('./producttype').getAll(req, res)
})

router.post('/producttype/getallcategory', auth, (req, res) => {
  require('./producttype').getAllcategory(req, res)
})

router.delete('/producttype/deleteall', auth, (req, res) => {
  require('./producttype').deleteAll(req, res)
})

router.delete('/producttype/deleteallcategory', auth, (req, res) => {
  require('./producttype').deleteAllcategory(req, res)
})

//========================================================
// UNIT
// CRUD
router.post('/unit/register', auth, (req, res) => {
  require('./unit').register(req, res)
})

router.post('/unit/getall', auth, (req, res) => {
  require('./unit').getAll(req, res)
})

router.put('/unit/update', auth, (req, res) => {
  require('./unit').update(req, res)
})

router.delete('/unit/delete', auth, (req, res) => {
  require('./unit').delete(req, res)
})

//========================================================
// INCOMING
// CRUD
router.post('/incoming/registerall', auth, (req, res) => {
  require('./incoming').registerAll(req, res)
})

router.post('/incoming/register', auth, (req, res) => {
  require('./incoming').register(req, res)
})

router.post('/incoming/get', auth, (req, res) => {
  require('./incoming').get(req, res)
})

router.put('/incoming/update', auth, (req, res) => {
  require('./incoming').update(req, res)
})

router.delete('/incoming/delete', auth, (req, res) => {
  require('./incoming').delete(req, res)
})

router.post('/incoming/getconnectors', auth, (req, res) => {
  require('./incoming').getConnectors(req, res)
})

//========================================================
// BRAND
// CRUD
router.post('/brand/register', auth, (req, res) => {
  require('./brand').register(req, res)
})

router.post('/brand/getall', auth, (req, res) => {
  require('./brand').getAll(req, res)
})

router.put('/brand/update', auth, (req, res) => {
  require('./brand').update(req, res)
})

router.delete('/brand/delete', auth, (req, res) => {
  require('./brand').delete(req, res)
})
module.exports = router
